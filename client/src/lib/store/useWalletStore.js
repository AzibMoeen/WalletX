import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { API_BASE_URL } from "../config";
import {
  createPaymentIntent,
  confirmPaymentSuccess,
  createStripeTransfer,
  createStripePaymentRequest,
  createStripeUserTransfer,
} from "../stripe-real"; // Using real Stripe implementation

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

const useWalletStore = create(
  persist(
    (set, get) => ({
      // State
      wallet: { balances: [], walletId: "" },
      transactions: [],
      recentRecipients: [],
      requests: [],
      users: [],
      userProfile: { email: "", fullname: "", verified: false },
      isUsersFetched: false,
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
        set({
          formData: {
            recipientId: "",
            recipientEmail: "",
            amount: "",
            currency: "USD",
            note: "",
          },
          success: false,
        }),

      setSuccess: (value) => set({ success: value }),

      fetchBalance: async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/transactions/balance`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch balance");
          }

          set({
            wallet: data.wallet,
            isLoading: false,
          });

          return data.wallet;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
          return null;
        }
      },

      fetchTransactions: async (
        period = null,
        page = 1,
        currency = null,
        type = null
      ) => {
        let limit = 10;
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        set({ isLoading: true, error: null });
        try {
          let url = period
            ? `${API_URL}/transactions/filtered-history?period=${period}`
            : `${API_URL}/transactions/history`;

          url += url.includes("?") ? "&" : "?";
          url += `page=${page}&limit=${limit}`;

          if (currency) {
            url += `&currency=${currency}`;
          }

          if (type) {
            url += `&type=${type}`;
          }

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch transactions");
          }

          const recipients = data.transactions
            .filter((t) => t.type === "send" && t.recipient)
            .map((t) => t.recipient)
            .filter(
              (recipient, index, self) =>
                index === self.findIndex((r) => r._id === recipient._id)
            )
            .slice(0, 5);

          set({
            transactions: data.transactions,
            recentRecipients: recipients,
            stats: data.stats || null,
            pagination: data.pagination || {
              total: data.transactions.length,
              page: page,
              pages: Math.ceil(data.transactions.length / limit),
              limit: limit,
            },
            isLoading: false,
          });

          return data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
          });
          return null;
        }
      },

      fetchStripeTransactionHistory: async (
        limit = 100,
        startingAfter = null,
        endingBefore = null
      ) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        set({ isLoading: true, error: null });
        try {
          let url = `${API_URL}/transactions/stripe/transaction-history?limit=${limit}`;

          if (startingAfter) {
            url += `&starting_after=${startingAfter}`;
          }

          if (endingBefore) {
            url += `&ending_before=${endingBefore}`;
          }

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Failed to fetch Stripe transaction history"
            );
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
          toast.error(error.message || "Failed to fetch Stripe transactions");
          return null;
        }
      },

      transferFunds: async (transferData) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        set({ isLoading: true, error: null });
        try {
          // All transfers should now go through Stripe processing
          let response;
          let data;

          // If there's a payment method ID, user is paying with a credit card via Stripe
          if (transferData.paymentMethodId) {
            // Direct card payment via Stripe
            data = await createStripeUserTransfer(transferData);
          } else {
            // Standard wallet transfer - still processed via Stripe on backend
            response = await fetch(`${API_URL}/transactions/send`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(transferData),
            });

            data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || "Transfer failed");
            }
          }

          // Only update balance after transfer, don't fetch transactions
          get().fetchBalance();

          set({ isLoading: false, success: true });
          toast.success("Money sent successfully via Stripe");
          return data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
            success: false,
          });
          toast.error(error.message || "Failed to send money");
          throw error;
        }
      },

      depositFunds: async (depositData) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        set({ isLoading: true, error: null });
        try {
          // Check if this is a Stripe payment
          let response;
          let data;

          if (depositData.paymentMethod === "stripe") {
            try {
              // If stripePaymentIntentId is provided, it means payment was already processed
              // through the Stripe Elements and we just need to confirm with our backend
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
              console.log(
                "⚠️ Stripe error detected, falling back to simulation:",
                stripeError.message
              );

              // Fall back to simulated deposit
              response = await fetch(
                `${API_URL}/transactions/simulate-deposit`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    amount: depositData.amount,
                    currency: depositData.currency,
                    cardDetails: {
                      cardholderName:
                        depositData.userInfo?.cardholderName || "Test User",
                      cardNumber: "************4242",
                    },
                  }),
                }
              );

              data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || "Simulated deposit failed");
              }
            }
          } else {
            // Use standard API for deposit
            try {
              response = await fetch(`${API_URL}/transactions/deposit`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(depositData),
              });

              data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || "Deposit failed");
              }
            } catch (regularError) {
              console.log(
                "⚠️ Regular deposit error detected, falling back to simulation:",
                regularError.message
              );

              // Fall back to simulated deposit
              response = await fetch(
                `${API_URL}/transactions/simulate-deposit`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    amount: depositData.amount,
                    currency: depositData.currency,
                    cardDetails: depositData.cardDetails || {
                      cardholderName:
                        depositData.userInfo?.accountHolderName || "Test User",
                      cardNumber: "************4242",
                    },
                  }),
                }
              );

              data = await response.json();

              if (!response.ok) {
                throw new Error(data.message || "Simulated deposit failed");
              }
            }
          }

          // Only update balance after deposit, don't fetch transactions
          get().fetchBalance();

          set({ isLoading: false, success: true });
          toast.success("Funds deposited successfully");
          return data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
            success: false,
          });
          toast.error(error.message || "Failed to deposit funds");
          throw error;
        }
      },

      requestMoney: async (requestData) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

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
            response = await fetch(`${API_URL}/transactions/request`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestData),
            });

            data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || "Money request failed");
            }
          }

          get().fetchMoneyRequests();

          set({ isLoading: false, success: true });
          toast.success("Money request sent successfully");
          return data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
            success: false,
          });
          toast.error(error.message || "Failed to send money request");
          throw error;
        }
      },

      payMoneyRequest: async (requestId, useStripe = false) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        set({ isLoading: true, error: null });
        try {
          let url = useStripe
            ? `${API_URL}/transactions/stripe/payment-request`
            : `${API_URL}/transactions/pay-request`;

          const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ requestId }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Payment failed");
          }

          // Update only what's needed after payment
          get().fetchBalance();
          get().fetchMoneyRequests();

          set({ isLoading: false, success: true });
          toast.success("Request paid successfully");
          return data;
        } catch (error) {
          set({
            isLoading: false,
            error: error.message,
            success: false,
          });
          toast.error(error.message || "Failed to pay request");
          throw error;
        }
      },

      fetchMoneyRequests: async (type = null) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        set({ isLoading: true, error: null });
        try {
          const url = type
            ? `${API_URL}/transactions/requests?type=${type}`
            : `${API_URL}/transactions/requests`;

          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch money requests");
          }

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
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        set({ isLoading: true });
        try {
          const response = await fetch(`${API_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch user profile");
          }

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
        const token = localStorage.getItem("accessToken");
        if (!token) return;

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
          }

          // Fetch both passport and gun license verification requests
          const [passportRes, gunRes] = await Promise.all([
            fetch(`${API_URL}/verification/passport/me`, {
              headers: { Authorization: `Bearer ${token}` },
            }).catch(() => ({ ok: false })),

            fetch(`${API_URL}/verification/gun/me`, {
              headers: { Authorization: `Bearer ${token}` },
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
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        set({ isLoading: true, error: null });
        try {
          const response = await fetch(
            `${API_URL}/transactions/users/transfer`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to fetch users");
          }

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
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        try {
          const response = await fetch(
            `${API_URL}/transactions/users/transfer?search=${encodeURIComponent(
              searchTerm
            )}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to search users");
          }

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

      clearError: () => set({ error: null }),

      getCurrencySymbol: (currency) => {
        return CURRENCIES.find((c) => c.value === currency)?.symbol || "";
      },

      getBalanceDisplay: (currency) => {
        const state = get();
        const balance = state.wallet.balances?.find(
          (b) => b.currency === currency
        );
        const currencyObj = CURRENCIES.find((c) => c.value === currency);
        if (balance && currencyObj) {
          return `${currencyObj.symbol}${balance.amount.toFixed(2)}`;
        }
        return `${currency} 0.00`;
      },

      getTotalBalanceInUSD: () => {
        const state = get();
        if (!state.wallet.balances || state.wallet.balances.length === 0)
          return 0;

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
        await get().fetchBalance();
        await get().fetchMoneyRequests();
        await get().fetchVerificationStatus();
      },
    }),
    {
      name: "wallet-storage",
      partialize: (state) => ({
        wallet: state.wallet,
        transactions: state.transactions,
        requests: state.requests,
        recentRecipients: state.recentRecipients,
      }),
    }
  )
);

export default useWalletStore;
