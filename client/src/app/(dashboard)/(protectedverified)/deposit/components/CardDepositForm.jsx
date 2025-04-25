import { CreditCard, PlusCircle, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" }
]

const CardDepositForm = ({
  formData,
  handleChange,
  handleSelectChange,
  handleSubmit,
  getCurrencySymbol,
  isLoading,
  success,
  error
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Deposit processed successfully. Funds will be added to your wallet shortly.
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="flex">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">{getCurrencySymbol(formData.currency)}</span>
              </div>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                className="pl-8"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <Select
              value={formData.currency}
              onValueChange={(value) => handleSelectChange("currency", value)}
            >
              <SelectTrigger className="w-[110px] ml-2">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(currency => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Input
            id="cardholderName"
            name="cardholderName"
            placeholder="John Doe"
            value={formData.cardholderName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            name="cardNumber"
            placeholder="**** **** **** ****"
            value={formData.cardNumber}
            onChange={handleChange}
            maxLength={19}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              maxLength={5}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              name="cvv"
              type="password"
              inputMode="numeric"
              placeholder="***"
              value={formData.cvv}
              onChange={handleChange}
              maxLength={4}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">Transaction Details</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount</span>
            <span>
              {formData.amount ? 
                `${getCurrencySymbol(formData.currency)}${parseFloat(formData.amount).toFixed(2)} ${formData.currency}` : 
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
              {formData.amount ? 
                `${getCurrencySymbol(formData.currency)}${parseFloat(formData.amount).toFixed(2)} ${formData.currency}` : 
                "—"
              }
            </span>
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
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