# BeauGlow India - Premium Beauty & Cosmetics E-commerce

A fully functional, premium beauty & cosmetics e-commerce website with Indian aesthetic, built with React + FastAPI + MongoDB.

---

## 🏗️ Project Structure

```
/
├── backend/                    # FastAPI Backend
│   ├── server.py              # Main application (all API routes)
│   ├── seed_data.py           # Database seeding script (18 products)
│   ├── .env                   # Backend environment variables
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   └── index.html         # HTML entry point
│   ├── src/
│   │   ├── index.js           # React entry point
│   │   ├── index.css          # Global styles (Tailwind)
│   │   ├── App.js             # Main app (routing, auth context, cart context)
│   │   ├── App.css            # Custom animations & styles
│   │   ├── pages/
│   │   │   ├── HomePage.js        # Landing page (hero, categories, products)
│   │   │   ├── ProductsPage.js    # Product listing with filters
│   │   │   ├── ProductDetailPage.js # Single product view
│   │   │   ├── CartPage.js        # Shopping cart
│   │   │   ├── CheckoutPage.js    # Checkout with COD
│   │   │   ├── WishlistPage.js    # Saved products
│   │   │   ├── OrdersPage.js      # Order history
│   │   │   ├── AuthPage.js        # Login/Register + Google OAuth
│   │   │   ├── AboutPage.js       # About the brand
│   │   │   └── ContactPage.js     # Contact form + info
│   │   └── components/
│   │       ├── Header.js          # Sticky navigation
│   │       ├── Footer.js          # Footer with newsletter
│   │       ├── AuthCallback.js    # Google OAuth handler
│   │       ├── WhatsAppButton.js  # Floating WhatsApp button
│   │       └── ui/               # Shadcn UI components
│   ├── .env                   # Frontend environment variables
│   ├── package.json           # Node.js dependencies
│   ├── tailwind.config.js     # Tailwind CSS config
│   └── postcss.config.js      # PostCSS config
│
└── README.md                  # This file
```

---

## 🚀 Features

- **Premium UI** - Soft pastels, gold accents, Playfair Display typography
- **Product Catalog** - 18 Indian beauty products across 5 categories
- **Dual Authentication** - Email/Password (JWT) + Google OAuth
- **Shopping Cart** - Add, update quantity, remove items
- **Wishlist** - Save favorite products
- **Checkout** - Cash on Delivery (COD) payment
- **Order Tracking** - View placed orders
- **Newsletter** - Email subscription
- **WhatsApp Integration** - Floating chat button
- **Fully Responsive** - Mobile-first design
- **Smooth Animations** - Framer Motion

---

## ⚙️ Prerequisites

- **Node.js** >= 18.x
- **Python** >= 3.9
- **MongoDB** >= 6.0 (local or cloud like MongoDB Atlas)
- **Yarn** (package manager for frontend)

---

## 🛠️ Local Setup Instructions

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd beauglow-india
```

### Step 2: Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Seed the database with products
python seed_data.py

# Start the backend server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Step 3: Setup Frontend

```bash
cd frontend

# Install dependencies
yarn install

# Configure environment variables
cp .env.example .env
# Edit .env with your backend URL

# Start the development server
yarn start
```

### Step 4: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8001/api

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `beauglow_db` |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:3000` |
| `JWT_SECRET` | Secret for JWT tokens (optional, has default) | `your-secret-key` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Backend API base URL | `http://localhost:8001` |

---

## 🗄️ Database Schema (MongoDB)

### Collections:

**users**
```json
{
  "user_id": "user_abc123def456",
  "email": "user@example.com",
  "password": "$2b$12$hashed...",  // bcrypt hashed (only for email/password auth)
  "name": "User Name",
  "picture": "https://...",        // Google profile picture (optional)
  "created_at": "2026-04-07T08:00:00Z"
}
```

**user_sessions**
```json
{
  "user_id": "user_abc123def456",
  "session_token": "session_xyz789...",
  "expires_at": "2026-04-14T08:00:00Z",
  "created_at": "2026-04-07T08:00:00Z"
}
```

**products**
```json
{
  "product_id": "prod_eye_001",
  "name": "Kajal Supreme",
  "description": "...",
  "price": 299,
  "original_price": 499,
  "category": "Eye Makeup",
  "subcategory": "Kajal",
  "image_url": "https://...",
  "ingredients": ["Almond Oil", "Camphor"],
  "rating": 4.6,
  "reviews_count": 234,
  "in_stock": true,
  "is_trending": true,
  "is_bestseller": false,
  "created_at": "2026-04-07T08:00:00Z"
}
```

**cart**
```json
{
  "cart_item_id": "cart_abc123",
  "user_id": "user_abc123def456",
  "product_id": "prod_eye_001",
  "quantity": 2,
  "added_at": "2026-04-07T08:00:00Z"
}
```

**wishlist**
```json
{
  "wishlist_id": "wish_abc123",
  "user_id": "user_abc123def456",
  "product_id": "prod_eye_001",
  "added_at": "2026-04-07T08:00:00Z"
}
```

**orders**
```json
{
  "order_id": "order_abc123",
  "user_id": "user_abc123def456",
  "items": [{"product_id": "...", "product_name": "...", "quantity": 1, "price": 299}],
  "total_amount": 299,
  "customer_details": {"name": "...", "email": "...", "phone": "...", "address": "...", "city": "...", "state": "...", "pincode": "..."},
  "status": "pending",
  "payment_method": "COD",
  "created_at": "2026-04-07T08:00:00Z"
}
```

**newsletter**
```json
{
  "email": "user@example.com",
  "subscribed_at": "2026-04-07T08:00:00Z"
}
```

---

## 🌐 Deployment Guide

### Option A: Deploy on Render (Recommended - Free Tier Available)

**Backend:**
1. Create a new Web Service on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - Root Directory: `backend`
4. Add environment variables (MONGO_URL, DB_NAME, CORS_ORIGINS)

**Frontend:**
1. Create a new Static Site on Render
2. Connect your GitHub repo
3. Set:
   - Build Command: `yarn install && yarn build`
   - Publish Directory: `build`
   - Root Directory: `frontend`
4. Add environment variable: `REACT_APP_BACKEND_URL=https://your-backend.onrender.com`

**Database:**
- Use [MongoDB Atlas](https://www.mongodb.com/atlas) free tier (M0)
- Create a cluster, get connection string, use in MONGO_URL

---

### Option B: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Add two services:
   - **Backend service**: Root directory `backend`, start command `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Frontend service**: Root directory `frontend`, build command `yarn build`
4. Add a MongoDB plugin from Railway's marketplace
5. Set environment variables for both services

---

### Option C: Deploy on Hostinger (VPS)

1. Get a VPS plan on Hostinger
2. SSH into your server
3. Install Node.js 18+, Python 3.9+, MongoDB 6+, Nginx

```bash
# Clone and setup backend
cd /var/www
git clone <your-repo> beauglow
cd beauglow/backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python seed_data.py

# Setup systemd service for backend
sudo nano /etc/systemd/system/beauglow-backend.service
# [Service]
# ExecStart=/var/www/beauglow/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
# WorkingDirectory=/var/www/beauglow/backend
# EnvironmentFile=/var/www/beauglow/backend/.env

sudo systemctl enable beauglow-backend
sudo systemctl start beauglow-backend

# Build frontend
cd /var/www/beauglow/frontend
yarn install && yarn build

# Configure Nginx
sudo nano /etc/nginx/sites-available/beauglow
```

**Nginx configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend (React build)
    location / {
        root /var/www/beauglow/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/beauglow /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 🔐 Authentication

### Email/Password
- Register at `/auth` page
- Login with email + password
- Sessions stored in MongoDB with 7-day expiry

### Google OAuth
- Click "Continue with Google" on auth page
- Uses Emergent Auth service (auth.emergentagent.com)
- **Note for self-hosting:** Replace with your own Google OAuth implementation:
  1. Create credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  2. Replace the Google OAuth callback endpoint in `server.py`
  3. Update frontend redirect URL in `AuthPage.js`

---

## 📦 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login with email/password |
| POST | `/api/auth/google-callback` | No | Google OAuth callback |
| GET | `/api/auth/me` | Yes | Get current user |
| POST | `/api/auth/logout` | Yes | Logout |
| GET | `/api/products` | No | List products (with filters) |
| GET | `/api/products/:id` | No | Get single product |
| GET | `/api/categories` | No | Get all categories |
| GET | `/api/cart` | Yes | Get user's cart |
| POST | `/api/cart` | Yes | Add item to cart |
| PUT | `/api/cart/:id` | Yes | Update cart item quantity |
| DELETE | `/api/cart/:id` | Yes | Remove cart item |
| GET | `/api/wishlist` | Yes | Get user's wishlist |
| POST | `/api/wishlist/:productId` | Yes | Add to wishlist |
| DELETE | `/api/wishlist/:productId` | Yes | Remove from wishlist |
| POST | `/api/orders` | Yes | Place new order |
| GET | `/api/orders` | Yes | Get user's orders |
| GET | `/api/orders/:id` | Yes | Get single order |
| POST | `/api/newsletter` | No | Subscribe to newsletter |

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Primary Color | `#f8d7da` (Soft Pink) |
| Secondary Color | `#f5e6da` (Nude Beige) |
| Accent Color | `#d4af37` (Gold) |
| Background | `#faf7f5` |
| Text Primary | `#332211` |
| Text Secondary | `#5c4a3d` |
| Heading Font | Playfair Display |
| Body Font | Poppins |
| Border Radius | 1rem (cards), 9999px (buttons) |

---

## 📝 License

MIT License - Free to use for personal and commercial projects.

---

## 🙏 Credits

- Images: Unsplash, Pexels
- Icons: Lucide React
- UI Components: Shadcn UI
- Animations: Framer Motion
