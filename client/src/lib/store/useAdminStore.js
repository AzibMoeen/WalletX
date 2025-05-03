import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAdminStore = create(
  persist(
    (set) => ({
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
          if (search) queryParams.append('search', search);
          if (sortBy) queryParams.append('sortBy', sortBy);
          if (limit) queryParams.append('limit', limit);
          if (page) queryParams.append('page', page);
          
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`https://walletx-production.up.railway.app/api/admin/users?${queryParams.toString()}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch users');
          }
          
          set({
            users: data.users,
            usersPagination: data.pagination,
            isLoading: false
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
      
      fetchUserById: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`https://walletx-production.up.railway.app/api/admin/users/${userId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch user');
          }
          
          set({
            selectedUser: data.user,
            isLoading: false
          });
          
          return data.user;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
          throw error;
        }
      },
      
      deleteUser: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`https://walletx-production.up.railway.app/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to delete user');
          }
          
          // Update users list
          set(state => ({
            users: state.users.filter(user => user._id !== userId),
            isLoading: false
          }));
          
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
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
          if (status) queryParams.append('status', status);
          if (search) queryParams.append('search', search);
          if (sortBy) queryParams.append('sortBy', sortBy);
          if (limit) queryParams.append('limit', limit);
          if (page) queryParams.append('page', page);
          
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`https://walletx-production.up.railway.app/api/admin/verifications/passport?${queryParams.toString()}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch passport verifications');
          }
          
          set({
            passportVerifications: data.verifications,
            passportVerificationsPagination: data.pagination,
            isLoading: false
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
      
      // Fetch gun verifications
      fetchGunVerifications: async (params = {}) => {
        const { status, search, sortBy, limit = 20, page = 1 } = params;
        
        set({ isLoading: true, error: null });
        try {
          // Build query params
          const queryParams = new URLSearchParams();
          if (status) queryParams.append('status', status);
          if (search) queryParams.append('search', search);
          if (sortBy) queryParams.append('sortBy', sortBy);
          if (limit) queryParams.append('limit', limit);
          if (page) queryParams.append('page', page);
          
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`https://walletx-production.up.railway.app/api/admin/verifications/gun?${queryParams.toString()}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch gun verifications');
          }
          
          set({
            gunVerifications: data.verifications,
            gunVerificationsPagination: data.pagination,
            isLoading: false
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
      
      // Update passport verification status
      updatePassportVerificationStatus: async (verificationId, status) => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`https://walletx-production.up.railway.app/api/admin/verifications/passport/${verificationId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to update verification status');
          }
          
          // Update verifications list
          set(state => ({
            passportVerifications: state.passportVerifications.map(verification => 
              verification._id === verificationId 
                ? { ...verification, status } 
                : verification
            ),
            isLoading: false
          }));
          
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
          throw error;
        }
      },
      
      // Update gun verification status
      updateGunVerificationStatus: async (verificationId, status) => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`https://walletx-production.up.railway.app/api/admin/verifications/gun/${verificationId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to update verification status');
          }
          
          // Update verifications list
          set(state => ({
            gunVerifications: state.gunVerifications.map(verification => 
              verification._id === verificationId 
                ? { ...verification, status } 
                : verification
            ),
            isLoading: false
          }));
          
          return data;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message 
          });
          throw error;
        }
      },
      
      // Fetch dashboard stats
      fetchDashboardStats: async () => {
        set({ isLoading: true, error: null });
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`https://walletx-production.up.railway.app/api/admin/dashboard/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch dashboard statistics');
          }
          
          set({
            dashboardStats: data.stats,
            recentActivity: data.recentActivity,
            isLoading: false
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
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({ 
        users: state.users,
        selectedUser: state.selectedUser,
        passportVerifications: state.passportVerifications,
        gunVerifications: state.gunVerifications,
        dashboardStats: state.dashboardStats,
        recentActivity: state.recentActivity,
      }),
    }
  )
);

export default useAdminStore;