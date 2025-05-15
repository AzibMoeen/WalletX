import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api`;

const useVerificationStore = create(
  persist(
    (set, get) => ({
      passportVerifications: [],
      gunVerifications: [],
      isLoading: false,
      error: null,

      fetchPassportVerifications: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/verification/passport/me`, {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to fetch passport verifications"
            );
          }

          set({
            passportVerifications: data.verifications || [],
            isLoading: false,
          });

          return data.verifications;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
        }
      },

      // Fetch gun license verifications
      fetchGunVerifications: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/verification/gun/me`, {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to fetch gun verifications"
            );
          }

          set({
            gunVerifications: data.verifications || [],
            isLoading: false,
          });

          return data.verifications;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
        }
      },

      // Submit passport verification
      submitPassportVerification: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/verification/passport`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          const contentType = response.headers.get("content-type");
          let data;
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          } else {
            // Handle non-JSON response
            const text = await response.text();
            console.error("Received non-JSON response:", text);
            throw new Error("Server returned an invalid response format");
          }

          if (!response.ok) {
            throw new Error(data?.message || "Verification submission failed");
          }

          // Fetch updated verifications
          await get().fetchPassportVerifications();

          set({ isLoading: false });
          return data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
          throw error;
        }
      },

      // Submit gun license verification
      submitGunVerification: async (formData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/verification/gun`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: formData,
          });

          // Check content type before parsing as JSON
          const contentType = response.headers.get("content-type");
          let data;
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          } else {
            // Handle non-JSON response
            const text = await response.text();
            console.error("Received non-JSON response:", text);
            throw new Error("Server returned an invalid response format");
          }

          if (!response.ok) {
            throw new Error(data?.message || "Verification submission failed");
          }

          // Fetch updated verifications
          await get().fetchGunVerifications();

          set({ isLoading: false });
          return data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
          throw error;
        }
      },

      // Fetch all verifications
      fetchAllVerifications: async () => {
        set({ isLoading: true });

        try {
          await Promise.all([
            get().fetchPassportVerifications(),
            get().fetchGunVerifications(),
          ]);
        } catch (error) {
          set({ error: error.message });
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "verification-storage",
      partialize: (state) => ({
        passportVerifications: state.passportVerifications,
        gunVerifications: state.gunVerifications,
      }),
    }
  )
);

export default useVerificationStore;
