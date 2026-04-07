import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import './App.css';
import './index.css';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import OrdersPage from './pages/OrdersPage';
import AuthCallback from './components/AuthCallback';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // CRITICAL: If returning from OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    if (window.location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        withCredentials: true,
      });
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    setUser(userData);
    if (token) {
      document.cookie = `session_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=none`;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    document.cookie = 'session_token=; path=/; max-age=0';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// App Router Component
function AppRouter() {
  const location = useLocation();

  // CRITICAL: Check for session_id synchronously during render
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:productId" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;