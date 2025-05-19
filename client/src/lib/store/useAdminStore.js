import { create } from "zustand";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api`;

const useAdminStore = create((set) => ({
  users: [],
  usersPagination: { total: 0, page: 1, pages: 1 },
  selectedUser: null,

  passportVerifications: [],
  gunVerifications: [],
  passportVerificationsPagination: { total: 0, page: 1, pages: 1 },
  gunVerificationsPagination: { total: 0, page: 1, pages: 1 },

  dashboardStats: {
    totalUsers: 0,
    pendingVerifications: 0,
    verifiedUsers: 0,
    newUsers: 0,
  },
  recentActivity: [],

  isLoading: false,
  error: null,
  fetchUsers: async (params = {}) => {
    const { search, sortBy, limit = 20, page = 1 } = params;

    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (limit) queryParams.append("limit", limit);
      if (page) queryParams.append("page", page);

      const response = await fetch(
        `${API_URL}/admin/users?${queryParams.toString()}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      set({
        users: data.users,
        usersPagination: data.pagination,
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
  fetchUserById: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user");
      }

      set({
        selectedUser: data.user,
        isLoading: false,
      });

      return data.user;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      // Update users list
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Fetch passport verifications
  fetchPassportVerifications: async (params = {}) => {
    const { status, search, sortBy, limit = 20, page = 1 } = params;

    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      if (status) queryParams.append("status", status);
      if (search) queryParams.append("search", search);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (limit) queryParams.append("limit", limit);
      if (page) queryParams.append("page", page);


      const response = await fetch(
        `${API_URL}/admin/verifications/passport?${queryParams.toString()}`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch passport verifications"
        );
      }

      set({
        passportVerifications: data.verifications,
        passportVerificationsPagination: data.pagination,
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

  // Fetch gun verifications
  fetchGunVerifications: async (params = {}) => {
    const { status, search, sortBy, limit = 20, page = 1 } = params;

    set({ isLoading: true, error: null });
    try {
      // Build query params
      const queryParams = new URLSearchParams();
      if (status) queryParams.append("status", status);
      if (search) queryParams.append("search", search);
      if (sortBy) queryParams.append("sortBy", sortBy);
      if (limit) queryParams.append("limit", limit);
      if (page) queryParams.append("page", page);

      const response = await fetch(
        `${API_URL}/admin/verifications/gun?${queryParams.toString()}`,
        {

          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch gun verifications"
        );
      }

      set({
        gunVerifications: data.verifications,
        gunVerificationsPagination: data.pagination,
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

  // Update passport verification status
  updatePassportVerificationStatus: async (verificationId, status) => {
    set({ isLoading: true, error: null });
    try {

      const response = await fetch(
        `${API_URL}/admin/verifications/passport/${verificationId}`,
        {
          credentials: "include",
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update verification status"
        );
      }

      // Update verifications list
      set((state) => ({
        passportVerifications: state.passportVerifications.map(
          (verification) =>
            verification._id === verificationId
              ? { ...verification, status }
              : verification
        ),
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Update gun verification status
  updateGunVerificationStatus: async (verificationId, status) => {
    set({ isLoading: true, error: null });
    try {

      const response = await fetch(
        `${API_URL}/admin/verifications/gun/${verificationId}`,
        {
          credentials: "include",
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update verification status"
        );
      }

      // Update verifications list
      set((state) => ({
        gunVerifications: state.gunVerifications.map((verification) =>
          verification._id === verificationId
            ? { ...verification, status }
            : verification
        ),
        isLoading: false,
      }));

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      throw error;
    }
  },

  // Fetch dashboard stats
  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {

      const response = await fetch(`${API_URL}/admin/dashboard/stats`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },  
        
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch dashboard statistics"
        );
      }

      set({
        dashboardStats: data.stats,
        recentActivity: data.recentActivity,
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

  clearError: () => set({ error: null }),
}));

export default useAdminStore;
