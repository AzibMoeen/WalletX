import stripe from "../../utils/stripeConfig.js";
import { handleSuccessfulDeposit } from "./stripe.controllers.js";

// Add a webhook handler for Stripe events
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    return res
      .status(400)
      .json({ error: "Missing stripe signature or webhook secret" });
  }

  let event;

  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle specific event types
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;

        if (paymentIntent.metadata.type === "deposit") {
          // Handle successful deposit
          const result = await handleSuccessfulDeposit(paymentIntent);
          if (!result.success) {
            console.error("Failed to process deposit:", result.error);
          }
        }
        break;

      case "payout.created":
        // Handle payout created event
        console.log("Payout created:", event.data.object.id);
        break;

      case "payout.failed":
        // Handle failed payout
        console.log("Payout failed:", event.data.object.id);
        break;

      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (err) {
    console.error(`Error processing webhook: ${err.message}`);
    res.status(500).json({ error: "Failed to process webhook" });
  }
};
