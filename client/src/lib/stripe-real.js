// Real Stripe integration using the official Stripe.js library
import { loadStripe } from "@stripe/stripe-js";
import { API_BASE_URL } from "./config";

// Load the real Stripe instance with your publishable key
// Using the client's actual test key
const stripePromise = loadStripe(
  "pk_test_51RM5U2DGeCLU0T82JpW6q3nEApx4M5xpIwg95WpPGUWBtVU4gO0CbGVEc1atFbhdQNt3c4c4EDnAFz8DYskvM4zE00ca5fTZqj"
);

// Helper for backend API calls related to payment intents
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
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/stripe/withdraw`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(withdrawalData),
    }
  );

  return response.json();
};

// Instant card withdrawal through Stripe
export const createCardWithdrawal = async (withdrawalData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/transactions/stripe/instant-withdraw`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(withdrawalData),
    }
  );

  return response.json();
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
