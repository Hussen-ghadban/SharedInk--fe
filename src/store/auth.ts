// src/store/auth.ts - Updated with better token validation
import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  user: any | null;
  setToken: (token: string) => void;
  logout: () => void;
  isTokenValid: () => boolean;
}

// Helper to validate token
const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

// Helper to load initial token & decode user
const storedToken = localStorage.getItem('token');
const initialToken = isValidToken(storedToken) ? storedToken : null;
const initialUser = initialToken ? jwtDecode(initialToken) : null;

// Clear invalid token from localStorage
if (storedToken && !initialToken) {
  localStorage.removeItem('token');
}

export const useAuth = create<AuthState>((set, get) => ({
  token: initialToken,
  user: initialUser,
  setToken: (token) => {
    if (!isValidToken(token)) {
      console.error('Invalid token provided');
      return;
    }
    
    try {
      const decoded: any = jwtDecode(token);
      const user = {
        id: decoded.sub,
        email: decoded.email,
      };
      localStorage.setItem('token', token);
      set({ token, user });
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
  isTokenValid: () => {
    const { token } = get();
    return isValidToken(token);
  },
}));