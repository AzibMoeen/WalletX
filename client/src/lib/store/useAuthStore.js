import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_BASE_URL } from "../config";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("user", JSON.stringify(data.user));

          set({
            user: data.user,
            accessToken: data.accessToken,
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
          const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Registration failed");
          }

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

      fetchUser: async () => {
        if (get().accessToken && get().user) {
          return;
        }

        const token = localStorage.getItem("accessToken");
        if (!token) {
          set({ user: null, isAuthenticated: false, accessToken: null });
          localStorage.removeItem("user");
          return;
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            set({
              user: userData,
              isAuthenticated: true,
              accessToken: token,
            });
            return;
          } catch (e) {}
        }

        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch user");
          }

          localStorage.setItem("user", JSON.stringify(data.user));

          set({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            accessToken: token,
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          set({
            isLoading: false,
            error: error.message,
          });
        }
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
