import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  exchangeCurrency,
  sendMoney,
  getWalletBalance,
  getTransactionHistory,
  getTransactionDetails,
  getAllUsersForTransfer,
  requestMoney,
  payRequest,
  getMoneyRequests,
  getFilteredTransactionHistory,
  getExchangeHistory,
} from "../controllers/transaction.controllers.js";

import {
  createPaymentIntent,
  handlePaymentSuccess,
  createConnectAccount,
  processDirectDeposit,
  createWithdrawal,
  createInstantWithdrawal,
} from "../controllers/stripe.controllers.js";

const router = express.Router();

// All other routes need JWT
router.use(verifyJWT);

// Wallet routes
router.get("/balance", getWalletBalance);

// User list for transfer
router.get("/users/transfer", getAllUsersForTransfer);

// Transaction history routes
router.get("/history", getTransactionHistory);
router.get("/filtered-history", getFilteredTransactionHistory);

// Money requests - must be before dynamic route
router.get("/requests", getMoneyRequests);

// Individual transaction details - must be after all specific routes
router.get("/:transactionId", getTransactionDetails);



router.post("/send", sendMoney);

// Currency exchange - all parameters should be in request body
router.post("/exchange", exchangeCurrency);

// Get exchange history
router.get("/exchange-history", getExchangeHistory);

// Money requests - POST routes - all parameters should be in request body
router.post("/request", requestMoney);
router.post("/pay-request", payRequest); // Expects requestId in the request body

// Stripe specific endpoints
router.post("/stripe/create-payment-intent", createPaymentIntent);
router.post("/stripe/payment-success", handlePaymentSuccess);
router.post("/stripe/connect-account", createConnectAccount); // New endpoint to create Stripe Connect accounts
router.post("/stripe/direct-deposit", processDirectDeposit); // Add the new direct deposit endpoint

router.post("/stripe/withdraw", createWithdrawal);
router.post("/stripe/instant-withdraw", createInstantWithdrawal);

export default router;
