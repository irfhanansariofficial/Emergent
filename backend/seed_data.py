import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timezone
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Product data with images from design guidelines
products_data = [
    # Eye Makeup
    {
        "product_id": "prod_eye_001",
        "name": "Kajal Supreme - Long Lasting",
        "description": "Enriched with Ayurvedic ingredients like almond oil and camphor. Smudge-proof formula for intense black eyes.",
        "price": 299,
        "original_price": 499,
        "category": "Eye Makeup",
        "subcategory": "Kajal",
        "image_url": "https://images.unsplash.com/photo-1614520993709-fe26b76ae805",
        "ingredients": ["Almond Oil", "Camphor", "Castor Oil"],
        "rating": 4.6,
        "reviews_count": 234,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": False,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_eye_002",
        "name": "Volumizing Mascara - Natural Look",
        "description": "Infused with argan oil for lash care. Buildable formula for natural to dramatic looks.",
        "price": 599,
        "original_price": 899,
        "category": "Eye Makeup",
        "subcategory": "Mascara",
        "image_url": "https://static.prod-images.emergentagent.com/jobs/14e8ee04-2ea2-44e6-8949-ef4c9754eb2d/images/57d78540f7ef9d0b6bfa36c64b23771a9056c554325f255ff416373861499d85.png",
        "ingredients": ["Argan Oil", "Vitamin E", "Beeswax"],
        "rating": 4.4,
        "reviews_count": 156,
        "in_stock": True,
        "is_trending": False,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_eye_003",
        "name": "Eyebrow Definer - Natural Brown",
        "description": "Precision tip for perfect brows. Infused with castor oil for brow growth.",
        "price": 399,
        "original_price": None,
        "category": "Eye Makeup",
        "subcategory": "Eyebrow",
        "image_url": "https://images.unsplash.com/photo-1614520993709-fe26b76ae805",
        "ingredients": ["Castor Oil", "Vitamin E"],
        "rating": 4.5,
        "reviews_count": 189,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": False,
        "created_at": datetime.now(timezone.utc)
    },
    
    # Face Makeup
    {
        "product_id": "prod_face_001",
        "name": "BB Cream - Natural Glow SPF 30",
        "description": "Perfect for Indian skin tones. Enriched with turmeric and saffron for natural radiance.",
        "price": 699,
        "original_price": 999,
        "category": "Face Makeup",
        "subcategory": "Foundation",
        "image_url": "https://images.unsplash.com/photo-1599690901937-81d763397828",
        "ingredients": ["Turmeric", "Saffron", "Vitamin C"],
        "rating": 4.7,
        "reviews_count": 456,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_face_002",
        "name": "Compact Powder - Matte Finish",
        "description": "Controls shine all day. Infused with neem and sandalwood for healthy skin.",
        "price": 499,
        "original_price": 699,
        "category": "Face Makeup",
        "subcategory": "Powder",
        "image_url": "https://static.prod-images.emergentagent.com/jobs/14e8ee04-2ea2-44e6-8949-ef4c9754eb2d/images/698d2047aff0b758d06c1795bc486caa1112887bd9b052fa7acac24beb7faed2.png",
        "ingredients": ["Neem", "Sandalwood", "Aloe Vera"],
        "rating": 4.5,
        "reviews_count": 267,
        "in_stock": True,
        "is_trending": False,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_face_003",
        "name": "Liquid Highlighter - Golden Glow",
        "description": "Achieve that Indian bridal glow. Infused with gold dust and pearl extract.",
        "price": 799,
        "original_price": None,
        "category": "Face Makeup",
        "subcategory": "Highlighter",
        "image_url": "https://images.unsplash.com/photo-1599690901937-81d763397828",
        "ingredients": ["Gold Dust", "Pearl Extract", "Vitamin E"],
        "rating": 4.8,
        "reviews_count": 345,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_face_004",
        "name": "Lipstick - Rose Pink",
        "description": "Long-lasting matte finish. Enriched with shea butter for soft lips.",
        "price": 399,
        "original_price": 599,
        "category": "Face Makeup",
        "subcategory": "Lipstick",
        "image_url": "https://static.prod-images.emergentagent.com/jobs/14e8ee04-2ea2-44e6-8949-ef4c9754eb2d/images/57d78540f7ef9d0b6bfa36c64b23771a9056c554325f255ff416373861499d85.png",
        "ingredients": ["Shea Butter", "Vitamin E", "Rose Oil"],
        "rating": 4.6,
        "reviews_count": 523,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": False,
        "created_at": datetime.now(timezone.utc)
    },
    
    # Skincare
    {
        "product_id": "prod_skin_001",
        "name": "Kumkumadi Face Serum - Night Repair",
        "description": "Traditional Ayurvedic formula with saffron. Reduces pigmentation and enhances complexion.",
        "price": 1299,
        "original_price": 1899,
        "category": "Skincare",
        "subcategory": "Serum",
        "image_url": "https://images.pexels.com/photos/18066456/pexels-photo-18066456.jpeg",
        "ingredients": ["Saffron", "Sandalwood", "Lotus Extract", "Almond Oil"],
        "rating": 4.9,
        "reviews_count": 678,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_skin_002",
        "name": "Aloe Vera Gel - Pure & Natural",
        "description": "99% pure aloe vera from organic farms. Soothes and hydrates skin naturally.",
        "price": 299,
        "original_price": 399,
        "category": "Skincare",
        "subcategory": "Moisturizer",
        "image_url": "https://images.pexels.com/photos/18739319/pexels-photo-18739319.jpeg",
        "ingredients": ["Aloe Vera", "Vitamin E"],
        "rating": 4.7,
        "reviews_count": 892,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_skin_003",
        "name": "Turmeric Face Wash - Brightening",
        "description": "Removes tan and brightens skin. Infused with turmeric and neem.",
        "price": 349,
        "original_price": 499,
        "category": "Skincare",
        "subcategory": "Cleanser",
        "image_url": "https://static.prod-images.emergentagent.com/jobs/14e8ee04-2ea2-44e6-8949-ef4c9754eb2d/images/698d2047aff0b758d06c1795bc486caa1112887bd9b052fa7acac24beb7faed2.png",
        "ingredients": ["Turmeric", "Neem", "Honey"],
        "rating": 4.6,
        "reviews_count": 445,
        "in_stock": True,
        "is_trending": False,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_skin_004",
        "name": "Rose Water Toner - Refreshing",
        "description": "Pure Kannauj rose water. Tightens pores and balances pH.",
        "price": 249,
        "original_price": None,
        "category": "Skincare",
        "subcategory": "Toner",
        "image_url": "https://images.pexels.com/photos/18066456/pexels-photo-18066456.jpeg",
        "ingredients": ["Rose Water", "Glycerin"],
        "rating": 4.5,
        "reviews_count": 356,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": False,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_skin_005",
        "name": "Vitamin C Face Cream - Day & Night",
        "description": "Brightens and evens skin tone. With kakadu plum and turmeric.",
        "price": 899,
        "original_price": 1299,
        "category": "Skincare",
        "subcategory": "Moisturizer",
        "image_url": "https://static.prod-images.emergentagent.com/jobs/14e8ee04-2ea2-44e6-8949-ef4c9754eb2d/images/57d78540f7ef9d0b6bfa36c64b23771a9056c554325f255ff416373861499d85.png",
        "ingredients": ["Vitamin C", "Kakadu Plum", "Turmeric", "Hyaluronic Acid"],
        "rating": 4.7,
        "reviews_count": 567,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    },
    
    # Hair Care
    {
        "product_id": "prod_hair_001",
        "name": "Bhringraj Hair Oil - Hair Growth",
        "description": "Traditional Ayurvedic oil for hair growth and strength. Reduces hair fall significantly.",
        "price": 549,
        "original_price": 799,
        "category": "Hair Care",
        "subcategory": "Hair Oil",
        "image_url": "https://images.pexels.com/photos/18066456/pexels-photo-18066456.jpeg",
        "ingredients": ["Bhringraj", "Amla", "Coconut Oil", "Hibiscus"],
        "rating": 4.8,
        "reviews_count": 789,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_hair_002",
        "name": "Shikakai Shampoo - Natural Cleanser",
        "description": "Gentle cleanser for all hair types. Maintains natural oils.",
        "price": 399,
        "original_price": 599,
        "category": "Hair Care",
        "subcategory": "Shampoo",
        "image_url": "https://static.prod-images.emergentagent.com/jobs/14e8ee04-2ea2-44e6-8949-ef4c9754eb2d/images/698d2047aff0b758d06c1795bc486caa1112887bd9b052fa7acac24beb7faed2.png",
        "ingredients": ["Shikakai", "Reetha", "Amla"],
        "rating": 4.5,
        "reviews_count": 423,
        "in_stock": True,
        "is_trending": False,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_hair_003",
        "name": "Hibiscus Hair Mask - Deep Conditioning",
        "description": "Nourishes dry and damaged hair. Promotes natural shine.",
        "price": 599,
        "original_price": None,
        "category": "Hair Care",
        "subcategory": "Hair Mask",
        "image_url": "https://images.pexels.com/photos/18739319/pexels-photo-18739319.jpeg",
        "ingredients": ["Hibiscus", "Fenugreek", "Coconut Milk"],
        "rating": 4.6,
        "reviews_count": 312,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": False,
        "created_at": datetime.now(timezone.utc)
    },
    
    # Bridal Collection
    {
        "product_id": "prod_bridal_001",
        "name": "Bridal Glow Kit - Complete Set",
        "description": "Everything you need for your wedding day glow. 5-step regimen for radiant skin.",
        "price": 2999,
        "original_price": 4999,
        "category": "Bridal Collection",
        "subcategory": "Kit",
        "image_url": "https://images.unsplash.com/photo-1747264464533-ce59ecd395e2",
        "ingredients": ["Saffron", "Gold Dust", "Pearl", "Rose", "Sandalwood"],
        "rating": 4.9,
        "reviews_count": 234,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_bridal_002",
        "name": "Haldi Chandan Face Pack - Pre-Wedding",
        "description": "Traditional ubtan for bridal glow. Removes tan and brightens skin.",
        "price": 699,
        "original_price": 999,
        "category": "Bridal Collection",
        "subcategory": "Face Pack",
        "image_url": "https://images.unsplash.com/photo-1747264464533-ce59ecd395e2",
        "ingredients": ["Turmeric", "Sandalwood", "Gram Flour", "Saffron"],
        "rating": 4.8,
        "reviews_count": 445,
        "in_stock": True,
        "is_trending": True,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    },
    {
        "product_id": "prod_bridal_003",
        "name": "Bridal Lipstick Set - 3 Shades",
        "description": "Perfect shades for Indian brides. Rose Pink, Maroon, Nude.",
        "price": 999,
        "original_price": 1499,
        "category": "Bridal Collection",
        "subcategory": "Lipstick",
        "image_url": "https://static.prod-images.emergentagent.com/jobs/14e8ee04-2ea2-44e6-8949-ef4c9754eb2d/images/57d78540f7ef9d0b6bfa36c64b23771a9056c554325f255ff416373861499d85.png",
        "ingredients": ["Shea Butter", "Rose Oil", "Vitamin E"],
        "rating": 4.7,
        "reviews_count": 289,
        "in_stock": True,
        "is_trending": False,
        "is_bestseller": True,
        "created_at": datetime.now(timezone.utc)
    }
]

async def seed_products():
    # Clear existing products
    await db.products.delete_many({})
    
    # Insert new products
    if products_data:
        await db.products.insert_many(products_data)
        print(f"✅ Seeded {len(products_data)} products")
    else:
        print("❌ No products to seed")

async def main():
    print("🌱 Starting database seeding...")
    await seed_products()
    print("✨ Database seeding completed!")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())