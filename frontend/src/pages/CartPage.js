import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import { useAuth, useCart } from '../App';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CartPage() {
  const { user } = useAuth();
  const { refreshCounts } = useCart();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API}/cart`, { withCredentials: true });
      setCartItems(response.data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await axios.put(
        `${API}/cart/${cartItemId}?quantity=${newQuantity}`,
        {},
        { withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await axios.delete(`${API}/cart/${cartItemId}`, { withCredentials: true });
      toast.success('Item removed from cart');
      fetchCart();
      refreshCounts(); // Update cart count in header
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7f5]">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f5]">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1
          className="text-4xl sm:text-5xl font-bold text-[#332211] mb-8"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#5c4a3d] mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block bg-[#d4af37] text-white px-8 py-3 rounded-full font-medium hover:bg-[#b8952a] transition-colors"
              data-testid="continue-shopping-button"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8d8d0]"
                  data-testid={`cart-item-${item.cart_item_id}`}
                >
                  <div className="flex space-x-4">
                    <img
                      src={item.product?.image_url}
                      alt={item.product?.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/products/${item.product_id}`}
                        className="font-semibold text-[#332211] hover:text-[#d4af37] block mb-2"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="text-sm text-[#5c4a3d] mb-3">{item.product?.category}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-[#e8d8d0] flex items-center justify-center hover:border-[#d4af37]"
                            data-testid={`decrease-quantity-${item.cart_item_id}`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-[#e8d8d0] flex items-center justify-center hover:border-[#d4af37]"
                            data-testid={`increase-quantity-${item.cart_item_id}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-bold text-[#332211] text-lg">
                            ₹{(item.product?.price || 0) * item.quantity}
                          </span>
                          <button
                            onClick={() => removeItem(item.cart_item_id)}
                            className="text-red-500 hover:text-red-600"
                            data-testid={`remove-item-${item.cart_item_id}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8d8d0] sticky top-24">
                <h2 className="text-2xl font-bold text-[#332211] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[#5c4a3d]">
                    <span>Subtotal</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-[#5c4a3d]">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="border-t border-[#e8d8d0] pt-4">
                    <div className="flex justify-between text-lg font-bold text-[#332211]">
                      <span>Total</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  className="block w-full bg-[#d4af37] text-white text-center py-3 rounded-full font-medium hover:bg-[#b8952a] transition-colors"
                  data-testid="proceed-to-checkout-button"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  to="/products"
                  className="block text-center text-[#d4af37] mt-4 hover:underline"
                  data-testid="continue-shopping-link"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}