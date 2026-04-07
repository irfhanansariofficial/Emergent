import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import axios from 'axios';
import { useAuth, useCart } from '../App';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function WishlistPage() {
  const { user } = useAuth();
  const { refreshCounts } = useCart();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`${API}/wishlist`, { withCredentials: true });
      setWishlistItems(response.data.items);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`${API}/wishlist/${productId}`, { withCredentials: true });
      toast.success('Removed from wishlist');
      fetchWishlist();
      refreshCounts(); // Update wishlist count in header
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const addToCart = async (productId) => {
    try {
      await axios.post(
        `${API}/cart`,
        { product_id: productId, quantity: 1 },
        { withCredentials: true }
      );
      toast.success('Added to cart!');
      refreshCounts(); // Update cart count in header
    } catch (error) {
      toast.error('Failed to add to cart');
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
          My Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#5c4a3d] mb-6">Your wishlist is empty</p>
            <Link
              to="/products"
              className="inline-block bg-[#d4af37] text-white px-8 py-3 rounded-full font-medium hover:bg-[#b8952a] transition-colors"
              data-testid="browse-products-button"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.wishlist_id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-[#e8d8d0]"
                data-testid={`wishlist-item-${item.wishlist_id}`}
              >
                <Link to={`/products/${item.product_id}`}>
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-[#faf7f5]">
                    <img
                      src={item.product?.image_url}
                      alt={item.product?.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                </Link>
                <div className="space-y-2">
                  <Link to={`/products/${item.product_id}`}>
                    <h3 className="font-semibold text-[#332211] text-sm line-clamp-2 hover:text-[#d4af37]">
                      {item.product?.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-[#332211]">₹{item.product?.price}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addToCart(item.product_id)}
                      className="flex-1 bg-[#d4af37] text-white py-2 rounded-full text-sm font-medium hover:bg-[#b8952a] transition-colors flex items-center justify-center space-x-1"
                      data-testid={`add-to-cart-${item.wishlist_id}`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="p-2 border border-[#e8d8d0] rounded-full hover:border-red-500 hover:text-red-500 transition-colors"
                      data-testid={`remove-from-wishlist-${item.wishlist_id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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