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
      const { data } = await fetchWithAuth(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          body: JSON.stringify(userData),
        }
      );

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
    // Check if already authenticated or if explicitly logged out
    if (get().isAuthenticated && get().user) {
      return;
    }

    // Check if user has explicitly logged out, if using browser
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("loggedOut") === "true"
    ) {
      console.log("Not fetching user data - user has explicitly logged out");
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
      // First make the server request to invalidate the token in the database
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // Important to include cookies
      });

      // Clear client-side auth state whether or not the server request succeeded
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });

      // Clear any localStorage items that might be related to auth
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
        localStorage.removeItem("accessToken");
        // Set a flag to prevent auto-login on page load
        localStorage.setItem("loggedOut", "true");

        // Also try to delete cookies via document.cookie if in browser
        try {
          document.cookie =
            "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie =
            "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          // Also clear with domain and secure parameters
          document.cookie =
            "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none;";
          document.cookie =
            "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none;";
        } catch (cookieError) {
          console.log(
            "Cookie deletion via document.cookie failed:",
            cookieError
          );
        }
      }

      console.log("Logout complete");
      return response;
    } catch (error) {
      console.error("Error during logout:", error);
      // Still clear local state even if the server request fails
      set({
        user: null,
        isAuthenticated: false,
      });

      // Also set the logged out flag in case of error
      if (typeof window !== "undefined") {
        localStorage.setItem("loggedOut", "true");
      }
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
