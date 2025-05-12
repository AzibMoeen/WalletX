import stripe from "../../utils/stripeConfig.js";
import { Transaction } from "../models/transaction.model.js";
import { User } from "../models/user.model.js";
import { Wallet } from "../models/wallet.model.js";
import { sendEmail, sendNotification } from "../../utils/emailService.js";

// Helper function to update wallet balance (reused from transaction.controllers.js)
const updateWalletBalance = async (userId, currency, amount) => {
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

// Create Stripe Connect account for new users
export const createConnectAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (user.stripeConnectAccountId) {
      return res.status(200).json({
        message: "User already has a Stripe Connect account",
        accountId: user.stripeConnectAccountId,
      });
    }

    // Create a Stripe Connect Express account for the user
    const account = await stripe.accounts.create({
      type: "express",
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
        // Removed legacy_payments as it's deprecated
        // Removed platform_payments as it's not valid
      },
      business_type: "individual",
      tos_acceptance: {
        service_agreement: "recipient", // Needed for receiving transfers
        date: Math.floor(Date.now() / 1000), // Current timestamp in seconds
      },
      metadata: {
        userId: userId.toString(),
      },
    });

    // Update user with Connect account ID
    user.stripeConnectAccountId = account.id;
    await user.save();

    // Generate an account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/dashboard?refresh=true`,
      return_url: `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/dashboard?success=true`,
      type: "account_onboarding",
    });

    return res.status(200).json({
      message: "Stripe Connect account created successfully",
      accountId: account.id,
      accountLink: accountLink.url,
    });
  } catch (error) {
    console.error("Error creating Stripe Connect account:", error);
    return res.status(500).json({
      message: error.message || "Failed to create Stripe Connect account",
    });
  }
};

// Create a PaymentIntent for card deposits
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "usd", payment_method_id } = req.body;
    const userId = req.user._id;

    if (!amount || amount < 100) {
      // Minimum $1 (100 cents)
      return res.status(400).json({ error: "Minimum deposit amount is $1.00" });
    }

    const paymentIntentParams = {
      amount,
      currency: currency.toLowerCase(),
      payment_method_types: ["card"],
      metadata: {
        userId: userId.toString(),
        type: "deposit",
      },
      description: `Wallet deposit for user ID: ${userId}`,
    };

    // If payment method ID is provided, attach it to the payment intent
    if (payment_method_id) {
      paymentIntentParams.payment_method = payment_method_id;
      paymentIntentParams.confirm = true;
      paymentIntentParams.return_url = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/wallet`;
    }

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create(
      paymentIntentParams
    );

    // Return the client secret and payment intent ID
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({ error: "Failed to create payment intent" });
  }
};

// Handle successful deposit after webhook confirmation
export const handleSuccessfulDeposit = async (paymentIntent) => {
  try {
    const { userId } = paymentIntent.metadata;
    const amount = paymentIntent.amount / 100; // Convert cents to dollars

    // Update user's wallet
    const wallet = await updateWalletBalance(userId, "USD", amount);

    // Create a transaction record
    await Transaction.create({
      sender: userId,
      receiver: userId, // self-deposit
      amount,
      currency: "USD",
      type: "DEPOSIT",
      status: "COMPLETED",
      paymentMethod: "STRIPE",
      description: "Stripe deposit",
      paymentIntentId: paymentIntent.id,
    });

    return { success: true, wallet };
  } catch (error) {
    console.error("Error handling successful deposit:", error);
    return { success: false, error: error.message };
  }
};

// Process direct deposit using Stripe Transfer
export const processDirectDeposit = async (req, res) => {
  try {
    const { amount, currency, sourceType = "card" } = req.body;
    const userId = req.user._id;

    // Validate amount
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(userId);

    // Ensure user has a Connect account
    if (!user.stripeConnectAccountId) {
      return res.status(400).json({
        message:
          "User doesn't have a Stripe Connect account. Create one first.",
      });
    }

    // Convert amount to cents
    const amountInCents = Math.round(parseFloat(amount) * 100);

    // Create a transfer to the user's Connect account
    const transfer = await stripe.transfers.create({
      amount: amountInCents,
      currency: currency.toLowerCase(),
      destination: user.stripeConnectAccountId,
      source_type: sourceType,
      metadata: {
        userId: userId.toString(),
        operation: "direct_deposit",
      },
    });

    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: "deposit",
      amount: parseFloat(amount),
      currencyFrom: currency.toUpperCase(),
      paymentMethod: "transfer",
      status: "completed",
      stripeTransferId: transfer.id,
    }); // Update wallet balance
    const updatedWallet = await updateWalletBalance(
      userId,
      currency.toUpperCase(),
      parseFloat(amount)
    );

    // Send beautiful email to user for successful direct deposit
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #3b82f6; margin-bottom: 10px; font-size: 24px;">Direct Deposit Confirmation</h1>
          <div style="height: 3px; background-color: #3b82f6; width: 100px; margin: 0 auto;"></div>
        </div>
        
        <div style="background-color: #f7fafc; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; color: #6b7280;">Amount:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${parseFloat(
                amount
              )} ${currency.toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Status:</td>
              <td style="padding: 10px; color: #10b981; font-weight: bold; text-align: right;">Completed</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Transaction ID:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${
                transaction._id
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Transfer ID:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${
                transfer.id
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Date:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${new Date().toLocaleDateString()}</td>
            </tr>
          </table>
        </div>
        
        <div style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          <p>Dear ${user.fullname || "Valued Customer"},</p>
          <p>Your direct deposit of <strong>${parseFloat(
            amount
          )} ${currency.toUpperCase()}</strong> has been processed successfully.</p>
          <p>The funds have been added to your WalletX account and are available for use immediately.</p>
          <p>Thank you for choosing WalletX for your financial transactions!</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${
            process.env.FRONTEND_URL || "http://localhost:3000"
          }/dashboard" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Balance</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #888888; text-align: center;">
          <p>This is an automated message from WalletX. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} WalletX. All Rights Reserved.</p>
        </div>
      </div>
    `;
    try {
      await sendNotification({
        userId: userId,
        subject: "Direct Deposit Confirmation",
        message: `Your direct deposit of ${parseFloat(
          amount
        )} ${currency.toUpperCase()} has been processed successfully.`,
        html: emailHtml,
      });
      console.log("✉️ Direct deposit confirmation email sent successfully");
    } catch (emailError) {
      console.error(
        "❌ Error sending direct deposit confirmation email:",
        emailError
      );
      // Continue even if email fails
    }

    return res.status(200).json({
      message: "Deposit processed successfully via transfer",
      transaction,
      transfer: {
        id: transfer.id,
        status: transfer.status,
      },
    });
  } catch (error) {
    console.error("Error processing direct deposit:", error);
    return res.status(500).json({
      message: error.message || "Failed to process direct deposit",
    });
  }
};

// Handle successful Stripe payments
export const handlePaymentSuccess = async (req, res) => {
  try {
    const { paymentIntentId, amount, currency } = req.body;
    const userId = req.user._id;

    console.log("🔵 [STRIPE] Processing payment success - START", {
      paymentIntentId,
      amount,
      currency,
      userId: userId.toString(),
      timestamp: new Date().toISOString(),
    });

    // Verify payment intent status with Stripe
    console.log(
      "👉 [STRIPE] Retrieving payment intent from Stripe:",
      paymentIntentId
    );
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    console.log("🔍 [STRIPE] Payment intent retrieved:", {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    });

    if (paymentIntent.status !== "succeeded") {
      console.log(
        `❌ [STRIPE] Payment not completed - Invalid status: ${paymentIntent.status}`
      );
      return res
        .status(400)
        .json({ message: "Payment has not been completed" });
    }

    // Create transaction record
    console.log("💾 [STRIPE] Creating transaction record in database");

    // Get actual amount from payment intent in the correct format (converting from cents)
    const amountFromStripe = paymentIntent.amount / 100;

    // Get currency from payment intent and ensure it's uppercase for our database
    const currencyFromStripe = paymentIntent.currency
      ? paymentIntent.currency.toUpperCase()
      : "USD";

    console.log(
      `💰 [STRIPE] Using payment details: Amount=${amountFromStripe}, Currency=${currencyFromStripe}`
    );

    // If this is a Connect account payment, create a transfer record
    const user = await User.findById(userId);
    if (user.stripeConnectAccountId && !paymentIntent.transfer_data) {
      try {
        // Create a transfer to the user's Connect account
        const transfer = await stripe.transfers.create({
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          destination: user.stripeConnectAccountId,
          source_transaction: paymentIntent.charges.data[0].id,
          metadata: {
            userId: userId.toString(),
            paymentIntentId: paymentIntent.id,
            operation: "deposit_transfer",
          },
        });
        console.log(`✅ [STRIPE] Created transfer: ${transfer.id}`);
      } catch (transferError) {
        console.error("Error creating transfer:", transferError);
        // Continue with the transaction even if transfer fails
      }
    }

    const transaction = await Transaction.create({
      user: userId,
      type: "deposit",
      amount: amountFromStripe,
      currencyFrom: currencyFromStripe, // Use currency from Stripe payment intent
      paymentMethod: "card",
      status: "completed",
      cardDetails: {
        // Store minimal payment details for record
        cardNumber:
          "************" + paymentIntent.payment_method_details?.card?.last4 ||
          "0000",
      },
    });
    console.log(
      `✅ [STRIPE] Transaction record created with ID: ${transaction._id}`
    );

    // Update wallet balance with the same amount used in the transaction
    console.log(
      `💰 [STRIPE] Updating wallet balance: ${amountFromStripe} ${currencyFromStripe}`
    );
    const updatedWallet = await updateWalletBalance(
      userId,
      currencyFromStripe,
      amountFromStripe
    );
    console.log("✅ [STRIPE] Wallet balance updated successfully:", {
      userId: userId.toString(),
      updatedBalance:
        updatedWallet.balances.find((b) => b.currency === currencyFromStripe)
          ?.amount || "unknown",
    });

    // Send beautiful email to user for successful deposit
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #3b82f6; margin-bottom: 10px; font-size: 24px;">Deposit Confirmation</h1>
          <div style="height: 3px; background-color: #3b82f6; width: 100px; margin: 0 auto;"></div>
        </div>
        
        <div style="background-color: #f7fafc; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; color: #6b7280;">Amount:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${amountFromStripe} ${currencyFromStripe}</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Status:</td>
              <td style="padding: 10px; color: #10b981; font-weight: bold; text-align: right;">Completed</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Transaction ID:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${
                transaction._id
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Date:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${new Date().toLocaleDateString()}</td>
            </tr>
          </table>
        </div>
        
        <div style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          <p>Dear ${user.fullname || "Valued Customer"},</p>
          <p>Your deposit of <strong>${amountFromStripe} ${currencyFromStripe}</strong> has been processed successfully.</p>
          <p>The funds have been added to your WalletX account and are available for use immediately.</p>
          <p>Thank you for choosing WalletX for your financial transactions!</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${
            process.env.FRONTEND_URL || "http://localhost:3000"
          }/dashboard" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Balance</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #888888; text-align: center;">
          <p>This is an automated message from WalletX. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} WalletX. All Rights Reserved.</p>
        </div>
      </div>
    `;

    try {
      await sendNotification({
        userId: user._id,
        subject: "Deposit Confirmation",
        message: `You have deposited ${amount} ${currency} into your account.`,
        html: emailHtml,
      });
      console.log("✉️ [STRIPE] Deposit confirmation email sent successfully");
    } catch (emailError) {
      console.error(
        "❌ [STRIPE] Error sending deposit confirmation email:",
        emailError
      );
      // Continue even if email fails
    }

    console.log("🔵 [STRIPE] Payment success process completed");
    return res.status(200).json({
      message: "Payment processed successfully",
      transaction,
    });
  } catch (error) {
    console.error("❌ [STRIPE] Error processing payment:", error);
    console.log("❌ [STRIPE] Full error details:", {
      message: error.message,
      type: error.type || "unknown",
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return res.status(500).json({ message: "Internal server error" });
  }
};
export const createWithdrawal = async (req, res) => {
  try {
    const {
      amount,
      currency,
      bankName,
      accountNumber,
      routingNumber,
      accountHolderName,
      isTestMode,
    } = req.body;
    const userId = req.user._id;

    // Check if user is verified before allowing withdrawals
    const user = await User.findById(userId);
    if (!user.verified) {
      return res.status(403).json({
        message:
          "Account verification required to withdraw money. Please verify your identity first.",
      });
    }

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Check if user has sufficient balance
    const wallet = await Wallet.findOne({ user: userId });
    const balance =
      wallet?.balances.find((b) => b.currency === currency)?.amount || 0;

    if (balance < parseFloat(amount)) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Check if user has a Stripe Connect account
    if (!user.stripeConnectAccountId) {
      // Create a Stripe Connect account if one doesn't exist
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        metadata: {
          userId: userId.toString(),
        },
      });

      user.stripeConnectAccountId = account.id;
      await user.save();
    }

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(parseFloat(amount) * 100);

    // Create a payout from the user's connected account
    const payout = await stripe.payouts.create(
      {
        amount: amountInCents,
        currency: currency.toLowerCase(),
        method: "standard",
        metadata: {
          userId: userId.toString(),
          operation: "withdraw",
          bankName,
          accountHolderName,
          accountNumberLast4: accountNumber ? accountNumber.slice(-4) : "6789",
          routingNumberLast4: routingNumber ? routingNumber.slice(-4) : "0000",
        },
        statement_descriptor: "WalletX Withdrawal",
      },
      {
        stripeAccount: user.stripeConnectAccountId, // Use the user's Connect account
      }
    );

    // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: "withdraw",
      amount: parseFloat(amount),
      currencyFrom: currency,
      paymentMethod: "bank_transfer",
      status: "processing",
      bankDetails: {
        bankName,
        accountNumber: accountNumber
          ? `****${accountNumber.slice(-4)}`
          : "****6789",
        routingNumber: routingNumber
          ? `****${routingNumber.slice(-4)}`
          : "****0000",
        accountHolderName,
      },
      stripePayoutId: payout.id,
    });

    // Update wallet balance
    await updateWalletBalance(userId, currency, -parseFloat(amount)); // Send beautiful email to user for withdrawal
    const withdrawalEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #3b82f6; margin-bottom: 10px; font-size: 24px;">Withdrawal Request Received</h1>
          <div style="height: 3px; background-color: #3b82f6; width: 100px; margin: 0 auto;"></div>
        </div>
        
        <div style="background-color: #f7fafc; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; color: #6b7280;">Amount:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${amount} ${currency}</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Status:</td>
              <td style="padding: 10px; color: #f59e0b; font-weight: bold; text-align: right;">Processing</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Transaction ID:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${
                transaction._id
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Date:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${new Date().toLocaleDateString()}</td>
            </tr>
          </table>
        </div>
        
        <div style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          <p>Dear ${user.fullname || "Valued Customer"},</p>
          <p>Your withdrawal request of <strong>${amount} ${currency}</strong> has been received and is being processed.</p>
          <p>Funds will typically appear in your account within 1-3 business days.</p>
          <p>Thank you for using WalletX for your financial needs!</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${
            process.env.FRONTEND_URL || "http://localhost:3000"
          }/dashboard" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Transaction</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #888888; text-align: center;">
          <p>This is an automated message from WalletX. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} WalletX. All Rights Reserved.</p>
        </div>
      </div>
    `;

    try {
      await sendNotification({
        userId: userId,
        subject: "Withdrawal Request Received",
        message: `Your withdrawal request of ${amount} ${currency} has been received and is being processed`,
        html: withdrawalEmailHtml,
      });
      console.log("✉️ Withdrawal request confirmation email sent successfully");
    } catch (emailError) {
      console.error(
        "❌ Error sending withdrawal confirmation email:",
        emailError
      );
      // Continue even if email fails
    }

    return res.status(200).json({
      message:
        "Withdrawal request processed successfully. Funds will appear in your account in 1-3 business days.",
      transaction,
      stripePayoutId: payout.id,
    });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to process withdrawal" });
  }
};

// Process an instant payout via Stripe
export const createInstantWithdrawal = async (req, res) => {
  try {
    const { amount, currency, cardId, payment_method_id, isTestMode } =
      req.body;
    const userId = req.user._id;

    // Check if user is verified
    const user = await User.findById(userId);
    if (!user.verified) {
      return res.status(403).json({
        message: "Account verification required for withdrawals.",
      });
    }

    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Check sufficient balance
    const wallet = await Wallet.findOne({ user: userId });
    const balance =
      wallet?.balances.find((b) => b.currency === currency)?.amount || 0;

    if (balance < parseFloat(amount)) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Check if user has a Stripe Connect account
    if (!user.stripeConnectAccountId) {
      // Create a Stripe Connect account if one doesn't exist
      const account = await stripe.accounts.create({
        type: "express",
        email: user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        metadata: {
          userId: userId.toString(),
        },
      });

      user.stripeConnectAccountId = account.id;
      await user.save();
    } // Check if user has a Stripe customer ID and create one if needed
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || "WalletX User", // cardholderName might not be defined in this context
        metadata: {
          userId: userId.toString(),
        },
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(parseFloat(amount) * 100);

    // For demo purposes: Instead of an actual payout (which requires verified external accounts),
    // we'll create a record for the withdrawal but simulate the payout success

    // Generate a mock payout ID for simulation purposes
    const mockPayoutId = `po_demo_${Date.now()}_${Math.floor(
      Math.random() * 1000000
    )}`; // Create transaction record
    const transaction = await Transaction.create({
      user: userId,
      type: "withdraw",
      amount: parseFloat(amount),
      currencyFrom: currency,
      paymentMethod: "instant_to_card",
      status: "completed", // In a real app this would be 'processing' initially
      cardDetails: {
        cardId: payment_method_id || cardId || "demo_card",
        last4: "4242", // Demo card last 4 digits
      },
      stripePayoutId: mockPayoutId,
    }); // Update wallet balance
    await updateWalletBalance(userId, currency, -parseFloat(amount)); // Send beautiful email to user
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #3b82f6; margin-bottom: 10px; font-size: 24px;">Withdrawal Confirmation</h1>
          <div style="height: 3px; background-color: #3b82f6; width: 100px; margin: 0 auto;"></div>
        </div>
        
        <div style="background-color: #f7fafc; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; color: #6b7280;">Amount:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${amount} ${currency}</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Status:</td>
              <td style="padding: 10px; color: #10b981; font-weight: bold; text-align: right;">Completed</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Transaction ID:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${
                transaction._id
              }</td>
            </tr>
            <tr>
              <td style="padding: 10px; color: #6b7280;">Date:</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">${new Date().toLocaleDateString()}</td>
            </tr>
          </table>
        </div>
        
        <div style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          <p>Dear ${user.fullname || "Valued Customer"},</p>
          <p>Your instant withdrawal request of <strong>${amount} ${currency}</strong> has been processed successfully.</p>
          <p>The funds should appear on your card within minutes. This is a demonstration transaction.</p>
          <p>Thank you for using WalletX for your financial needs!</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${
            process.env.FRONTEND_URL || "http://localhost:3000"
          }/dashboard" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Transaction</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #888888; text-align: center;">
          <p>This is an automated message from WalletX. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} WalletX. All Rights Reserved.</p>
        </div>
      </div>
    `;
    try {
      await sendNotification({
        userId: userId,
        subject: "Instant Withdrawal Processed",
        message: `Your instant withdrawal of ${amount} ${currency} has been processed successfully.`,
        html: emailHtml,
      });
      console.log("✉️ Instant withdrawal confirmation email sent successfully");
    } catch (emailError) {
      console.error(
        "❌ Error sending instant withdrawal confirmation email:",
        emailError
      );
      // Continue even if email fails
    }

    return res.status(200).json({
      message:
        "Instant withdrawal processed successfully. This is a demo transaction - in a real app, funds would appear on your card within minutes.",
      transaction,
      stripePayoutId: mockPayoutId,
    });
  } catch (error) {
    console.error("Error processing instant withdrawal:", error);
    return res.status(500).json({
      message: error.message || "Failed to process instant withdrawal",
    });
  }
};
