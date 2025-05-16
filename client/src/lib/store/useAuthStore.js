import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_BASE_URL } from "../config";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      verificationEmail: null, 

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
            credentials: "include", 
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Login failed");
          }

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
          const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
            credentials: "include",
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

      sendVerificationEmail: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/auth/email-verification`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
              credentials: "include",
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to send verification email"
            );
          }

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
          const response = await fetch(
            `${API_BASE_URL}/api/auth/verify-and-register`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(verificationData),
              credentials: "include",
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Verification failed");
          }

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
          const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
            credentials: "include", // This will send the cookies
          });

          if (!response.ok) {
            // If unauthorized or other error, clear user state
            if (response.status === 401) {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
              return;
            }
            const data = await response.json();
            throw new Error(data.message || "Failed to fetch user");
          }

          const data = await response.json();

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
          // Call the logout endpoint to clear the cookie
          await fetch(`${API_BASE_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
          });
          set({
            user: null,
            isAuthenticated: false,
          });
        } catch (error) {
          console.error("Error during logout:", error);
        }
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      clearError: () => set({ error: null }),

      setUser: (userData) => {
        set({
          user: userData,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        verificationEmail: state.verificationEmail,
      }),
    }
  )
);

export default useAuthStore;
