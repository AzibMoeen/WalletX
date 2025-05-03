import { CreditCard, PlusCircle, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useForm, Controller } from "react-hook-form"

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" }
]

const CardDepositForm = ({
  handleSubmit: onSubmitHandler,
  getCurrencySymbol,
  isLoading,
  success,
  error
}) => {
  // Initialize React Hook Form
  const { 
    register, 
    control, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      amount: "",
      currency: "USD",
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: ""
    },
    mode: "onChange"
  });

  const currency = watch("currency");
  const amount = watch("amount");

  const onSubmit = (data) => {
    // Convert amount to number
    const formattedData = {
      ...data,
      amount: parseFloat(data.amount)
    };
    onSubmitHandler(formattedData);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 mt-4">
      {success && (
        <Alert className="mb-4 md:mb-6 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Deposit processed successfully. Funds will be added to your wallet shortly.
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
          <Label htmlFor="amount" className="text-sm md:text-base">Amount</Label>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{getCurrencySymbol(currency)}</span>
              </div>
              <Input
                id="amount"
                className={`pl-8 h-10 ${errors.amount ? "border-red-500" : ""}`}
                {...register("amount", {
                  required: "Amount is required",
                  pattern: {
                    value: /^\d*\.?\d+$/,
                    message: "Please enter a valid amount"
                  },
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0"
                  }
                })}
                type="number"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            
            <Controller
              control={control}
              name="currency"
              rules={{ required: "Currency is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger className={`w-full sm:w-[110px] sm:ml-2 h-10 ${errors.currency ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(curr => (
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
            <p className="text-xs text-red-500 mt-1">{errors.currency.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardholderName" className="text-sm md:text-base">Cardholder Name</Label>
          <Input
            id="cardholderName"
            className={`h-10 ${errors.cardholderName ? "border-red-500" : ""}`}
            {...register("cardholderName", {
              required: "Cardholder name is required"
            })}
            placeholder="John Doe"
          />
          {errors.cardholderName && (
            <p className="text-xs text-red-500 mt-1">{errors.cardholderName.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber" className="text-sm md:text-base">Card Number</Label>
          <Input
            id="cardNumber"
            className={`h-10 ${errors.cardNumber ? "border-red-500" : ""}`}
            {...register("cardNumber", {
              required: "Card number is required",
              pattern: {
                value: /^[0-9]{13,19}$/,
                message: "Please enter a valid card number"
              }
            })}
            placeholder="**** **** **** ****"
            maxLength={19}
          />
          {errors.cardNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.cardNumber.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate" className="text-sm md:text-base">Expiry Date</Label>
            <Input
              id="expiryDate"
              className={`h-10 ${errors.expiryDate ? "border-red-500" : ""}`}
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
              placeholder="MM/YY"
              maxLength={5}
            />
            {errors.expiryDate && (
              <p className="text-xs text-red-500 mt-1">{errors.expiryDate.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvv" className="text-sm md:text-base">CVV</Label>
            <Input
              id="cvv"
              type="password"
              inputMode="numeric"
              className={`h-10 ${errors.cvv ? "border-red-500" : ""}`}
              {...register("cvv", {
                required: "CVV is required",
                pattern: {
                  value: /^[0-9]{3,4}$/,
                  message: "CVV must be 3 or 4 digits"
                }
              })}
              placeholder="***"
              maxLength={4}
            />
            {errors.cvv && (
              <p className="text-xs text-red-500 mt-1">{errors.cvv.message}</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-muted p-3 md:p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">Transaction Details</div>
        <div className="space-y-1 text-xs md:text-sm">
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
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium">
              {amount ? 
                `${getCurrencySymbol(currency)}${parseFloat(amount).toFixed(2)} ${currency}` : 
                "—"
              }
            </span>
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading || Object.keys(errors).length > 0}>
        {isLoading ? (
          "Processing..."
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Funds
          </>
        )}
      </Button>
      
      <div className="text-xs text-muted-foreground">
        <p>Note: This is a demo app. No actual charges will be made.</p>
        <p>For testing, you can use any valid-format card details.</p>
      </div>
    </form>
  )
}

export default CardDepositForm