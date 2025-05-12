import { Router } from "express";
import { handleStripeWebhook } from "../controllers/webhook.controllers.js";

// Raw body parser for Stripe webhooks
const webhookRawBodyParser = (req, res, next) => {
  // Store the raw body for Stripe signature verification
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    req.rawBody = data;
    next();
  });
};

const router = Router();

// Stripe webhook endpoint - do not use JSON parser for this route
router.post("/stripe", webhookRawBodyParser, handleStripeWebhook);

export default router;
