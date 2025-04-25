import { Transaction } from "../models/transaction.model.js";
import { Wallet } from "../models/wallet.model.js";
import { User } from "../models/user.model.js";

// Helper function to get or create a wallet for a user
const getOrCreateWallet = async (userId) => {
  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await Wallet.create({
      user: userId,
      balances: [
        { currency: 'USD', amount: 0 },
        { currency: 'EUR', amount: 0 },
        { currency: 'PKR', amount: 0 }
      ]
    });
  }
  return wallet;
};

// Helper function to update wallet balance
const updateWalletBalance = async (userId, currency, amount) => {
  const wallet = await getOrCreateWallet(userId);
  
  const currencyBalance = wallet.balances.find(balance => balance.currency === currency);
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
    EUR: { USD: 1.07, PKR: 298.50 },
    PKR: { USD: 0.0036, EUR: 0.0033 }
  };
  
  return rates[fromCurrency]?.[toCurrency] || 1;
};

// Deposit money into wallet
export const depositFunds = async (req, res) => {
  try {
    const { amount, currency, paymentMethod, cardDetails } = req.body;
    const userId = req.user._id;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    
    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: 'deposit',
      amount,
      currencyFrom: currency,
      paymentMethod,
      cardDetails: paymentMethod === 'card' ? cardDetails : undefined,
      status: 'completed' // Auto-complete for demo
    });
    
    // Update wallet balance
    await updateWalletBalance(userId, currency, amount);
    
    return res.status(200).json({
      message: "Funds deposited successfully",
      transaction
    });
  } catch (error) {
    console.error("Error depositing funds:", error);
    return res.status(500).json({ message: error.message || "Failed to deposit funds" });
  }
};

// Withdraw money from wallet
export const withdrawFunds = async (req, res) => {
  try {
    const { amount, currency, paymentMethod, bankDetails, cardDetails } = req.body;
    const userId = req.user._id;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    
    // Check if user has sufficient balance
    const wallet = await Wallet.findOne({ user: userId });
    const balance = wallet?.balances.find(b => b.currency === currency)?.amount || 0;
    
    if (balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }
    
    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: 'withdraw',
      amount,
      currencyFrom: currency,
      paymentMethod,
      bankDetails: paymentMethod === 'bank' ? bankDetails : undefined,
      cardDetails: paymentMethod === 'card' ? cardDetails : undefined,
      status: 'completed' // Auto-complete for demo
    });
    
    // Update wallet balance (subtract funds)
    await updateWalletBalance(userId, currency, -amount);
    
    return res.status(200).json({
      message: "Withdrawal successful",
      transaction
    });
  } catch (error) {
    console.error("Error withdrawing funds:", error);
    return res.status(500).json({ message: error.message || "Failed to withdraw funds" });
  }
};

// Exchange currency
export const exchangeCurrency = async (req, res) => {
  try {
    const { fromCurrency, toCurrency, amount } = req.body;
    const userId = req.user._id;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }
    
    if (fromCurrency === toCurrency) {
      return res.status(400).json({ message: "Cannot exchange to the same currency" });
    }
    
    // Check if user has sufficient balance
    const wallet = await Wallet.findOne({ user: userId });
    const balance = wallet?.balances.find(b => b.currency === fromCurrency)?.amount || 0;
    
    if (balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }
    
    // Get exchange rate
    const exchangeRate = getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * exchangeRate;
    
    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: 'exchange',
      amount,
      currencyFrom: fromCurrency,
      currencyTo: toCurrency,
      exchangeRate,
      status: 'completed'
    });
    
    // Update wallet balances
    await updateWalletBalance(userId, fromCurrency, -amount);
    await updateWalletBalance(userId, toCurrency, convertedAmount);
    
    return res.status(200).json({
      message: "Currency exchanged successfully",
      transaction,
      convertedAmount,
      exchangeRate
    });
  } catch (error) {
    console.error("Error exchanging currency:", error);
    return res.status(500).json({ message: error.message || "Failed to exchange currency" });
  }
};

// Send money to another user
export const sendMoney = async (req, res) => {
  try {
    const { recipientId, recipientEmail, amount, currency, notes } = req.body;
    const senderId = req.user._id;
    
    // Check if user is verified before allowing money transfer
    const sender = await User.findById(senderId);
    if (!sender.verified) {
      return res.status(403).json({ 
        message: "Account verification required to send money. Please verify your identity first." 
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
      return res.status(400).json({ message: "Recipient ID or email is required" });
    }
    
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }
    
    if (recipient._id.toString() === senderId.toString()) {
      return res.status(400).json({ message: "Cannot send money to yourself" });
    }
    
    // Check if sender has sufficient balance
    const senderWallet = await Wallet.findOne({ user: senderId });
    const balance = senderWallet?.balances.find(b => b.currency === currency)?.amount || 0;
    
    if (balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }
    
    // Create send transaction
    const sendTransaction = await Transaction.create({
      user: senderId,
      recipient: recipient._id,
      type: 'send',
      amount,
      currencyFrom: currency,
      notes,
      status: 'completed'
    });
    
    // Create receive transaction for recipient
    const receiveTransaction = await Transaction.create({
      user: recipient._id,
      sender: senderId,
      type: 'receive',
      amount,
      currencyFrom: currency,
      notes,
      status: 'completed'
    });
    
    // Update wallet balances
    await updateWalletBalance(senderId, currency, -amount);
    await updateWalletBalance(recipient._id, currency, amount);
    
    return res.status(200).json({
      message: "Money sent successfully",
      transaction: sendTransaction
    });
  } catch (error) {
    console.error("Error sending money:", error);
    return res.status(500).json({ message: error.message || "Failed to send money" });
  }
};

// Get user's wallet balance
export const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user._id;
    const wallet = await getOrCreateWallet(userId);
    
    return res.status(200).json({
      wallet
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
    
    if (type) {
      query.type = type;
    }
    
    if (currency) {
      query.currencyFrom = currency;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('recipient', 'fullname email')
      .populate('sender', 'fullname email');
    
    const total = await Transaction.countDocuments(query);
    
    return res.status(200).json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return res.status(500).json({ message: "Failed to fetch transaction history" });
  }
};

// Get transaction details
export const getTransactionDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;
    
    const transaction = await Transaction.findOne({
      _id: transactionId,
      user: userId
    })
    .populate('recipient', 'fullname email')
    .populate('sender', 'fullname email');
    
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    return res.status(200).json({
      transaction
    });
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    return res.status(500).json({ message: "Failed to fetch transaction details" });
  }
};

// Get all users for money transfer
export const getAllUsersForTransfer = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    
    // Find all users except the current user
    const users = await User.find(
      { _id: { $ne: currentUserId } },
      'fullname email profilePicture' // Only return necessary fields
    ).sort({ fullname: 1 }); // Sort by name for better UX
    
    return res.status(200).json({
      users
    });
  } catch (error) {
    console.error("Error fetching users for transfer:", error);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};