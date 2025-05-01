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
  getAllUsersForTransfer,
  requestMoney,
  payRequest,
  getMoneyRequests,
  getFilteredTransactionHistory
} from '../controllers/transaction.controllers.js';

const router = express.Router();

router.use(verifyJWT); 

// Wallet routes
router.get('/balance', getWalletBalance);

// User list for transfer
router.get('/users/transfer', getAllUsersForTransfer);

// Transaction history routes
router.get('/history', getTransactionHistory);
router.get('/filtered-history', getFilteredTransactionHistory);

// Money requests - must be before dynamic route
router.get('/requests', getMoneyRequests); 

// Individual transaction details - must be after all specific routes
router.get('/:transactionId', getTransactionDetails);

// Deposit and withdraw - all parameters should be in request body
router.post('/deposit', depositFunds);
router.post('/withdraw', withdrawFunds);

// Money transfer - all parameters should be in request body
router.post('/send', sendMoney);

// Currency exchange - all parameters should be in request body
router.post('/exchange', exchangeCurrency);

// Money requests - POST routes - all parameters should be in request body
router.post('/request', requestMoney);
router.post('/pay-request', payRequest); // Expects requestId in the request body

export default router;