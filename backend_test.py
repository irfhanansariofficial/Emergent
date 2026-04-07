#!/usr/bin/env python3
"""
BeauGlow India E-commerce Backend API Testing
Tests all API endpoints for authentication, products, cart, wishlist, orders, and newsletter
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, Any, Optional

class BeauGlowAPITester:
    def __init__(self, base_url: str = "https://radiant-grace.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session_token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def test_user_registration(self) -> bool:
        """Test user registration with email/password"""
        print("\n🔍 Testing User Registration...")
        
        timestamp = datetime.now().strftime("%H%M%S")
        test_user = {
            "email": f"test.user.{timestamp}@beauglow.com",
            "password": "Test@123",
            "name": f"Test User {timestamp}"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/auth/register",
                json=test_user,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'user' in data and 'session_token' in data:
                    self.session_token = data['session_token']
                    self.user_data = data['user']
                    self.log_test("User Registration", True)
                    return True
                else:
                    self.log_test("User Registration", False, "Missing user or session_token in response")
                    return False
            else:
                self.log_test("User Registration", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Registration", False, f"Exception: {str(e)}")
            return False

    def test_user_login(self) -> bool:
        """Test user login with test credentials"""
        print("\n🔍 Testing User Login...")
        
        credentials = {
            "email": "test@beauglow.com",
            "password": "Test@123"
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/auth/login",
                json=credentials,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'user' in data and 'session_token' in data:
                    self.session_token = data['session_token']
                    self.user_data = data['user']
                    self.log_test("User Login", True)
                    return True
                else:
                    self.log_test("User Login", False, "Missing user or session_token in response")
                    return False
            else:
                self.log_test("User Login", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Login", False, f"Exception: {str(e)}")
            return False

    def test_auth_me(self) -> bool:
        """Test getting current user info"""
        print("\n🔍 Testing Auth Me Endpoint...")
        
        if not self.session_token:
            self.log_test("Auth Me", False, "No session token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.session_token}"}
            response = requests.get(
                f"{self.api_url}/auth/me",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'user_id' in data and 'email' in data:
                    self.log_test("Auth Me", True)
                    return True
                else:
                    self.log_test("Auth Me", False, "Missing user_id or email in response")
                    return False
            else:
                self.log_test("Auth Me", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Auth Me", False, f"Exception: {str(e)}")
            return False

    def test_get_products(self) -> bool:
        """Test getting all products"""
        print("\n🔍 Testing Get Products...")
        
        try:
            response = requests.get(f"{self.api_url}/products", timeout=10)
            
            if response.status_code == 200:
                products = response.json()
                if isinstance(products, list) and len(products) > 0:
                    # Check if products have required fields
                    first_product = products[0]
                    required_fields = ['product_id', 'name', 'price', 'category', 'image_url']
                    if all(field in first_product for field in required_fields):
                        self.log_test("Get Products", True, f"Found {len(products)} products")
                        return True
                    else:
                        self.log_test("Get Products", False, "Products missing required fields")
                        return False
                else:
                    self.log_test("Get Products", False, "No products found or invalid response format")
                    return False
            else:
                self.log_test("Get Products", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Products", False, f"Exception: {str(e)}")
            return False

    def test_get_products_by_category(self) -> bool:
        """Test getting products by category"""
        print("\n🔍 Testing Get Products by Category...")
        
        try:
            response = requests.get(
                f"{self.api_url}/products",
                params={"category": "Skincare"},
                timeout=10
            )
            
            if response.status_code == 200:
                products = response.json()
                if isinstance(products, list):
                    # Check if all products are from Skincare category
                    if len(products) > 0:
                        all_skincare = all(p.get('category') == 'Skincare' for p in products)
                        if all_skincare:
                            self.log_test("Get Products by Category", True, f"Found {len(products)} Skincare products")
                            return True
                        else:
                            self.log_test("Get Products by Category", False, "Some products not from Skincare category")
                            return False
                    else:
                        self.log_test("Get Products by Category", True, "No Skincare products found (valid)")
                        return True
                else:
                    self.log_test("Get Products by Category", False, "Invalid response format")
                    return False
            else:
                self.log_test("Get Products by Category", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Products by Category", False, f"Exception: {str(e)}")
            return False

    def test_get_trending_products(self) -> bool:
        """Test getting trending products"""
        print("\n🔍 Testing Get Trending Products...")
        
        try:
            response = requests.get(
                f"{self.api_url}/products",
                params={"trending": "true"},
                timeout=10
            )
            
            if response.status_code == 200:
                products = response.json()
                if isinstance(products, list):
                    self.log_test("Get Trending Products", True, f"Found {len(products)} trending products")
                    return True
                else:
                    self.log_test("Get Trending Products", False, "Invalid response format")
                    return False
            else:
                self.log_test("Get Trending Products", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Trending Products", False, f"Exception: {str(e)}")
            return False

    def test_get_categories(self) -> bool:
        """Test getting product categories"""
        print("\n🔍 Testing Get Categories...")
        
        try:
            response = requests.get(f"{self.api_url}/categories", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if 'categories' in data and isinstance(data['categories'], list):
                    self.log_test("Get Categories", True, f"Found {len(data['categories'])} categories")
                    return True
                else:
                    self.log_test("Get Categories", False, "Missing categories field or invalid format")
                    return False
            else:
                self.log_test("Get Categories", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Get Categories", False, f"Exception: {str(e)}")
            return False

    def test_cart_operations(self) -> bool:
        """Test cart operations (add, get, update, remove)"""
        print("\n🔍 Testing Cart Operations...")
        
        if not self.session_token:
            self.log_test("Cart Operations", False, "No session token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.session_token}"}
        
        try:
            # First get a product to add to cart
            products_response = requests.get(f"{self.api_url}/products?limit=1", timeout=10)
            if products_response.status_code != 200 or not products_response.json():
                self.log_test("Cart Operations", False, "No products available for cart test")
                return False
            
            product_id = products_response.json()[0]['product_id']
            
            # Add to cart
            add_response = requests.post(
                f"{self.api_url}/cart",
                json={"product_id": product_id, "quantity": 2},
                headers=headers,
                timeout=10
            )
            
            if add_response.status_code != 200:
                self.log_test("Cart Operations", False, f"Add to cart failed: {add_response.status_code}")
                return False
            
            # Get cart
            get_response = requests.get(f"{self.api_url}/cart", headers=headers, timeout=10)
            if get_response.status_code != 200:
                self.log_test("Cart Operations", False, f"Get cart failed: {get_response.status_code}")
                return False
            
            cart_data = get_response.json()
            if 'items' not in cart_data or len(cart_data['items']) == 0:
                self.log_test("Cart Operations", False, "Cart is empty after adding item")
                return False
            
            cart_item = cart_data['items'][0]
            cart_item_id = cart_item['cart_item_id']
            
            # Update quantity
            update_response = requests.put(
                f"{self.api_url}/cart/{cart_item_id}?quantity=3",
                headers=headers,
                timeout=10
            )
            
            if update_response.status_code != 200:
                self.log_test("Cart Operations", False, f"Update cart failed: {update_response.status_code}")
                return False
            
            # Remove from cart
            remove_response = requests.delete(
                f"{self.api_url}/cart/{cart_item_id}",
                headers=headers,
                timeout=10
            )
            
            if remove_response.status_code != 200:
                self.log_test("Cart Operations", False, f"Remove from cart failed: {remove_response.status_code}")
                return False
            
            self.log_test("Cart Operations", True, "Add, get, update, remove all successful")
            return True
            
        except Exception as e:
            self.log_test("Cart Operations", False, f"Exception: {str(e)}")
            return False

    def test_wishlist_operations(self) -> bool:
        """Test wishlist operations (add, get, remove)"""
        print("\n🔍 Testing Wishlist Operations...")
        
        if not self.session_token:
            self.log_test("Wishlist Operations", False, "No session token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.session_token}"}
        
        try:
            # Get a product to add to wishlist
            products_response = requests.get(f"{self.api_url}/products?limit=1", timeout=10)
            if products_response.status_code != 200 or not products_response.json():
                self.log_test("Wishlist Operations", False, "No products available for wishlist test")
                return False
            
            product_id = products_response.json()[0]['product_id']
            
            # Add to wishlist
            add_response = requests.post(
                f"{self.api_url}/wishlist/{product_id}",
                headers=headers,
                timeout=10
            )
            
            if add_response.status_code != 200:
                self.log_test("Wishlist Operations", False, f"Add to wishlist failed: {add_response.status_code}")
                return False
            
            # Get wishlist
            get_response = requests.get(f"{self.api_url}/wishlist", headers=headers, timeout=10)
            if get_response.status_code != 200:
                self.log_test("Wishlist Operations", False, f"Get wishlist failed: {get_response.status_code}")
                return False
            
            wishlist_data = get_response.json()
            if 'items' not in wishlist_data:
                self.log_test("Wishlist Operations", False, "Invalid wishlist response format")
                return False
            
            # Remove from wishlist
            remove_response = requests.delete(
                f"{self.api_url}/wishlist/{product_id}",
                headers=headers,
                timeout=10
            )
            
            if remove_response.status_code != 200:
                self.log_test("Wishlist Operations", False, f"Remove from wishlist failed: {remove_response.status_code}")
                return False
            
            self.log_test("Wishlist Operations", True, "Add, get, remove all successful")
            return True
            
        except Exception as e:
            self.log_test("Wishlist Operations", False, f"Exception: {str(e)}")
            return False

    def test_order_operations(self) -> bool:
        """Test order creation and retrieval"""
        print("\n🔍 Testing Order Operations...")
        
        if not self.session_token:
            self.log_test("Order Operations", False, "No session token available")
            return False
        
        headers = {"Authorization": f"Bearer {self.session_token}"}
        
        try:
            # Get a product for the order
            products_response = requests.get(f"{self.api_url}/products?limit=1", timeout=10)
            if products_response.status_code != 200 or not products_response.json():
                self.log_test("Order Operations", False, "No products available for order test")
                return False
            
            product = products_response.json()[0]
            
            # Create order
            order_data = {
                "customer_details": {
                    "name": "Test Customer",
                    "email": "test@example.com",
                    "phone": "9876543210",
                    "address": "123 Test Street",
                    "city": "Mumbai",
                    "state": "Maharashtra",
                    "pincode": "400001"
                },
                "items": [{
                    "product_id": product['product_id'],
                    "product_name": product['name'],
                    "quantity": 1,
                    "price": product['price']
                }],
                "total_amount": product['price']
            }
            
            create_response = requests.post(
                f"{self.api_url}/orders",
                json=order_data,
                headers=headers,
                timeout=10
            )
            
            if create_response.status_code != 200:
                self.log_test("Order Operations", False, f"Create order failed: {create_response.status_code}")
                return False
            
            order_result = create_response.json()
            if 'order_id' not in order_result:
                self.log_test("Order Operations", False, "Order creation response missing order_id")
                return False
            
            order_id = order_result['order_id']
            
            # Get orders
            get_orders_response = requests.get(f"{self.api_url}/orders", headers=headers, timeout=10)
            if get_orders_response.status_code != 200:
                self.log_test("Order Operations", False, f"Get orders failed: {get_orders_response.status_code}")
                return False
            
            # Get specific order
            get_order_response = requests.get(f"{self.api_url}/orders/{order_id}", headers=headers, timeout=10)
            if get_order_response.status_code != 200:
                self.log_test("Order Operations", False, f"Get specific order failed: {get_order_response.status_code}")
                return False
            
            self.log_test("Order Operations", True, "Create and retrieve orders successful")
            return True
            
        except Exception as e:
            self.log_test("Order Operations", False, f"Exception: {str(e)}")
            return False

    def test_newsletter_subscription(self) -> bool:
        """Test newsletter subscription"""
        print("\n🔍 Testing Newsletter Subscription...")
        
        try:
            timestamp = datetime.now().strftime("%H%M%S")
            test_email = f"newsletter.test.{timestamp}@example.com"
            
            response = requests.post(
                f"{self.api_url}/newsletter",
                params={"email": test_email},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'message' in data:
                    self.log_test("Newsletter Subscription", True)
                    return True
                else:
                    self.log_test("Newsletter Subscription", False, "Missing message in response")
                    return False
            else:
                self.log_test("Newsletter Subscription", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Newsletter Subscription", False, f"Exception: {str(e)}")
            return False

    def test_logout(self) -> bool:
        """Test user logout"""
        print("\n🔍 Testing User Logout...")
        
        if not self.session_token:
            self.log_test("User Logout", False, "No session token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.session_token}"}
            response = requests.post(
                f"{self.api_url}/auth/logout",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                self.log_test("User Logout", True)
                return True
            else:
                self.log_test("User Logout", False, f"Status {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("User Logout", False, f"Exception: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting BeauGlow India API Tests...")
        print(f"🌐 Testing against: {self.base_url}")
        
        # Authentication tests
        auth_success = self.test_user_registration() or self.test_user_login()
        if auth_success:
            self.test_auth_me()
        
        # Product tests
        self.test_get_products()
        self.test_get_products_by_category()
        self.test_get_trending_products()
        self.test_get_categories()
        
        # Protected endpoint tests (require authentication)
        if auth_success:
            self.test_cart_operations()
            self.test_wishlist_operations()
            self.test_order_operations()
            self.test_logout()
        
        # Public endpoint tests
        self.test_newsletter_subscription()
        
        # Print summary
        print(f"\n📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed < self.tests_run:
            print("\n❌ Failed Tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['details']}")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = BeauGlowAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())