import mongoose from 'mongoose';
import crypto from 'crypto';

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  walletId: {
    type: String,
    unique: true
  },
  balances: [{
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'PKR'],
      required: true
    },
    amount: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  transactionPin: {
    type: String,
    select: false // Don't include in query results by default
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

// Generate wallet ID before saving
walletSchema.pre('save', function(next) {
  if (!this.walletId) {
    // Generate a unique wallet ID
    const randomStr = crypto.randomBytes(8).toString('hex').toUpperCase();
    this.walletId = `W${randomStr}`;
  }
  
  // Ensure all currencies are present in balances
  const currencies = ['USD', 'EUR', 'PKR'];
  currencies.forEach(currency => {
    if (!this.balances.find(b => b.currency === currency)) {
      this.balances.push({ currency, amount: 0 });
    }
  });
  
  next();
});

// Add a balance for a specific currency
walletSchema.methods.addBalance = function(currency, amount) {
  const balance = this.balances.find(b => b.currency === currency);
  if (balance) {
    balance.amount += amount;
  } else {
    this.balances.push({ currency, amount });
  }
};

// Deduct balance for a specific currency
walletSchema.methods.deductBalance = function(currency, amount) {
  const balance = this.balances.find(b => b.currency === currency);
  if (balance && balance.amount >= amount) {
    balance.amount -= amount;
    return true;
  }
  return false;
};

// Get balance for a specific currency
walletSchema.methods.getBalance = function(currency) {
  const balance = this.balances.find(b => b.currency === currency);
  return balance ? balance.amount : 0;
};

// Static method to find a wallet by walletId
walletSchema.statics.findByWalletId = function(walletId) {
  return this.findOne({ walletId });
};

// Add indexes for better query performance
walletSchema.index({ userId: 1 });
walletSchema.index({ walletId: 1 });

const Wallet = mongoose.model('Wallet', walletSchema);

export default Wallet;