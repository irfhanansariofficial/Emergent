from fastapi import FastAPI, APIRouter, HTTPException, Cookie, Response, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'beauglow-secret-key-2026')
JWT_ALGORITHM = 'HS256'

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Helper Functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_jwt_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get current user from session_token cookie or Authorization header"""
    token = session_token
    
    # Fallback to Authorization header
    if not token:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Check session in database
    session_doc = await db.user_sessions.find_one(
        {"session_token": token},
        {"_id": 0}
    )
    
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    # Check expiry
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    # Get user
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0, "password": 0}
    )
    
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user_doc

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthCallback(BaseModel):
    session_id: str

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    product_id: str
    name: str
    description: str
    price: float
    original_price: Optional[float] = None
    category: str
    subcategory: Optional[str] = None
    image_url: str
    ingredients: List[str] = []
    rating: float = 4.5
    reviews_count: int = 0
    in_stock: bool = True
    is_trending: bool = False
    is_bestseller: bool = False
    created_at: datetime

class CartItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    cart_item_id: str
    user_id: str
    product_id: str
    quantity: int
    added_at: datetime

class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = 1

class WishlistItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    wishlist_id: str
    user_id: str
    product_id: str
    added_at: datetime

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    order_id: str
    user_id: str
    items: List[dict]
    total_amount: float
    customer_details: dict
    status: str = "pending"
    payment_method: str = "COD"
    created_at: datetime

class OrderCreate(BaseModel):
    customer_details: dict
    items: List[dict]
    total_amount: float

# Auth Routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    hashed_pwd = hash_password(user_data.password)
    
    user_doc = {
        "user_id": user_id,
        "email": user_data.email,
        "password": hashed_pwd,
        "name": user_data.name,
        "picture": None,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.users.insert_one(user_doc)
    
    # Create session
    session_token = f"session_{uuid.uuid4().hex}"
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    }
    await db.user_sessions.insert_one(session_doc)
    
    # Return user without password
    user_response = await db.users.find_one(
        {"user_id": user_id},
        {"_id": 0, "password": 0}
    )
    
    return {"user": user_response, "session_token": session_token}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    # Find user
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(credentials.password, user_doc["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create session
    session_token = f"session_{uuid.uuid4().hex}"
    session_doc = {
        "user_id": user_doc["user_id"],
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    }
    await db.user_sessions.insert_one(session_doc)
    
    # Return user without password
    user_response = await db.users.find_one(
        {"user_id": user_doc["user_id"]},
        {"_id": 0, "password": 0}
    )
    
    return {"user": user_response, "session_token": session_token}

@api_router.post("/auth/google-callback")
async def google_auth_callback(callback_data: GoogleAuthCallback):
    """Exchange session_id for user data from Emergent Auth"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": callback_data.session_id},
                timeout=10.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid session_id")
            
            auth_data = response.json()
    except Exception as e:
        logging.error(f"Error fetching session data: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed")
    
    # Check if user exists
    user_doc = await db.users.find_one({"email": auth_data["email"]})
    
    if user_doc:
        # Update existing user
        await db.users.update_one(
            {"email": auth_data["email"]},
            {"$set": {
                "name": auth_data["name"],
                "picture": auth_data.get("picture")
            }}
        )
        user_id = user_doc["user_id"]
    else:
        # Create new user
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        new_user = {
            "user_id": user_id,
            "email": auth_data["email"],
            "name": auth_data["name"],
            "picture": auth_data.get("picture"),
            "created_at": datetime.now(timezone.utc)
        }
        await db.users.insert_one(new_user)
    
    # Use session_token from Emergent or create new
    session_token = auth_data.get("session_token", f"session_{uuid.uuid4().hex}")
    
    # Store session
    session_doc = {
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
        "created_at": datetime.now(timezone.utc)
    }
    await db.user_sessions.insert_one(session_doc)
    
    # Get user data
    user_response = await db.users.find_one(
        {"user_id": user_id},
        {"_id": 0, "password": 0}
    )
    
    return {"user": user_response, "session_token": session_token}

@api_router.get("/auth/me")
async def get_me(request: Request, session_token: Optional[str] = Cookie(None)):
    """Get current user information"""
    user = await get_current_user(request, session_token)
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response, session_token: Optional[str] = Cookie(None)):
    """Logout user"""
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie("session_token")
    return {"message": "Logged out successfully"}

# Product Routes
@api_router.get("/products", response_model=List[Product])
async def get_products(
    category: Optional[str] = None,
    trending: Optional[bool] = None,
    bestseller: Optional[bool] = None,
    limit: int = 50
):
    query = {}
    if category:
        query["category"] = category
    if trending is not None:
        query["is_trending"] = trending
    if bestseller is not None:
        query["is_bestseller"] = bestseller
    
    products = await db.products.find(query, {"_id": 0}).limit(limit).to_list(limit)
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"product_id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.get("/categories")
async def get_categories():
    categories = await db.products.distinct("category")
    return {"categories": categories}

# Cart Routes
@api_router.get("/cart")
async def get_cart(request: Request, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(request, session_token)
    
    cart_items = await db.cart.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).to_list(100)
    
    # Enrich with product details - optimized bulk query
    if cart_items:
        product_ids = [item["product_id"] for item in cart_items]
        products = await db.products.find(
            {"product_id": {"$in": product_ids}},
            {"_id": 0}
        ).to_list(100)
        products_map = {p["product_id"]: p for p in products}
        
        for item in cart_items:
            item["product"] = products_map.get(item["product_id"])
    
    return {"items": cart_items}

@api_router.post("/cart")
async def add_to_cart(
    item: CartItemCreate,
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    user = await get_current_user(request, session_token)
    
    # Check if item already in cart
    existing = await db.cart.find_one({
        "user_id": user["user_id"],
        "product_id": item.product_id
    })
    
    if existing:
        # Update quantity
        await db.cart.update_one(
            {"cart_item_id": existing["cart_item_id"]},
            {"$set": {"quantity": existing["quantity"] + item.quantity}}
        )
        return {"message": "Cart updated"}
    else:
        # Add new item
        cart_item = {
            "cart_item_id": f"cart_{uuid.uuid4().hex[:12]}",
            "user_id": user["user_id"],
            "product_id": item.product_id,
            "quantity": item.quantity,
            "added_at": datetime.now(timezone.utc)
        }
        await db.cart.insert_one(cart_item)
        return {"message": "Added to cart"}

@api_router.delete("/cart/{cart_item_id}")
async def remove_from_cart(
    cart_item_id: str,
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    user = await get_current_user(request, session_token)
    
    result = await db.cart.delete_one({
        "cart_item_id": cart_item_id,
        "user_id": user["user_id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    return {"message": "Removed from cart"}

@api_router.put("/cart/{cart_item_id}")
async def update_cart_quantity(
    cart_item_id: str,
    quantity: int,
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    user = await get_current_user(request, session_token)
    
    result = await db.cart.update_one(
        {"cart_item_id": cart_item_id, "user_id": user["user_id"]},
        {"$set": {"quantity": quantity}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    return {"message": "Quantity updated"}

# Wishlist Routes
@api_router.get("/wishlist")
async def get_wishlist(request: Request, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(request, session_token)
    
    wishlist_items = await db.wishlist.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).to_list(100)
    
    # Enrich with product details - optimized bulk query
    if wishlist_items:
        product_ids = [item["product_id"] for item in wishlist_items]
        products = await db.products.find(
            {"product_id": {"$in": product_ids}},
            {"_id": 0}
        ).to_list(100)
        products_map = {p["product_id"]: p for p in products}
        
        for item in wishlist_items:
            item["product"] = products_map.get(item["product_id"])
    
    return {"items": wishlist_items}

@api_router.post("/wishlist/{product_id}")
async def add_to_wishlist(
    product_id: str,
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    user = await get_current_user(request, session_token)
    
    # Check if already in wishlist
    existing = await db.wishlist.find_one({
        "user_id": user["user_id"],
        "product_id": product_id
    })
    
    if existing:
        return {"message": "Already in wishlist"}
    
    wishlist_item = {
        "wishlist_id": f"wish_{uuid.uuid4().hex[:12]}",
        "user_id": user["user_id"],
        "product_id": product_id,
        "added_at": datetime.now(timezone.utc)
    }
    await db.wishlist.insert_one(wishlist_item)
    return {"message": "Added to wishlist"}

@api_router.delete("/wishlist/{product_id}")
async def remove_from_wishlist(
    product_id: str,
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    user = await get_current_user(request, session_token)
    
    result = await db.wishlist.delete_one({
        "product_id": product_id,
        "user_id": user["user_id"]
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    
    return {"message": "Removed from wishlist"}

# Order Routes
@api_router.post("/orders")
async def create_order(
    order_data: OrderCreate,
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    user = await get_current_user(request, session_token)
    
    order = {
        "order_id": f"order_{uuid.uuid4().hex[:12]}",
        "user_id": user["user_id"],
        "items": order_data.items,
        "total_amount": order_data.total_amount,
        "customer_details": order_data.customer_details,
        "status": "pending",
        "payment_method": "COD",
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.orders.insert_one(order)
    
    # Clear cart after order
    await db.cart.delete_many({"user_id": user["user_id"]})
    
    return {"order_id": order["order_id"], "message": "Order placed successfully"}

@api_router.get("/orders")
async def get_orders(request: Request, session_token: Optional[str] = Cookie(None)):
    user = await get_current_user(request, session_token)
    
    orders = await db.orders.find(
        {"user_id": user["user_id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {"orders": orders}

@api_router.get("/orders/{order_id}")
async def get_order(
    order_id: str,
    request: Request,
    session_token: Optional[str] = Cookie(None)
):
    user = await get_current_user(request, session_token)
    
    order = await db.orders.find_one(
        {"order_id": order_id, "user_id": user["user_id"]},
        {"_id": 0}
    )
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order

# Newsletter
@api_router.post("/newsletter")
async def subscribe_newsletter(email: EmailStr):
    existing = await db.newsletter.find_one({"email": email})
    if existing:
        return {"message": "Already subscribed"}
    
    await db.newsletter.insert_one({
        "email": email,
        "subscribed_at": datetime.now(timezone.utc)
    })
    return {"message": "Subscribed successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()