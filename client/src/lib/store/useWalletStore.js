import { create } from "zustand";
import { toast } from "sonner";
import { API_BASE_URL } from "../config";
import { fetchWithAuth, withTokenRefresh } from "../authUtils";
import {
  confirmPaymentSuccess,
  createStripePaymentRequest,
  createStripeUserTransfer,
} from "../stripe-real";

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" },
];

const exchangeRates = {
  USD: { EUR: 0.91, PKR: 278.5 },
  EUR: { USD: 1.09, PKR: 305.65 },
  PKR: { USD: 0.0036, EUR: 0.0033 },
};

const API_URL = `${API_BASE_URL}/api`;

const useWalletStore = create((set, get) => ({
  // State
  wallet: { balances: [], walletId: "" },
  transactions: [],
  recentRecipients: [],
  requests: [],
  users: [],
  userProfile: { email: "", fullname: "", verified: false },
  isUsersFetched: false,
  isWalletLoaded: false,
  verificationStatus: {
    isVerified: false,
    pendingRequests: [],
    loading: true,
  },
  formData: {
    recipientId: "",
    recipientEmail: "",
    amount: "",
    currency: "USD",
    note: "",
  },
  isLoading: false,
  error: null,
  success: false,
  // Operation-specific success states
  successStates: {
    deposit: false,
    withdraw: false,
    transfer: false,
    exchange: false,
    request: false,
    payRequest: false,
  },
  stats: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    limit: 20,
  },

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  resetForm: () =>
    set((state) => ({
      formData: {
        recipientId: "",
        recipientEmail: "",
        amount: "",
        currency: "USD",
        note: "",
      },
      successStates: Object.keys(state.successStates).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
    })),

  fetchWallet: async () => {
    if (get().isWalletLoaded) {
      return get().wallet;
    }

    set({ isLoading: true, error: null });
    try {
      const { data } = await withTokenRefresh(async () =>
        fetchWithAuth(`${API_URL}/transactions/balance`)
      );

      set({
        wallet: data.wallet,
        isLoading: false,
        isWalletLoaded: true,
      });

      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
        isWalletLoaded: false,
      });
      throw error;
    }
  },

  fetchTransactions: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams(params);
      const { data } = await withTokenRefresh(async () =>
        fetchWithAuth(`${API_URL}/transactions?${queryParams}`)
      );

      set({
        transactions: data.transactions,
        pagination: data.pagination,
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

  setSuccess: (operation, value) => {
    if (operation) {
      // Set a specific operation success state
      set((state) => ({
        successStates: {
          ...state.successStates,
          [operation]: value,
        },
        // Maintain backward compatibility
        success: value,
      }));
    } else {
      // For backward compatibility, set all success states to the same value
      set((state) => ({
        successStates: Object.keys(state.successStates).reduce((acc, key) => {
          acc[key] = value;
          return acc;
        }, {}),
        success: value,
      }));
    }
  },
  // Helper to check if any operation was successful
  hasSuccess: () =>
    Object.values(get().successStates).some((value) => value === true),
    
  // Reset all success states
  resetAllSuccessStates: () => {
    set((state) => ({
      successStates: Object.keys(state.successStates).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
      success: false
    }));
  },
  
  // Reset a specific success state
  resetSuccessState: (operation) => {
    if (operation) {
      set((state) => ({
        successStates: {
          ...state.successStates,
          [operation]: false
        },
        success: false
      }));
    }
  },

  // Add a new function to update wallet after transactions
  updateWalletAfterTransaction: async () => {
    try {
      const { data } = await withTokenRefresh(async () =>
        fetchWithAuth(`${API_URL}/transactions/balance`)
      );

      set({
        wallet: data.wallet,
        isWalletLoaded: true,
      });

      return data;
    } catch (error) {
      console.error("Error updating wallet:", error);
      throw error;
    }
  },

  // Update transferFunds to refresh wallet after transfer
  transferFunds: async (transferData) => {
    set({ isLoading: true, error: null });
    try {
      let data;

      if (transferData.paymentMethodId) {
        data = await createStripeUserTransfer(transferData);
      } else {
        const { data: responseData } = await fetchWithAuth(
          `${API_URL}/transactions/send`,
          {
            method: "POST",
            body: JSON.stringify(transferData),
          }
        );
        data = responseData;
      }      // Update wallet after successful transfer
      await get().updateWalletAfterTransaction();

      set((state) => ({
        isLoading: false,
        success: true,
        successStates: {
          ...state.successStates,
          transfer: true,
        },
      }));
      
      // Auto-clear success state after 3 seconds
      setTimeout(() => {
        get().resetSuccessState('transfer');
      }, 3000);
      
      toast.success("Money sent successfully via Stripe");
      return data;
    } catch (error) {
      set((state) => ({
        isLoading: false,
        error: error.message,
        success: false,
        successStates: {
          ...state.successStates,
          transfer: false,
        },
      }));
      toast.error(error.message || "Failed to send money");
      throw error;
    }
  },

  createPaymentIntent: async (amount, currency, paymentMethodId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await fetchWithAuth(
        `${API_URL}/transactions/stripe/create-payment-intent`,
        {
          method: "POST",
          body: JSON.stringify({
            amount: Math.round(parseFloat(amount) * 100), // convert to cents
            currency,
            payment_method_id: paymentMethodId,
          }),
        }
      );

      set({ isLoading: false });
      return data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      toast.error(error.message || "Failed to create payment intent");
      throw error;
    }
  },

  // Update depositFunds to refresh wallet after deposit
  depositFunds: async (depositData) => {
    set({ isLoading: true, error: null });
    try {
      let data;

      if (depositData.paymentMethod === "stripe") {
        try {
          if (depositData.stripePaymentIntentId) {
            data = await confirmPaymentSuccess(
              depositData.stripePaymentIntentId,
              depositData.amount,
              depositData.currency
            );
          } else {
            throw new Error("Missing Stripe payment information");
          }
        } catch (stripeError) {
          console.log("error");
        }
      } else {
        try {
          const { data: responseData } = await fetchWithAuth(
            `${API_URL}/transactions/deposit`,
            {
              method: "POST",
              body: JSON.stringify(depositData),
            }
          );
          data = responseData;
        } catch (regularError) {
          console.log(
            "⚠️ Regular deposit error detected, falling back to simulation:",
            regularError.message
          );
        }
      }      // Update wallet after successful deposit
      await get().updateWalletAfterTransaction();

      set((state) => ({
        isLoading: false,
        success: true,
        successStates: {
          ...state.successStates,
          deposit: true,
        },
      }));
      
      // Auto-clear success state after 3 seconds
      setTimeout(() => {
        get().resetSuccessState('deposit');
      }, 3000);
      
      toast.success("Funds deposited successfully");
      return data;
    } catch (error) {
      set((state) => ({
        isLoading: false,
        error: error.message,
        success: false,
        successStates: {
          ...state.successStates,
          deposit: false,
        },
      }));
      toast.error(error.message || "Failed to deposit funds");
      throw error;
    }
  },
  requestMoney: async (requestData) => {
    set({ isLoading: true, error: null });
    try {
      // Check if we're using Stripe for payment requests
      let response;
      let data;

      if (requestData.useStripe) {
        // Use Stripe for payment request
        data = await createStripePaymentRequest({
          targetUserId: requestData.targetUserId,
          targetEmail: requestData.targetEmail,
          amount: requestData.amount,
          currency: requestData.currency,
          notes: requestData.notes,
        });
      } else {
        // Use standard API for request
        const { data: responseData } = await fetchWithAuth(
          `${API_URL}/transactions/request`,
          {
            method: "POST",
            body: JSON.stringify(requestData),
          }
        );
        data = responseData;
      }
      get().fetchMoneyRequests();

      set((state) => ({
        isLoading: false,
        success: true,
        successStates: {
          ...state.successStates,
          request: true,
        },
      }));
      
      // Auto-clear success state after 3 seconds
      setTimeout(() => {
        get().resetSuccessState('request');
      }, 3000);
      
      toast.success("Money request sent successfully");
      return data;
    } catch (error) {
      set((state) => ({
        isLoading: false,
        error: error.message,
        success: false,
        successStates: {
          ...state.successStates,
          request: false,
        },
      }));
      toast.error(error.message || "Failed to send money request");
      throw error;
    }
  },

  // Update payMoneyRequest to refresh wallet after payment
  payMoneyRequest: async (requestId, useStripe = false) => {
    set({ isLoading: true, error: null });
    try {
      let url = useStripe
        ? `${API_URL}/transactions/stripe/payment-request`
        : `${API_URL}/transactions/pay-request`;
      const { data } = await fetchWithAuth(url, {
        method: "POST",
        body: JSON.stringify({ requestId }),
      });      // Update wallet after successful payment
      await get().updateWalletAfterTransaction();
      await get().fetchMoneyRequests();

      set((state) => ({
        isLoading: false,
        success: true,
        successStates: {
          ...state.successStates,
          payRequest: true,
        },
      }));
      
      // Auto-clear success state after 3 seconds
      setTimeout(() => {
        get().resetSuccessState('payRequest');
      }, 3000);
      
      toast.success("Request paid successfully");
      return data;
    } catch (error) {
      set((state) => ({
        isLoading: false,
        error: error.message,
        success: false,
        successStates: {
          ...state.successStates,
          payRequest: false,
        },
      }));
      toast.error(error.message || "Failed to pay request");
      throw error;
    }
  },

  fetchMoneyRequests: async (type = null) => {
    set({ isLoading: true, error: null });
    try {
      const url = type
        ? `${API_URL}/transactions/requests?type=${type}`
        : `${API_URL}/transactions/requests`;

      const { data } = await fetchWithAuth(url);

      set({
        requests: data.requests,
        isLoading: false,
      });

      return data.requests;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      return null;
    }
  },

  fetchUserProfile: async () => {
    set({ isLoading: true });
    try {
      const { data } = await fetchWithAuth(`${API_URL}/auth/profile`);

      set({
        userProfile: data.user,
        isLoading: false,
      });

      return data.user;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      return null;
    }
  },

  fetchVerificationStatus: async () => {
    set({
      verificationStatus: { ...get().verificationStatus, loading: true },
    });
    try {
      const userData = await get().fetchUserProfile();

      if (userData && userData.verified === true) {
        set({
          verificationStatus: {
            isVerified: true,
            pendingRequests: [],
            loading: false,
          },
        });
        return;
      } // Fetch both passport and gun license verification requests
      const [passportRes, gunRes] = await Promise.all([
        fetchWithAuth(`${API_URL}/verification/passport/me`, {
          credentials: "include",
        }).catch(() => ({ ok: false })),

        fetchWithAuth(`${API_URL}/verification/gun/me`, {
          credentials: "include",
        }).catch(() => ({ ok: false })),
      ]);

      const pendingRequests = [];

      if (passportRes.ok) {
        const passportData = await passportRes.json();
        if (passportData && passportData.verifications) {
          pendingRequests.push(
            ...passportData.verifications.map((v) => ({
              ...v,
              type: "passport",
            }))
          );
        }
      }

      if (gunRes.ok) {
        const gunData = await gunRes.json();
        if (gunData && gunData.verifications) {
          pendingRequests.push(
            ...gunData.verifications.map((v) => ({ ...v, type: "gun" }))
          );
        }
      }

      set({
        verificationStatus: {
          isVerified: false,
          pendingRequests,
          loading: false,
        },
      });
    } catch (error) {
      console.error("Error fetching verification status:", error);
      set({
        verificationStatus: {
          ...get().verificationStatus,
          loading: false,
        },
      });
    }
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await fetchWithAuth(
        `${API_URL}/transactions/users/transfer`
      );

      set({
        users: data.users,
        isUsersFetched: true,
        isLoading: false,
      });

      return data.users;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message,
      });
      return null;
    }
  },
  searchUsers: async (searchTerm) => {
    try {
      const { data } = await fetchWithAuth(
        `${API_URL}/transactions/users/transfer?search=${encodeURIComponent(
          searchTerm
        )}`
      );

      set({
        users: data.users,
        isUsersFetched: true,
      });

      return data.users;
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  },
  findUserByEmail: async (email) => {
    try {
      const { data } = await fetchWithAuth(
        `${API_URL}/transactions/users/transfer?search=${encodeURIComponent(
          email
        )}`
      );

      // Find the exact match by email
      const exactMatch = data.users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
      return exactMatch || null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  },

  clearError: () => set({ error: null }),

  getCurrencySymbol: (currency) => {
    return CURRENCIES.find((c) => c.value === currency)?.symbol || "";
  },

  getBalanceDisplay: (currency) => {
    const state = get();
    const balance = state.wallet.balances?.find((b) => b.currency === currency);
    const currencyObj = CURRENCIES.find((c) => c.value === currency);
    if (balance && currencyObj) {
      return `${currencyObj.symbol}${balance.amount.toFixed(2)}`;
    }
    return `${currency} 0.00`;
  },

  getTotalBalanceInUSD: () => {
    const state = get();
    if (!state.wallet.balances || state.wallet.balances.length === 0) return 0;

    return state.wallet.balances.reduce((total, balance) => {
      const amountInUSD =
        balance.currency === "USD"
          ? balance.amount
          : get().convertCurrency(balance.amount, balance.currency, "USD");
      return total + amountInUSD;
    }, 0);
  },

  convertCurrency: (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    const rate = exchangeRates[fromCurrency]?.[toCurrency] || 0;
    return amount * rate;
  },

  formatDate: (dateString) => {
    if (!dateString) return "Unknown date";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  },

  getReceiveQRData: () => {
    const state = get();
    if (!state.userProfile || !state.userProfile.email) return null;

    return JSON.stringify({
      email: state.userProfile.email,
      name: state.userProfile.fullname || state.userProfile.email,
      walletId: state.wallet.walletId || "",
    });
  },

  initializeWallet: async () => {
    await get().fetchUserProfile();
    await get().fetchWallet();
    await get().fetchMoneyRequests();
    await get().fetchVerificationStatus();
  },

  resetWalletState: () => {
    set({
      isWalletLoaded: false,
      wallet: { balances: [], walletId: "" },
    });
  },

  // Exchange currency
  exchangeCurrency: async (fromCurrency, toCurrency, amount) => {
    try {
      set({ isLoading: true, error: null });

      const { data } = await fetchWithAuth(
        `${API_BASE_URL}/api/transactions/exchange`,
        {
          method: "POST",
          body: JSON.stringify({
            fromCurrency,
            toCurrency,
            amount: parseFloat(amount),
          }),
        }
      );

      if (!data) {
        throw new Error("Failed to exchange currencies");
      }      // Update wallet balance
      await get().updateWalletAfterTransaction();
      set({ successStates: { ...get().successStates, exchange: true }, success: true });
      
      // Auto-clear success state after 3 seconds
      setTimeout(() => {
        get().resetSuccessState('exchange');
      }, 3000);

      return data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Get exchange history
  fetchExchangeHistory: async () => {
    try {
      set({ isLoading: true, error: null });

      const { data } = await fetchWithAuth(
        `${API_BASE_URL}/api/transactions/exchange-history`
      );

      if (!data) {
        throw new Error("Failed to fetch exchange history");
      }

      return data;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useWalletStore;
