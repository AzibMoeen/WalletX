import mongoose from "mongoose";
import { Transaction } from "../models/transaction.model.js";
import { Wallet } from "../models/wallet.model.js";
import { User } from "../models/user.model.js";
import { sendNotification } from "../../utils/emailService.js";

const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({
      user: userId,
      balances: [
        { currency: "USD", amount: 0 },
        { currency: "EUR", amount: 0 },
        { currency: "PKR", amount: 0 },
      ],
    });
  }
  return wallet;
};

// Helper function to update wallet balance
const updateWalletBalance = async (userId, currency, amount) => {
  const wallet = await getOrCreateWallet(userId);

  const currencyBalance = wallet.balances.find(
    (balance) => balance.currency === currency
  );
  if (currencyBalance) {
    currencyBalance.amount += amount;
    if (currencyBalance.amount < 0) {
      throw new Error("Insufficient funds");
    }
  } else {
    wallet.balances.push({ currency, amount });
  }

  await wallet.save();
  return wallet;
};

// Get exchange rates (simplified demo version)
const getExchangeRate = (fromCurrency, toCurrency) => {
  const rates = {
    USD: { EUR: 0.93, PKR: 277.5 },
    EUR: { USD: 1.07, PKR: 298.5 },
    PKR: { USD: 0.0036, EUR: 0.0033 },
  };

  return rates[fromCurrency]?.[toCurrency] || 1;
};

// Deposit money into wallet

// Withdraw money from wallet

// Exchange currency
export const exchangeCurrency = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    const userId = req.user._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (fromCurrency === toCurrency) {
      return res
        .status(400)
        .json({ message: "Cannot exchange to the same currency" });
    }

    // Check if user has sufficient balance
    const wallet = await Wallet.findOne({ user: userId });
    const balance =
      wallet?.balances.find((b) => b.currency === fromCurrency)?.amount || 0;

    if (balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Get exchange rate
    const exchangeRate = getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * exchangeRate;

    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: "exchange",
      amount,
      currencyFrom: fromCurrency,
      currencyTo: toCurrency,
      exchangeRate,
      status: "completed",
    });

    // Update wallet balances
    await updateWalletBalance(userId, fromCurrency, -amount);
    await updateWalletBalance(userId, toCurrency, convertedAmount);

    return res.status(200).json({
      message: "Currency exchanged successfully",
      transaction,
      convertedAmount,
      exchangeRate,
    });
  } catch (error) {
    console.error("Error exchanging currency:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to exchange currency" });
  }
};

// Send money to another user - redirecting to Stripe
export const sendMoney = async (req, res) => {
  // Redirect all wallet transfers to use Stripe processing
  // Forward the request to the Stripe controller
  try {
    const { recipientId, recipientEmail, amount, currency, notes } = req.body;
    const senderId = req.user._id;

    // Check if user is verified before allowing money transfer
    const sender = await User.findById(senderId);
    if (!sender.verified) {
      return res.status(403).json({
        message:
          "Account verification required to send money. Please verify your identity first.",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    let recipient;

    // Find recipient either by ID or email
    if (recipientId) {
      recipient = await User.findById(recipientId);
    } else if (recipientEmail) {
      recipient = await User.findOne({ email: recipientEmail });
    } else {
      return res
        .status(400)
        .json({ message: "Recipient ID or email is required" });
    }

    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    if (recipient._id.toString() === senderId.toString()) {
      return res.status(400).json({ message: "Cannot send money to yourself" });
    }

    const senderWallet = await Wallet.findOne({ user: senderId });
    const balance =
      senderWallet?.balances.find((b) => b.currency === currency)?.amount || 0;

    if (balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    const stripe = (await import("../../utils/stripeConfig.js")).default;

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(parseFloat(amount) * 100);

    // Create a mock payment intent for the internal wallet transfer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      metadata: {
        senderId: senderId.toString(),
        recipientId: recipient._id.toString(),
        operation: "wallet_transfer",
      },
      // No customer or payment method as this is using wallet balance
      confirm: false,
    });
    console.log("Stripe payment intent created:", paymentIntent);

    // Create send transaction
    const sendTransaction = await Transaction.create({
      user: senderId,
      recipient: recipient._id,
      type: "send",
      amount,
      currencyFrom: currency,
      notes,
      status: "completed",
      stripePaymentIntentId: paymentIntent.id, // Store the Stripe payment intent ID
      paymentMethod: "wallet_via_stripe",
    });

    // Create receive transaction for recipient
    const receiveTransaction = await Transaction.create({
      user: recipient._id,
      sender: senderId,
      type: "receive",
      amount,
      currencyFrom: currency,
      notes,
      status: "completed",
      stripePaymentIntentId: paymentIntent.id,
      paymentMethod: "wallet_via_stripe",
    });

    // Update wallet balances
    await updateWalletBalance(senderId, currency, -amount);
    await updateWalletBalance(recipient._id, currency, amount);

    // Send optional notification (if implemented)
    try {
      await sendNotification({
        userId: recipient._id,
        subject: "Money Received",
        message: `You have received ${amount} ${currency} from ${sender.fullname}.`,
        html: `<p>You have received <strong>${amount} ${currency}</strong> from <strong>${
          sender.fullname
        }</strong>.</p>
               <p>Notes: ${notes || "No notes provided"}</p>`,
      });
    } catch (emailError) {
      console.log("Error sending email notification:", emailError);
      // Continue with the transaction even if email fails
    }

    return res.status(200).json({
      message: "Money sent successfully via Stripe",
      transaction: sendTransaction,
      stripePaymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error sending money:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to send money" });
  }
};

// Get user's wallet balance
export const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    const wallet = await getOrCreateWallet(userId);

    return res.status(200).json({
      wallet,
    });
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    return res.status(500).json({ message: "Failed to fetch wallet balance" });
  }
};

// Get user's transaction history
export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, currency, limit = 20, page = 1 } = req.query;

    const query = { user: userId };
    console.log("Query:", query);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("recipient", "fullname email")
      .populate("sender", "fullname email");

    const total = await Transaction.countDocuments(query);
    console.log("Total transactions:", total);
    console.log(transactions);
    return res.status(200).json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch transaction history" });
  }
};

// Get transaction details
export const getTransactionDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    const transaction = await Transaction.findOne({
      _id: transactionId,
      user: userId,
    })
      .populate("recipient", "fullname email")
      .populate("sender", "fullname email");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({
      transaction,
    });
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch transaction details" });
  }
};

// Get all users for money transfer
export const getAllUsersForTransfer = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { search } = req.query;

    // Create search query
    let query = { _id: { $ne: currentUserId } };

    if (search) {
      query.email = { $regex: search, $options: "i" }; // Case insensitive search
    }

    // Find users based on query
    const users = await User.find(query, "fullname email")
      .sort({ fullname: 1 }) // Sort by name for better UX
      .limit(10); // Limit results to improve performance

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Error fetching users for transfer:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

// Adding new functions for money requests

// Request money from another user
export const requestMoney = async (req, res) => {
  try {
    const { targetUserId, targetEmail, amount, currency, notes } = req.body;
    const requesterId = req.user._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    let targetUser;

    if (targetUserId) {
      targetUser = await User.findById(targetUserId);
    } else if (targetEmail) {
      targetUser = await User.findOne({ email: targetEmail });
    } else {
      return res
        .status(400)
        .json({ message: "Target user ID or email is required" });
    }

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    if (targetUser._id.toString() === requesterId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot request money from yourself" });
    }

    const email = await sendNotification({
      userId: targetUser._id,
      subject: "Money Request",
      message: `You have received a money request of ${amount} ${currency} from ${req.user.fullname}.`,
      html: `<p>You have received a money request of <strong>${amount} ${currency}</strong> from <strong>${req.user.fullname}</strong>.</p>`,
    });
    console.log("Email notification sent:", email);

    let transaction = null;
    if (true) {
      transaction = await Transaction.create({
        user: requesterId,
        recipient: targetUser._id,
        type: "request",
        amount,
        currencyFrom: currency,
        notes,
        status: "pending",
      });
    }

    return res.status(201).json({
      message: "Money request sent successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error requesting money:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to request money" });
  }
};

export const payRequest = async (req, res) => {
  try {
    console.log("Pay request received with body:", JSON.stringify(req.body));
    const { requestId } = req.body;
    const payerId = req.user._id;

    console.log(
      `Processing payment - Request ID: ${requestId}, Payer ID: ${payerId}`
    );

    if (!requestId) {
      console.log("Request ID is missing in the request body");
      return res.status(400).json({ message: "Request ID is required" });
    }

    const requestTransaction = await Transaction.findOne({
      _id: requestId,
      status: "pending",
      type: "request",
    }).populate("user", "fullname email");

    if (!requestTransaction) {
      console.log(`No pending request found with ID: ${requestId}`);
      return res
        .status(404)
        .json({ message: "Money request not found or already processed" });
    }

    console.log(`Found request transaction: ${requestTransaction._id}`);

    // Check if this user is the recipient of the request
    if (requestTransaction.recipient.toString() !== payerId.toString()) {
      console.log(
        `Authorization failed - User ${payerId} is not the recipient of request ${requestId}`
      );
      return res
        .status(403)
        .json({ message: "You are not authorized to pay this request" });
    }

    // Check if payer has sufficient balance
    const payerWallet = await Wallet.findOne({ user: payerId });
    const currency = requestTransaction.currencyFrom;
    const amount = requestTransaction.amount;

    const balance =
      payerWallet?.balances.find((b) => b.currency === currency)?.amount || 0;

    if (balance < amount) {
      console.log(
        `Insufficient funds - User has ${balance} ${currency}, needs ${amount} ${currency}`
      );
      return res.status(400).json({ message: "Insufficient funds" });
    }

    console.log(`Payment validated - Updating transaction status`);

    // Update request transaction status
    requestTransaction.status = "completed";
    await requestTransaction.save();

    // Create payment transaction for payer
    const paymentTransaction = await Transaction.create({
      user: payerId,
      recipient: requestTransaction.user._id,
      type: "payment",
      amount,
      currencyFrom: currency,
      notes: `Payment for request: ${
        requestTransaction.reference || requestTransaction._id
      }`,
      status: "completed",
    });

    const receiveTransaction = await Transaction.create({
      user: requestTransaction.user._id,
      sender: payerId,
      type: "receive",
      amount,
      currencyFrom: currency,
      notes: `Received payment for request: ${
        requestTransaction.reference || requestTransaction._id
      }`,
      status: "completed",
    });

    const email = await sendNotification({
      userId: requestTransaction.user._id,
      subject: "Payment Received",
      message: `Your money request for ${amount} ${currency} has been paid.`,
      html: `<p>Your money request for <strong>${amount} ${currency}</strong> has been paid by <strong>${req.user.fullname}</strong>.</p>`,
    });

    // Update wallet balances
    await updateWalletBalance(payerId, currency, -amount);
    await updateWalletBalance(requestTransaction.user._id, currency, amount);

    console.log(
      `Payment completed successfully - Transaction ID: ${paymentTransaction._id}`
    );

    return res.status(200).json({
      message: "Money request paid successfully",
      transaction: paymentTransaction,
    });
  } catch (error) {
    console.error("Error paying money request:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to pay money request" });
  }
};

// Get all money requests for a user (both sent and received)
export const getMoneyRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, type, limit = 20, page = 1 } = req.query;

    // Construct the query based on filters
    let query = {};

    if (type === "sent") {
      query = { user: userId, type: "request" };
    } else if (type === "received") {
      query = { recipient: userId, type: "request" };
    } else {
      query = {
        $or: [
          { user: userId, type: "request" },
          { recipient: userId, type: "request" },
        ],
      };
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const requests = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "fullname email")
      .populate("recipient", "fullname email")
      .lean();

    const total = await Transaction.countDocuments(query);

    const processedRequests = requests.map((request) => ({
      ...request,
      user: request.user || {
        _id: null,
        fullname: "Unknown User",
        email: "unknown@example.com",
      },
      recipient: request.recipient || {
        _id: null,
        fullname: "Unknown User",
        email: "unknown@example.com",
      },
    }));

    return res.status(200).json({
      requests: processedRequests,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)) || 1,
      },
    });
  } catch (error) {
    console.error("Error fetching money requests:", error);
    return res.status(500).json({
      message: "Failed to fetch money requests",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getFilteredTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, currency, period, limit = 20, page = 1 } = req.query;

    const query = { user: userId };

    if (type) {
      query.type = type;
    }

    if (currency) {
      query.currencyFrom = currency;
    }

    if (period) {
      const now = new Date();
      let startDate;

      switch (period) {
        case "daily":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "weekly":
          const day = now.getDay();
          startDate = new Date(now);
          startDate.setDate(now.getDate() - day);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "monthly":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total, spentResults, receivedResults] =
      await Promise.all([
        Transaction.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate("recipient", "fullname email")
          .populate("sender", "fullname email"),

        Transaction.countDocuments(query),

        Transaction.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(userId),
              type: { $in: ["send", "payment", "withdraw"] },
              ...(currency ? { currencyFrom: currency } : {}),
              ...(period && query.createdAt
                ? { createdAt: query.createdAt }
                : {}),
            },
          },
          { $group: { _id: "$currencyFrom", total: { $sum: "$amount" } } },
        ]),

        Transaction.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(userId),
              type: { $in: ["receive", "deposit"] },
              ...(currency ? { currencyFrom: currency } : {}),
              ...(period && query.createdAt
                ? { createdAt: query.createdAt }
                : {}),
            },
          },
          { $group: { _id: "$currencyFrom", total: { $sum: "$amount" } } },
        ]),
      ]);

    const totalSpent = spentResults;
    const totalReceived = receivedResults;

    return res.status(200).json({
      transactions,
      stats: {
        spent: totalSpent,
        received: totalReceived,
      },
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)) || 1,
      },
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return res.status(500).json({
      message: "Failed to fetch transaction history",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get exchange history
export const getExchangeHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    const exchanges = await Transaction.find({
      user: userId,
      type: "exchange",
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("amount currencyFrom currencyTo exchangeRate createdAt");

    // Format the response
    const formattedExchanges = exchanges.map((exchange) => ({
      fromCurrency: exchange.currencyFrom,
      toCurrency: exchange.currencyTo,
      fromAmount: exchange.amount,
      toAmount: exchange.amount * exchange.exchangeRate,
      date: exchange.createdAt.toLocaleDateString(),
      exchangeRate: exchange.exchangeRate,
    }));

    return res.status(200).json({
      success: true,
      data: formattedExchanges,
    });
  } catch (error) {
    console.error("Error fetching exchange history:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch exchange history",
    });
  }
};

