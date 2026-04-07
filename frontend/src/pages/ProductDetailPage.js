import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Check } from 'lucide-react';
import axios from 'axios';
import { useAuth, useCart } from '../App';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { user } = useAuth();
  const { refreshCounts } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    fetchProduct();
    if (user) {
      checkWishlist();
    }
  }, [productId, user]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlist = async () => {
    try {
      const response = await axios.get(`${API}/wishlist`, { withCredentials: true });
      const inWishlist = response.data.items.some((item) => item.product_id === productId);
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      await axios.post(
        `${API}/cart`,
        { product_id: productId, quantity },
        { withCredentials: true }
      );
      toast.success('Added to cart!');
      refreshCounts(); // Refresh cart count
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to add to cart');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      if (isInWishlist) {
        await axios.delete(`${API}/wishlist/${productId}`, { withCredentials: true });
        toast.success('Removed from wishlist');
        setIsInWishlist(false);
      } else {
        await axios.post(`${API}/wishlist/${productId}`, {}, { withCredentials: true });
        toast.success('Added to wishlist!');
        setIsInWishlist(true);
      }
      refreshCounts(); // Refresh wishlist count
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update wishlist');
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

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf7f5]">
      <Header />
      <WhatsAppButton />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.is_bestseller && (
              <span className="absolute top-4 right-4 bg-[#d4af37] text-white px-4 py-2 rounded-full font-medium">
                Bestseller
              </span>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm text-[#d4af37] font-medium uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1
                className="text-4xl font-bold text-[#332211] mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[#d4af37] text-[#d4af37]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[#5c4a3d]">
                  {product.rating} ({product.reviews_count} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-[#332211]">₹{product.price}</span>
              {product.original_price && (
                <>
                  <span className="text-2xl text-gray-400 line-through">₹{product.original_price}</span>
                  <span className="bg-[#f8d7da] text-[#332211] px-3 py-1 rounded-full font-medium">
                    Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </span>
                </>
              )}
            </div>

            <div className="border-t border-[#e8d8d0] pt-6">
              <h3 className="font-semibold text-[#332211] mb-3">Description</h3>
              <p className="text-[#5c4a3d] leading-relaxed">{product.description}</p>
            </div>

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="border-t border-[#e8d8d0] pt-6">
                <h3 className="font-semibold text-[#332211] mb-3">Key Ingredients</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="bg-[#f5e6da] text-[#332211] px-3 py-1 rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-[#e8d8d0] pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-[#5c4a3d]">{product.in_stock ? 'In Stock' : 'Out of Stock'}</span>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <label className="font-medium text-[#332211]">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border-2 border-[#e8d8d0] flex items-center justify-center hover:border-[#d4af37]"
                    data-testid="decrease-quantity-button"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold text-[#332211]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full border-2 border-[#e8d8d0] flex items-center justify-center hover:border-[#d4af37]"
                    data-testid="increase-quantity-button"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                  className="flex-1 bg-[#d4af37] text-white py-3 rounded-full font-medium hover:bg-[#b8952a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  data-testid="add-to-cart-button"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 rounded-full border-2 transition-colors ${
                    isInWishlist
                      ? 'bg-[#f8d7da] border-[#d4af37] text-[#d4af37]'
                      : 'border-[#e8d8d0] text-[#5c4a3d] hover:border-[#d4af37]'
                  }`}
                  data-testid="toggle-wishlist-button"
                >
                  <Heart className={`w-6 h-6 ${isInWishlist ? 'fill-[#d4af37]' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
