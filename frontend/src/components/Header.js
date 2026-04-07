import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [user]);

  const fetchCounts = async () => {
    try {
      const [cartRes, wishlistRes] = await Promise.all([
        axios.get(`${API}/cart`, { withCredentials: true }),
        axios.get(`${API}/wishlist`, { withCredentials: true }),
      ]);
      setCartCount(cartRes.data.items?.length || 0);
      setWishlistCount(wishlistRes.data.items?.length || 0);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e8d8d0] shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37' }}>
              BeauGlow India
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#5c4a3d] hover:text-[#d4af37] font-medium transition-colors" data-testid="nav-home">
              Home
            </Link>
            <Link to="/products" className="text-[#5c4a3d] hover:text-[#d4af37] font-medium transition-colors" data-testid="nav-products">
              Products
            </Link>
            <Link to="/about" className="text-[#5c4a3d] hover:text-[#d4af37] font-medium transition-colors" data-testid="nav-about">
              About
            </Link>
            <Link to="/contact" className="text-[#5c4a3d] hover:text-[#d4af37] font-medium transition-colors" data-testid="nav-contact">
              Contact
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-[#faf7f5] rounded-full px-4 py-2 border border-[#e8d8d0]">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-40 lg:w-60 text-[#332211]"
              data-testid="search-input"
            />
            <button type="submit" data-testid="search-button">
              <Search className="w-4 h-4 text-[#5c4a3d]" strokeWidth={1.5} />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link to="/wishlist" className="relative" data-testid="wishlist-icon">
                  <Heart className="w-5 h-5 text-[#5c4a3d] hover:text-[#d4af37] transition-colors" strokeWidth={1.5} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#d4af37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link to="/cart" className="relative" data-testid="cart-icon">
                  <ShoppingCart className="w-5 h-5 text-[#5c4a3d] hover:text-[#d4af37] transition-colors" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#d4af37] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2" data-testid="user-menu-button">
                  <User className="w-5 h-5 text-[#5c4a3d]" strokeWidth={1.5} />
                  <span className="hidden md:block text-sm text-[#5c4a3d]">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#e8d8d0] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-[#5c4a3d] hover:bg-[#faf7f5]"
                    data-testid="orders-link"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-[#5c4a3d] hover:bg-[#faf7f5]"
                    data-testid="logout-button"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-[#d4af37] text-white px-6 py-2 rounded-full font-medium hover:bg-[#b8952a] transition-colors"
                data-testid="login-button"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
              data-testid="mobile-menu-button"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <form onSubmit={handleSearch} className="flex items-center bg-[#faf7f5] rounded-full px-4 py-2 border border-[#e8d8d0]">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1 text-[#332211]"
                data-testid="mobile-search-input"
              />
              <button type="submit">
                <Search className="w-4 h-4 text-[#5c4a3d]" strokeWidth={1.5} />
              </button>
            </form>
            <Link to="/" className="block text-[#5c4a3d] hover:text-[#d4af37]" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/products" className="block text-[#5c4a3d] hover:text-[#d4af37]" onClick={() => setIsMenuOpen(false)}>
              Products
            </Link>
            <Link to="/about" className="block text-[#5c4a3d] hover:text-[#d4af37]" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" className="block text-[#5c4a3d] hover:text-[#d4af37]" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}