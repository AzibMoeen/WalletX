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

// Money requests
router.get("/requests", getMoneyRequests);

// Exchange history
router.get("/exchange-history", getExchangeHistory);

// Individual transaction details - must be after all specific routes
router.get("/:transactionId", getTransactionDetails);

// POST routes
router.post("/send", sendMoney);
router.post("/exchange", exchangeCurrency);
router.post("/request", requestMoney);
router.post("/pay-request", payRequest);

// Stripe specific endpoints
router.post("/stripe/create-payment-intent", createPaymentIntent);
router.post("/stripe/payment-success", handlePaymentSuccess);
router.post("/stripe/connect-account", createConnectAccount);
router.post("/stripe/direct-deposit", processDirectDeposit);
router.post("/stripe/withdraw", createWithdrawal);
router.post("/stripe/instant-withdraw", createInstantWithdrawal);

export default router;
