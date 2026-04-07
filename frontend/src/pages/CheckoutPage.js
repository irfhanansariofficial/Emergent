import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

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
      if (response.data.items.length === 0) {
        navigate('/cart');
      }
      setCartItems(response.data.items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  };

  const handleInputChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderData = {
        customer_details: customerDetails,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          product_name: item.product?.name,
          quantity: item.quantity,
          price: item.product?.price,
        })),
        total_amount: calculateTotal(),
      };

      const response = await axios.post(`${API}/orders`, orderData, {
        withCredentials: true,
      });

      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
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
          Checkout
        </h1>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Customer Details Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8d8d0]">
                <h2 className="text-2xl font-bold text-[#332211] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Delivery Details
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#332211] mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={customerDetails.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                      data-testid="checkout-name-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#332211] mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={customerDetails.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                      data-testid="checkout-email-input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#332211] mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerDetails.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                      data-testid="checkout-phone-input"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#332211] mb-2">Address *</label>
                    <textarea
                      name="address"
                      value={customerDetails.address}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                      data-testid="checkout-address-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#332211] mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={customerDetails.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                      data-testid="checkout-city-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#332211] mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={customerDetails.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                      data-testid="checkout-state-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#332211] mb-2">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={customerDetails.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                      data-testid="checkout-pincode-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8d8d0] sticky top-24">
                <h2 className="text-2xl font-bold text-[#332211] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.cart_item_id} className="flex justify-between text-sm">
                      <span className="text-[#5c4a3d]">
                        {item.product?.name} x {item.quantity}
                      </span>
                      <span className="text-[#332211] font-medium">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#e8d8d0] pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-[#5c4a3d]">Subtotal</span>
                    <span className="text-[#332211]">₹{calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-[#5c4a3d]">Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-[#332211]">
                    <span>Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
                <div className="bg-[#f8d7da] rounded-xl p-4 mb-6">
                  <p className="text-sm text-[#332211] font-medium">Payment Method</p>
                  <p className="text-sm text-[#5c4a3d] mt-1">Cash on Delivery (COD)</p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#d4af37] text-white py-3 rounded-full font-medium hover:bg-[#b8952a] transition-colors disabled:opacity-50"
                  data-testid="place-order-button"
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}