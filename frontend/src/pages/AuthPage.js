import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`${API}${endpoint}`, formData, {
        withCredentials: true,
      });

      const { user, session_token } = response.data;
      login(user, session_token);
      toast.success(isLogin ? 'Logged in successfully!' : 'Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen bg-[#faf7f5]">
      <Header />
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#e8d8d0]">
          <h2
            className="text-3xl font-bold text-center text-[#332211] mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-[#5c4a3d] mb-8">
            {isLogin ? 'Login to continue your beauty journey' : 'Join the BeauGlow community'}
          </p>

          {/* Google Auth */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-[#e8d8d0] text-[#332211] py-3 rounded-full font-medium hover:border-[#d4af37] transition-colors mb-6 flex items-center justify-center space-x-2"
            data-testid="google-login-button"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 border-t border-[#e8d8d0]"></div>
            <span className="text-sm text-[#5c4a3d]">OR</span>
            <div className="flex-1 border-t border-[#e8d8d0]"></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#332211] mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                  data-testid="name-input"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#332211] mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                data-testid="email-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#332211] mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#e8d8d0] focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-[#332211]"
                data-testid="password-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4af37] text-white py-3 rounded-full font-medium hover:bg-[#b8952a] transition-colors disabled:opacity-50"
              data-testid="auth-submit-button"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#d4af37] hover:underline text-sm"
              data-testid="toggle-auth-mode-button"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}