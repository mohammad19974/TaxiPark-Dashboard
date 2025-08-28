import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as Types from '../types';
type AuthState = Types.AuthState;
type User = Types.User;
type LoginForm = Types.LoginForm;
import { authService } from '../services/authService';

interface AuthStore extends AuthState {
  login: (credentials: LoginForm) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginForm) => {
        try {
          set({ isLoading: true });
          console.log('AuthStore: Starting login process');
          
          const response = await authService.login(credentials);
          console.log('AuthStore: Login successful, updating state');
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('AuthStore: Login failed:', error);
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          
          // Preserve the original error message
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Login failed: Unknown error');
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      checkAuth: async () => {
        try {
          const token = get().token;
          if (!token) return;

          set({ isLoading: true });
          const user = await authService.getCurrentUser();
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);