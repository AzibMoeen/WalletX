// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: [
        "deposit",
        "withdraw",
        "exchange",
        "send",
        "receive",
        "request",
        "payment",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    fee: {
      type: Number,
      default: 0,
    },

    currencyFrom: {
      type: String,
      enum: ["USD", "EUR", "PKR"],
      required: true,
    },

    currencyTo: {
      type: String,
      enum: ["USD", "EUR", "PKR"],
    }, // required for exchange

    exchangeRate: {
      type: Number,
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: [
        "card",
        "bank",
        "wallet",
        "cash",
        "stripe",
        "bank_transfer",
        "instant_to_card",
        "wallet_via_stripe",
      ],
      default: "wallet",
    },

    cardDetails: {
      cardNumber: { type: String },
      expiryDate: { type: String },
      cvv: { type: String },
    },

    bankDetails: {
      accountNumber: { type: String },
      routingNumber: { type: String },
      bankName: { type: String },
    },

    notes: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled", "processing"],
      default: "pending",
    },

    reference: {
      type: String,
    },

    // Stripe specific fields
    stripePaymentIntentId: { type: String },
    stripePaymentLinkId: { type: String },
    stripePaymentUrl: { type: String },
    stripeTransferId: { type: String },
    stripeCustomerId: { type: String },
    stripePayoutId: { type: String }, // Add this field for tracking payouts
  },
  { timestamps: true }
);

// Generate a unique reference number
transactionSchema.pre("save", function (next) {
  if (!this.reference) {
    const date = new Date();
    const prefix = this.type.charAt(0).toUpperCase();
    const randomDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    this.reference = `${prefix}${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date
      .getDate()
      .toString()
      .padStart(2, "0")}-${randomDigits}`;
  }
  next();
});

export const Transaction = mongoose.model("Transaction", transactionSchema);
