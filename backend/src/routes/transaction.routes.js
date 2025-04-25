import express from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import {
  depositFunds,
  withdrawFunds,
  exchangeCurrency,
  sendMoney,
  getWalletBalance,
  getTransactionHistory,
  getTransactionDetails,
  getAllUsersForTransfer
} from '../controllers/transaction.controllers.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyJWT);

// Wallet routes
router.get('/balance', getWalletBalance);

// User list for transfer (must be before /:transactionId to avoid route matching issues)
router.get('/users/transfer', getAllUsersForTransfer);

// Transaction routes
router.get('/history', getTransactionHistory);
router.get('/:transactionId', getTransactionDetails);

// Deposit and withdraw
router.post('/deposit', depositFunds);
router.post('/withdraw', withdrawFunds);

// Money transfer
router.post('/send', sendMoney);

// Currency exchange
router.post('/exchange', exchangeCurrency);

export default router;