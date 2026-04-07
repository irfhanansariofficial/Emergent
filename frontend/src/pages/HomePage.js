import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const categories = [
  {
    name: 'Eye Makeup',
    image: 'https://images.unsplash.com/photo-1614520993709-fe26b76ae805?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGdsb3dpbmclMjBza2luJTIwYmVhdXR5fGVufDB8fHx8MTc3NTU0OTg1Mnww&ixlib=rb-4.1.0&q=85',
  },
  {
    name: 'Face Makeup',
    image: 'https://images.unsplash.com/photo-1599690901937-81d763397828?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjB3b21hbiUyMGdsb3dpbmclMjBza2luJTIwYmVhdXR5fGVufDB8fHx8MTc3NTU0OTg1Mnww&ixlib=rb-4.1.0&q=85',
  },
  {
    name: 'Skincare',
    image: 'https://images.pexels.com/photos/18066456/pexels-photo-18066456.jpeg',
  },
  {
    name: 'Hair Care',
    image: 'https://images.pexels.com/photos/18739319/pexels-photo-18739319.jpeg',
  },
  {
    name: 'Bridal Collection',
    image: 'https://images.unsplash.com/photo-1747264464533-ce59ecd395e2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjB3b21hbiUyMGdsb3dpbmclMjBza2luJTIwYmVhdXR5fGVufDB8fHx8MTc3NTU0OTg1Mnww&ixlib=rb-4.1.0&q=85',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    text: 'BeauGlow ke products se meri skin ka glow wapas aa gaya! Bilkul natural aur safe.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=1',
  },
  {
    name: 'Ananya Patel',
    location: 'Delhi',
    text: 'Best Ayurvedic skincare brand! My wedding glow was all thanks to BeauGlow.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=5',
  },
  {
    name: 'Riya Desai',
    location: 'Bangalore',
    text: 'Kumkumadi serum is magical! My pigmentation reduced in just 2 weeks.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?img=9',
  },
];

export default function HomePage() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [trendingRes, bestsellersRes] = await Promise.all([
        axios.get(`${API}/products?trending=true&limit=8`),
        axios.get(`${API}/products?bestseller=true&limit=4`),
      ]);
      setTrendingProducts(trendingRes.data);
      setBestsellers(bestsellersRes.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f5]">
      <Header />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative overflow-hidden" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs uppercase tracking-widest font-semibold text-[#d4af37] mb-4 block">
                Ayurvedic Beauty
              </span>
              <h1
                className="text-5xl sm:text-6xl tracking-tight leading-none text-[#332211] mb-6 hero-text-shadow"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Beauty That Shines Naturally
              </h1>
              <p className="text-base leading-relaxed text-[#5c4a3d] mb-8 max-w-xl">
                Inspired by Indian skincare traditions, BeauGlow brings you premium beauty products enriched with
                Ayurvedic ingredients for your natural glow.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="bg-[#d4af37] text-white px-8 py-3 rounded-full font-medium hover:bg-[#b8952a] transition-all hover:-translate-y-1"
                  data-testid="shop-now-button"
                >
                  Shop Now
                </Link>
                <Link
                  to="/products?category=Bridal Collection"
                  className="border-2 border-[#d4af37] text-[#d4af37] px-8 py-3 rounded-full font-medium hover:bg-[#d4af37] hover:text-white transition-all"
                  data-testid="explore-collection-button"
                >
                  Explore Collection
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://static.prod-images.emergentagent.com/jobs/14e8ee04-2ea2-44e6-8949-ef4c9754eb2d/images/789f740e6d49361f2faeff497ed74b46c797d3a55f3d28f1627186eaac7d2f4b.png"
                alt="Indian woman with glowing skin"
                className="rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-[#f8d7da] p-3 rounded-full">
                    <Sparkles className="w-6 h-6 text-[#d4af37]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#332211]">100% Natural</p>
                    <p className="text-sm text-[#5c4a3d]">Ayurvedic Ingredients</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6" data-testid="categories-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs uppercase tracking-widest font-semibold text-[#d4af37] mb-2 block">
              Shop By Category
            </span>
            <h2 className="text-4xl sm:text-5xl tracking-tight text-[#332211]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Discover Your Beauty
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${category.name}`}
                  className="group block category-card"
                  data-testid={`category-card-${category.name.toLowerCase().replace(' ', '-')}`}
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-square">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 px-6 bg-white" data-testid="trending-products-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs uppercase tracking-widest font-semibold text-[#d4af37] mb-2 block">
              Hot Right Now
            </span>
            <h2 className="text-4xl sm:text-5xl tracking-tight text-[#332211]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Trending Products
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product, index) => (
              <motion.div
                key={product.product_id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/products/${product.product_id}`}
                  className="group block bg-white rounded-2xl p-4 product-card-hover border border-transparent hover:border-[#d4af37]/20"
                  data-testid={`product-card-${product.product_id}`}
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-[#faf7f5]">
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

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block bg-[#d4af37] text-white px-8 py-3 rounded-full font-medium hover:bg-[#b8952a] transition-colors"
              data-testid="view-all-products-button"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <section className="py-16 px-6" data-testid="offer-banner-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src="https://static.prod-images.emergentagent.com/jobs/14e8ee04-2ea2-44e6-8949-ef4c9754eb2d/images/8212ecd347a14718d4628a0a5384380aa2bd068e01430557cede6b1b16f14a72.png"
              alt="Festive Offer"
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="px-8 md:px-16 max-w-2xl">
                <h2
                  className="text-4xl md:text-5xl text-white mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Get 20% OFF
                </h2>
                <p className="text-white text-lg mb-6">On Ayurvedic Skincare Collection</p>
                <Link
                  to="/products?category=Skincare"
                  className="inline-block bg-[#d4af37] text-white px-8 py-3 rounded-full font-medium hover:bg-[#b8952a] transition-colors"
                  data-testid="shop-offer-button"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 px-6 bg-white" data-testid="bestsellers-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs uppercase tracking-widest font-semibold text-[#d4af37] mb-2 block">
              Customer Favorites
            </span>
            <h2 className="text-4xl sm:text-5xl tracking-tight text-[#332211]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Best Selling Products
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product, index) => (
              <motion.div
                key={product.product_id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/products/${product.product_id}`}
                  className="group block bg-white rounded-2xl p-4 product-card-hover border border-[#e8d8d0]"
                  data-testid={`bestseller-card-${product.product_id}`}
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-[#faf7f5]">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover product-image"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#d4af37] font-medium uppercase tracking-wide">{product.category}</p>
                      <span className="bg-[#f8d7da] text-[#332211] text-xs px-2 py-1 rounded-full font-medium">
                        Bestseller
                      </span>
                    </div>
                    <h3 className="font-semibold text-[#332211] line-clamp-2">{product.name}</h3>
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs uppercase tracking-widest font-semibold text-[#d4af37] mb-2 block">
              What Our Customers Say
            </span>
            <h2 className="text-4xl sm:text-5xl tracking-tight text-[#332211]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Real Beauty Stories
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e8d8d0]"
                data-testid={`testimonial-card-${index}`}
              >
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                  ))}
                </div>
                <p className="text-[#5c4a3d] mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[#332211]">{testimonial.name}</p>
                    <p className="text-sm text-[#5c4a3d]">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
