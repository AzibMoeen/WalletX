// models/Wallet.js
import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  balances: [
    {
      currency: {
        type: String,
        enum: ['USD', 'EUR', 'PKR'],
        required: true
      },
      amount: { type: Number, required: true, default: 0 }
    }
  ]
}, { timestamps: true });

export const Wallet = mongoose.model('Wallet', walletSchema);
