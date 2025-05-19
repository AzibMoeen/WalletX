import { create } from "zustand";
import { API_BASE_URL } from "../config";
import { fetchWithAuth, withTokenRefresh } from "../authUtils";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  verificationEmail: null, 

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await fetchWithAuth(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await fetchWithAuth(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        body: JSON.stringify(userData),
      });

      set({
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  sendVerificationEmail: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await fetchWithAuth(
        `${API_BASE_URL}/api/auth/email-verification`,
        {
          method: "POST",
          body: JSON.stringify(userData),
        }
      );

      set({
        isLoading: false,
        verificationEmail: userData.email,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  verifyAndRegister: async (verificationData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await fetchWithAuth(
        `${API_BASE_URL}/api/auth/verify-and-register`,
        {
          method: "POST",
          body: JSON.stringify(verificationData),
        }
      );

      set({
        isLoading: false,
        verificationEmail: null,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  fetchUser: async () => {
    if (get().isAuthenticated && get().user) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const { data } = await withTokenRefresh(async () => 
        fetchWithAuth(`${API_BASE_URL}/api/auth/profile`)
      );

      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      set({
        isLoading: false,
        error: error.message,
        user: null,
        isAuthenticated: false,
      });
    }
  },

  logout: async () => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  clearError: () => set({ error: null }),

  setUser: (userData) => {
    set({
      user: userData,
    });
  },
}));

export default useAuthStore;
