import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer', 'exchange'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  fee: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'PKR'],
    required: true
  },
  targetCurrency: {
    type: String,
    enum: ['USD', 'EUR', 'PKR'],
    // Only required for exchange transactions
  },
  exchangeRate: {
    type: Number,
    // Only required for exchange transactions
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  senderWalletId: {
    type: String,
    // Required for transfer transactions
  },
  recipientWalletId: {
    type: String,
    // Required for transfer transactions
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'wallet'],
    // Required for deposit and withdrawal transactions
  },
  cardDetails: {
    cardNumber: String,  // Last 4 digits only
    cardHolder: String,
    expiryDate: String
  },
  reference: {
    type: String
  },
  note: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate a unique transaction reference
transactionSchema.pre('save', function(next) {
  if (!this.reference) {
    const prefix = this.type.charAt(0).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    this.reference = `${prefix}${randomStr}${timestamp}`;
  }
  next();
});

// Create indexes for better query performance
transactionSchema.index({ userId: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ senderWalletId: 1 });
transactionSchema.index({ recipientWalletId: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;