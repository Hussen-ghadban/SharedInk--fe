// src/store/auth.ts
import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  user: any | null;
  setToken: (token: string) => void;
  logout: () => void;
}

// Helper to load initial token & decode user
const storedToken = localStorage.getItem('token');
const initialUser = storedToken ? jwtDecode(storedToken) : null;

export const useAuth = create<AuthState>((set) => ({
  token: storedToken,
  user: initialUser,
  setToken: (token) => {
      const decoded: any = jwtDecode(token);
  const user = {
    id: decoded.sub,
    email: decoded.email,
  };
    localStorage.setItem('token', token);
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
