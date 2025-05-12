import {
  Landmark,
  PlusCircle,
  Check,
  AlertCircle,
  Copy,
  Info,
} from "lucide-react";
import { useState } from "react";
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

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" },
];

const BankDepositForm = ({
  handleSubmit: onSubmitHandler,
  getCurrencySymbol,
  isLoading,
  success,
  error,
}) => {
  const [copiedItem, setCopiedItem] = useState(null);
  const [reviewingInfo, setReviewingInfo] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const referenceId = `DWALLET-${Math.floor(Math.random() * 1000000)}`;

  // Initialize React Hook Form
  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      amount: "",
      currency: "USD",
      transferReference: "",
      accountHolderName: "",
      email: "",
      phone: "",
      bankName: "",
    },
    mode: "onChange",
  });

  const currency = watch("currency");
  const amount = watch("amount");
  const transferReference = watch("transferReference");
  const accountHolderName = watch("accountHolderName");
  const email = watch("email");
  const phone = watch("phone");
  const bankName = watch("bankName");
  const parsedAmount = amount ? parseFloat(amount) : 0;

  const copyToClipboard = (text, itemType) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(itemType);
      setTimeout(() => setCopiedItem(null), 2000);
    });
  };

  const handleFormReview = async () => {
    // Validate form first
    const isValid = await trigger();
    if (!isValid) return;

    if (parsedAmount <= 0) {
      return;
    }

    // Show review screen
    setUserInfo({
      amount: parsedAmount,
      currency,
      transferReference,
      accountHolderName,
      email,
      phone,
      bankName,
    });

    setReviewingInfo(true);
  };

  const handleBackToForm = () => {
    setReviewingInfo(false);
  };

  const onSubmit = (data) => {
    // Convert amount to number
    const formattedData = {
      ...data,
      amount: parseFloat(data.amount),
      // Include collected user info
      userInfo: {
        accountHolderName: data.accountHolderName,
        email: data.email,
        phone: data.phone,
        bankName: data.bankName,
      },
    };
    onSubmitHandler(formattedData);
  };

  const hideFormOnSuccess = success;

  return (
    <div className="space-y-4 md:space-y-6 mt-4">
      {success && (
        <Alert className="mb-4 md:mb-6 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Deposit request submitted successfully. Funds will be added to your
            wallet once the bank transfer is confirmed.
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

      {!hideFormOnSuccess && !reviewingInfo && (
        <form onSubmit={handleSubmit(handleFormReview)} className="space-y-4">
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
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className={`pl-8 h-10 ${
                      errors.amount ? "border-red-500" : ""
                    }`}
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
                    })}
                    step="0.01"
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
                        {CURRENCIES.map((currency) => (
                          <SelectItem
                            key={currency.value}
                            value={currency.value}
                          >
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.amount.message}
                </p>
              )}
              {errors.currency && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.currency.message}
                </p>
              )}
            </div>

            {/* Additional user information collection */}
            <div className="space-y-4 mb-4">
              <div className="space-y-2">
                <Label
                  htmlFor="accountHolderName"
                  className="text-sm font-medium"
                >
                  Account Holder Name
                </Label>
                <Input
                  id="accountHolderName"
                  className={`h-10 ${
                    errors.accountHolderName ? "border-red-500" : ""
                  }`}
                  {...register("accountHolderName", {
                    required: "Account holder name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                  placeholder="Enter account holder name"
                />
                {errors.accountHolderName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.accountHolderName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName" className="text-sm font-medium">
                  Your Bank Name
                </Label>
                <Input
                  id="bankName"
                  className={`h-10 ${errors.bankName ? "border-red-500" : ""}`}
                  {...register("bankName", {
                    required: "Your bank name is required",
                  })}
                  placeholder="Enter your bank name"
                />
                {errors.bankName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.bankName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className={`h-10 ${errors.email ? "border-red-500" : ""}`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    className={`h-10 ${errors.phone ? "border-red-500" : ""}`}
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^\+?[0-9\s\-()]{10,15}$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-muted p-3 sm:p-5 rounded-lg space-y-4 sm:space-y-5">
              <div className="space-y-1">
                <div className="font-medium text-sm md:text-base">
                  Our Bank Details
                </div>
                <p className="text-xs text-muted-foreground">
                  Please use these details to make your bank transfer
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Bank Name
                  </Label>
                  <div className="flex items-center justify-between bg-white rounded-md border p-2 sm:p-2.5">
                    <span className="text-xs sm:text-sm truncate mr-1">
                      Digital Wallet Bank Ltd.
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() =>
                        copyToClipboard("Digital Wallet Bank Ltd.", "bank")
                      }
                    >
                      {copiedItem === "bank" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Account Number
                  </Label>
                  <div className="flex items-center justify-between bg-white rounded-md border p-2 sm:p-2.5">
                    <span className="text-xs sm:text-sm font-mono truncate mr-1">
                      12345678901234
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() =>
                        copyToClipboard("12345678901234", "account")
                      }
                    >
                      {copiedItem === "account" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Routing Number
                  </Label>
                  <div className="flex items-center justify-between bg-white rounded-md border p-2 sm:p-2.5">
                    <span className="text-xs sm:text-sm font-mono truncate mr-1">
                      123456789
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => copyToClipboard("123456789", "routing")}
                    >
                      {copiedItem === "routing" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Reference
                  </Label>
                  <div className="flex items-center justify-between bg-white rounded-md border p-2 sm:p-2.5">
                    <span className="text-xs sm:text-sm font-mono truncate mr-1">
                      {referenceId}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => copyToClipboard(referenceId, "reference")}
                    >
                      {copiedItem === "reference" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="transferReference"
                className="text-sm md:text-base"
              >
                Transfer Reference
              </Label>
              <Input
                id="transferReference"
                placeholder="Enter the reference used in your transfer"
                className={`h-10 ${
                  errors.transferReference ? "border-red-500" : ""
                }`}
                {...register("transferReference", {
                  required: "Transfer reference is required",
                  validate: (value) =>
                    value.includes("DWALLET-") ||
                    "Reference should include DWALLET-",
                })}
              />
              {errors.transferReference && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.transferReference.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                This should match the reference you used when making the bank
                transfer
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || Object.keys(errors).length > 0}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Continue
          </Button>
        </form>
      )}

      {/* Review Information Screen */}
      {!hideFormOnSuccess && reviewingInfo && userInfo && (
        <div className="space-y-4">
          <div className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-100 p-2 rounded-full">
                <Info className="h-5 w-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-medium text-gray-800">
                Review Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-medium text-base mb-2">
                  Transaction Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">
                      {getCurrencySymbol(userInfo.currency)}
                      {userInfo.amount.toFixed(2)} {userInfo.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Account Holder
                    </span>
                    <span>{userInfo.accountHolderName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Name</span>
                    <span>{userInfo.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span>{userInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span>{userInfo.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference</span>
                    <span>{userInfo.transferReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span>Bank Transfer</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBackToForm}
                >
                  Back
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Processing..."
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" /> Confirm Deposit
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        <p>Note: This is a demo app. No actual bank transfers are needed.</p>
        <p>Bank deposits typically take 1-3 business days to process.</p>
      </div>
    </div>
  );
};

export default BankDepositForm;
