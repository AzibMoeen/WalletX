// Real Stripe integration using the official Stripe.js library
import { loadStripe } from "@stripe/stripe-js";
import { API_BASE_URL } from "./config";
import { fetchWithAuth } from "./authUtils";
import useWalletStore from "./store/useWalletStore";

// Load the real Stripe instance with your publishable key
// Using the client's actual test key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export const createPaymentIntent = async (amount, currency) => {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/stripe/create-payment-intent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        amount,
        currency,
      }),
    }
  );

  return response.json();
};

// Helper to confirm payment was successful
export const confirmPaymentSuccess = async (
  paymentIntentId,
  amount,
  currency
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/stripe/payment-success`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        paymentIntentId,
        amount,
        currency,
      }),
    }
  );

  return response.json();
};

// Additional Stripe-related helpers
export const createStripeUserTransfer = async (transferData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/stripe/user-transfer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(transferData),
    }
  );

  return response.json();
};

export const createStripeTransfer = async (transferData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/stripe/transfer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(transferData),
    }
  );

  return response.json();
};

export const createStripePaymentRequest = async (requestData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/stripe/payment-request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(requestData),
    }
  );

  return response.json();
};

// Standard bank withdrawal through Stripe
export const createBankWithdrawal = async (withdrawalData) => {
  try {
    const { data } = await fetchWithAuth(
      `${API_BASE_URL}/api/transactions/stripe/withdraw`,
      {
        method: "POST",
        body: JSON.stringify(withdrawalData),
      }
    );

    // Update wallet balance after successful withdrawal
    const store = useWalletStore.getState();
    await store.updateWalletAfterTransaction();

    return data;
  } catch (error) {
    console.error("Error in createBankWithdrawal:", error);
    throw error;
  }
};

// Instant card withdrawal through Stripe
export const createCardWithdrawal = async (withdrawalData) => {
  try {
    const { data } = await fetchWithAuth(
      `${API_BASE_URL}/api/transactions/stripe/instant-withdraw`,
      {
        method: "POST",
        body: JSON.stringify(withdrawalData),
      }
    );

    // Update wallet balance after successful withdrawal
    const store = useWalletStore.getState();
    await store.updateWalletAfterTransaction();

    return data;
  } catch (error) {
    console.error("Error in createCardWithdrawal:", error);
    throw error;
  }
};

// Get available withdrawal methods from the connected Stripe account
export const getWithdrawalMethods = async () => {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/stripe/withdrawal-methods`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  return response.json();
};

export const createStripeToken = async (tokenData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/stripe/create-token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(tokenData),
    }
  );

  return response.json();
};

export default stripePromise;
