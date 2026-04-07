import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Filter } from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const categories = ['All', 'Eye Makeup', 'Face Makeup', 'Skincare', 'Hair Care', 'Bridal Collection'];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
      const response = await axios.get(`${API}/products`, { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f5]">
      <Header />
      <WhatsAppButton />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-5xl sm:text-6xl tracking-tight text-[#332211] mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Our Products
          </h1>
          <p className="text-base text-[#5c4a3d] max-w-2xl mx-auto">
            Discover premium beauty products enriched with Ayurvedic ingredients
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="mb-8 flex items-center justify-center flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#d4af37] text-white'
                  : 'bg-white text-[#5c4a3d] border border-[#e8d8d0] hover:border-[#d4af37]'
              }`}
              data-testid={`category-filter-${category.toLowerCase().replace(' ', '-')}`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.product_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/products/${product.product_id}`}
                  className="group block bg-white rounded-2xl p-4 product-card-hover border border-transparent hover:border-[#d4af37]/20"
                  data-testid={`product-card-${product.product_id}`}
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-[#faf7f5] relative">
                    {product.is_bestseller && (
                      <span className="absolute top-2 right-2 bg-[#d4af37] text-white text-xs px-2 py-1 rounded-full font-medium z-10">
                        Bestseller
                      </span>
                    )}
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover product-image"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-[#d4af37] font-medium uppercase tracking-wide">{product.category}</p>
                    <h3 className="font-semibold text-[#332211] text-sm line-clamp-2">{product.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                      <span className="text-sm text-[#5c4a3d]">{product.rating}</span>
                      <span className="text-xs text-[#5c4a3d]">({product.reviews_count})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-[#332211]">₹{product.price}</span>
                      {product.original_price && (
                        <span className="text-sm text-gray-400 line-through">₹{product.original_price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#5c4a3d]">No products found in this category.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}