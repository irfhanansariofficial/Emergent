import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../App';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders`, { withCredentials: true });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-[#e8d8d0] mx-auto mb-4" />
            <p className="text-[#5c4a3d] mb-6">You haven't placed any orders yet</p>
            <a
              href="/products"
              className="inline-block bg-[#d4af37] text-white px-8 py-3 rounded-full font-medium hover:bg-[#b8952a] transition-colors"
              data-testid="start-shopping-button"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8d8d0]"
                data-testid={`order-${order.order_id}`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b border-[#e8d8d0]">
                  <div>
                    <p className="text-sm text-[#5c4a3d] mb-1">Order ID</p>
                    <p className="font-semibold text-[#332211]">{order.order_id}</p>
                  </div>
                  <div className="mt-3 md:mt-0">
                    <p className="text-sm text-[#5c4a3d] mb-1">Order Date</p>
                    <p className="font-semibold text-[#332211]">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="mt-3 md:mt-0">
                    <p className="text-sm text-[#5c4a3d] mb-1">Status</p>
                    <span className="inline-block bg-[#f8d7da] text-[#332211] px-3 py-1 rounded-full text-sm font-medium capitalize">
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-3 md:mt-0">
                    <p className="text-sm text-[#5c4a3d] mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-[#332211]">₹{order.total_amount}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-[#332211] mb-3">Items</h3>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div>
                        <p className="text-[#332211] font-medium">{item.product_name}</p>
                        <p className="text-sm text-[#5c4a3d]">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-[#332211]">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-[#e8d8d0]">
                  <h3 className="font-semibold text-[#332211] mb-2">Delivery Address</h3>
                  <p className="text-sm text-[#5c4a3d]">
                    {order.customer_details.name}
                    <br />
                    {order.customer_details.address}
                    <br />
                    {order.customer_details.city}, {order.customer_details.state} - {order.customer_details.pincode}
                    <br />
                    Phone: {order.customer_details.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}