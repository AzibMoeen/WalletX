import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }
          
          set({
            user: data.user,
            accessToken: data.token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          localStorage.setItem('accessToken', data.token);
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
          throw error;
        }
      },
      
      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('http://localhost:8000/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }
          
          set({
            isLoading: false,
          });
          
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
          throw error;
        }
      },
      
      // Fetch current user
      fetchUser: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return;
        }
        
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('http://localhost:8000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch user');
          }
          
          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            accessToken: token,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message,
            user: null,
            isAuthenticated: false,
            accessToken: null,
          });
          localStorage.removeItem('accessToken');
        }
      },
      
      // Logout action
      logout: () => {
        localStorage.removeItem('accessToken');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
      
      // Clear error state
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      // Only persist these fields
      partialize: (state) => ({ 
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;