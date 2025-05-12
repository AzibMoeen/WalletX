import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CardDetailsForm = ({ getCurrencySymbol }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  const amount = watch("amount");
  const currency = watch("currency");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardholderName">Cardholder Name</Label>
        <Input
          id="cardholderName"
          placeholder="John Doe"
          className={errors.cardholderName ? "border-red-500" : ""}
          {...register("cardholderName", {
            required: "Cardholder name is required",
          })}
        />
        {errors.cardholderName && (
          <p className="text-xs text-red-500 mt-1">
            {errors.cardholderName.message}
          </p>
        )}
      </div>{" "}
      <div className="space-y-2">
        <Label htmlFor="card-element">Card Details</Label>
        <div className="border rounded-md p-3">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                  padding: "10px 0",
                },
                invalid: {
                  color: "#ef4444",
                },
              },
              hidePostalCode: false, // Include postal code field
            }}
            onChange={(e) => {
              if (e.error) {
                setCardError(e.error.message);
              } else {
                setCardError("");
                // Store card data in a hidden field
                setValue("stripeCardComplete", e.complete);
              }
            }}
          />
        </div>
        {cardError && <p className="text-xs text-red-500 mt-1">{cardError}</p>}
        <p className="text-xs text-gray-500 mt-1">
          Card number, expiration date, CVV, and postal code are all collected
          securely by Stripe Elements
        </p>
      </div>
      <div className="bg-muted p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">Card Details</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span>
              {amount
                ? `${getCurrencySymbol(currency)}${parseFloat(amount).toFixed(
                    2
                  )} ${currency}`
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fee</span>
            <span>No Fee (Demo)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">You Receive</span>
            <span className="font-medium">
              {amount
                ? `${getCurrencySymbol(currency)}${parseFloat(amount).toFixed(
                    2
                  )} ${currency}`
                : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsForm;
