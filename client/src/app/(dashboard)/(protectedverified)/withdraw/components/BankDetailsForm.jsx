import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

const BankDetailsForm = ({ getCurrencySymbol }) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  const amount = watch("amount");
  const currency = watch("currency");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accountHolderName">Account Holder Name</Label>
        <Input
          id="accountHolderName"
          placeholder="John Doe"
          className={errors.accountHolderName ? "border-red-500" : ""}
          {...register("accountHolderName", {
            required: "Account holder name is required",
          })}
        />
        {errors.accountHolderName && (
          <p className="text-xs text-red-500 mt-1">
            {errors.accountHolderName.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          placeholder="Bank Name"
          className={errors.bankName ? "border-red-500" : ""}
          {...register("bankName", {
            required: "Bank name is required",
          })}
        />
        {errors.bankName && (
          <p className="text-xs text-red-500 mt-1">{errors.bankName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          placeholder="Account Number"
          className={errors.accountNumber ? "border-red-500" : ""}
          {...register("accountNumber", {
            required: "Account number is required",
            pattern: {
              value: /^[0-9]{8,17}$/,
              message: "Please enter a valid account number",
            },
          })}
        />
        {errors.accountNumber && (
          <p className="text-xs text-red-500 mt-1">
            {errors.accountNumber.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="routingNumber">Routing/Swift Number</Label>
        <Input
          id="routingNumber"
          placeholder="Routing/Swift Number"
          className={errors.routingNumber ? "border-red-500" : ""}
          {...register("routingNumber", {
            required: "Routing/Swift number is required",
            pattern: {
              value: /^[0-9A-Z]{8,11}$/,
              message: "Please enter a valid routing or SWIFT code",
            },
          })}
        />
        {errors.routingNumber && (
          <p className="text-xs text-red-500 mt-1">
            {errors.routingNumber.message}
          </p>
        )}
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">Bank Transfer Details</div>
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
            <span className="text-muted-foreground">Processing Time</span>
            <span>1-3 Business Days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fee</span>
            <span>No Fee (Demo)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsForm;
