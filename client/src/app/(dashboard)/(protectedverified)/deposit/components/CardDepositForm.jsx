import { useState } from "react";
import { PlusCircle, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useForm, Controller } from "react-hook-form";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" },
];

const CardDepositForm = ({
  handleSubmit: onSubmitHandler,
  getCurrencySymbol,
  isLoading,
  success,
  error,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  // Initialize React Hook Form
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      currency: "USD",
      // Postal code is handled by Stripe Elements
    },
    mode: "onChange",
  });
  const currency = watch("currency");
  const amount = watch("amount");
  const onSubmit = async (data) => {
    if (!stripe || !elements) {
      setCardError("Stripe has not been initialized yet. Please try again.");
      return;
    }

    // Convert amount to number
    const amountValue = parseFloat(data.amount);
    try {
      // Get CardElement using the CardElement component identifier
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setCardError("Card element not found");
        return;
      } // Create payment method with real Stripe API
      const paymentMethodResult = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        // No need to pass postal code as Stripe Elements handles that
      });

      const { error, paymentMethod } = paymentMethodResult;

      if (error) {
        setCardError(error.message);
        return;
      } // Format the data with Stripe payment info
      const formattedData = {
        amount: amountValue,
        currency: data.currency,
        method: "card",
        paymentMethod: "stripe",
        stripePaymentMethodId: paymentMethod.id,
        // Postal code is collected directly by Stripe Elements
        userInfo: {},
      };

      // Process the payment with our backend
      await onSubmitHandler(formattedData);
    } catch (err) {
      setCardError(err.message || "An error occurred with your payment");
    }
  };
  // Removed handleExpiryDateChange as we're using Stripe Elements

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 md:space-y-6 mt-4"
    >
      {success && (
        <Alert className="mb-4 md:mb-6 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Deposit processed successfully. Funds will be added to your wallet
            shortly.
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert className="mb-4 md:mb-6 bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-sm md:text-base">
            Amount
          </Label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">
                  {getCurrencySymbol(currency)}
                </span>
              </div>{" "}
              <Input
                id="amount"
                className={`pl-8 h-10 ${errors.amount ? "border-red-500" : ""}`}
                {...register("amount", {
                  required: "Amount is required",
                  pattern: {
                    value: /^\d*\.?\d+$/,
                    message: "Please enter a valid amount",
                  },
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0",
                  },
                  setValueAs: (value) =>
                    parseFloat(parseFloat(value).toFixed(2)),
                })}
                type="text"
                inputMode="decimal"
                placeholder="0.00"
              />
            </div>

            <Controller
              control={control}
              name="currency"
              rules={{ required: "Currency is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={`w-full sm:w-[110px] sm:ml-2 h-10 ${
                      errors.currency ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((curr) => (
                      <SelectItem key={curr.value} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>
          )}
          {errors.currency && (
            <p className="text-xs text-red-500 mt-1">
              {errors.currency.message}
            </p>
          )}
        </div>{" "}
        <div className="space-y-2">
          <Label htmlFor="card-element" className="text-sm md:text-base">
            Card Details
          </Label>
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
                }
              }}
            />
          </div>
          {cardError && (
            <p className="text-xs text-red-500 mt-1">{cardError}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Securely processed by Stripe. We don't store your card details.
          </p>
        </div>{" "}
        {/* Postal code is now handled by Stripe Elements */}
      </div>
      <div className="bg-muted p-3 md:p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">Transaction Details</div>
        <div className="space-y-1 text-xs md:text-sm">
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
            <span className="text-muted-foreground">Total</span>
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
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || Object.keys(errors).length > 0}
      >
        {isLoading ? (
          "Processing..."
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Funds
          </>
        )}
      </Button>{" "}
      <div className="text-xs text-muted-foreground">
        <p>
          Note: This is a secure card processor. Your card details are never
          stored on our servers.
        </p>
        <p>
          For testing, you can use the card number: 4242 4242 4242 4242, any
          future expiry date, and any CVC.
        </p>
      </div>
    </form>
  );
};

export default CardDepositForm;
