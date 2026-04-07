import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // CRITICAL: Use useRef to prevent double processing
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      const hash = window.location.hash;
      const sessionId = new URLSearchParams(hash.substring(1)).get('session_id');

      if (!sessionId) {
        navigate('/auth');
        return;
      }

      try {
        const response = await axios.post(
          `${API}/auth/google-callback`,
          { session_id: sessionId },
          { withCredentials: true }
        );

        const { user, session_token } = response.data;
        
        // Set cookie
        document.cookie = `session_token=${session_token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=none`;
        
        // Update auth context
        login(user, session_token);

        // Clean URL and navigate
        window.history.replaceState({}, document.title, '/');
        navigate('/', { replace: true, state: { user } });
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/auth', { replace: true });
      }
    };

    processAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f5]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto"></div>
        <p className="mt-4 text-[#5c4a3d]">Completing authentication...</p>
      </div>
    </div>
  );
}