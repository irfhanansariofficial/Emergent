import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await axios.post(`${API}/newsletter`, { email });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#332211] text-white mt-24">
      {/* Newsletter Section */}
      <div className="bg-[#f8d7da] py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-[#332211] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Join Our Beauty Community
          </h3>
          <p className="text-[#5c4a3d] mb-6">Get exclusive offers and beauty tips straight to your inbox</p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-3 rounded-full border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
              data-testid="newsletter-email-input"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#d4af37] text-white px-8 py-3 rounded-full font-medium hover:bg-[#b8952a] transition-colors disabled:opacity-50"
              data-testid="newsletter-submit-button"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37' }}>
              BeauGlow India
            </h2>
            <p className="text-sm text-gray-300 mb-4">Natural Beauty, Indian Grace ✨</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-[#d4af37]">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-[#d4af37]">Shop By</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=Eye Makeup" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Eye Makeup
                </Link>
              </li>
              <li>
                <Link to="/products?category=Face Makeup" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Face Makeup
                </Link>
              </li>
              <li>
                <Link to="/products?category=Skincare" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Skincare
                </Link>
              </li>
              <li>
                <Link to="/products?category=Hair Care" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Hair Care
                </Link>
              </li>
              <li>
                <Link to="/products?category=Bridal Collection" className="text-gray-300 hover:text-[#d4af37] transition-colors">
                  Bridal Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-[#d4af37]">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>hello@beauglowindia.com</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-300">
                <MapPin className="w-4 h-4 mt-1" />
                <span>123, Beauty Plaza, Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; 2026 BeauGlow India. All rights reserved. | Powered by Ayurvedic Beauty</p>
        </div>
      </div>
    </footer>
  );
}