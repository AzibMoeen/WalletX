import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormContext } from "react-hook-form"

const CardDetailsForm = ({
  getCurrencySymbol
}) => {
  const { register, formState: { errors }, watch } = useFormContext();
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
            required: "Cardholder name is required"
          })}
        />
        {errors.cardholderName && (
          <p className="text-xs text-red-500 mt-1">{errors.cardholderName.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          placeholder="**** **** **** ****"
          maxLength={19}
          className={errors.cardNumber ? "border-red-500" : ""}
          {...register("cardNumber", {
            required: "Card number is required",
            pattern: {
              value: /^[0-9]{13,19}$/,
              message: "Please enter a valid card number"
            }
          })}
        />
        {errors.cardNumber && (
          <p className="text-xs text-red-500 mt-1">{errors.cardNumber.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            placeholder="MM/YY"
            maxLength={5}
            className={errors.expiryDate ? "border-red-500" : ""}
            {...register("expiryDate", {
              required: "Expiry date is required",
              pattern: {
                value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                message: "Please enter a valid date (MM/YY)"
              },
              validate: value => {
                const [month, year] = value.split('/');
                const currentYear = new Date().getFullYear() % 100;
                const currentMonth = new Date().getMonth() + 1;
                const expYear = parseInt(year, 10);
                const expMonth = parseInt(month, 10);
                
                if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
                  return "Card has expired";
                }
                return true;
              }
            })}
          />
          {errors.expiryDate && (
            <p className="text-xs text-red-500 mt-1">{errors.expiryDate.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="password"
            placeholder="***"
            maxLength={4}
            className={errors.cvv ? "border-red-500" : ""}
            {...register("cvv", {
              required: "CVV is required",
              pattern: {
                value: /^[0-9]{3,4}$/,
                message: "CVV must be 3 or 4 digits"
              }
            })}
          />
          {errors.cvv && (
            <p className="text-xs text-red-500 mt-1">{errors.cvv.message}</p>
          )}
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">Card Details</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span>
              {amount ? 
                `${getCurrencySymbol(currency)}${parseFloat(amount).toFixed(2)} ${currency}` : 
                "—"
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fee</span>
            <span>No Fee (Demo)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">You Receive</span>
            <span className="font-medium">
              {amount ? 
                `${getCurrencySymbol(currency)}${parseFloat(amount).toFixed(2)} ${currency}` : 
                "—"
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardDetailsForm