import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY; // Standard test secret key format

// Create Stripe instance with specific API version for better stability
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
  appInfo: {
    name: "WalletX Payment System",
    version: "1.0.0",
  },
});

// Test the Stripe connection to ensure API key is working
const testStripeConnection = async () => {
  try {
    // Make a simple API call to verify the API key works
    await stripe.paymentMethods.list({ limit: 1 });
    console.log("✓ Stripe connection successful");
    return true;
  } catch (error) {
    console.error("✗ Stripe connection failed:", error.message);
    return false;
  }
};

// Run the test on startup
testStripeConnection();

export default stripe;
