import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

const CardDetailsForm = ({
  formData,
  handleChange,
  isWithdrawalMethod,
  getCurrencySymbol
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardholderName">Cardholder Name</Label>
        <Input
          id="cardholderName"
          name="cardholderName"
          value={formData.cardholderName}
          onChange={handleChange}
          placeholder="John Doe"
          required={isWithdrawalMethod}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="**** **** **** ****"
          required={isWithdrawalMethod}
          maxLength={19}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            required={isWithdrawalMethod}
            maxLength={5}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            type="password"
            placeholder="***"
            required={isWithdrawalMethod}
            maxLength={4}
          />
        </div>
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">Card Details</div>
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
            <span className="text-muted-foreground">You Receive</span>
            <span className="font-medium">
              {formData.amount ? 
                `${getCurrencySymbol(formData.currency)}${parseFloat(formData.amount).toFixed(2)} ${formData.currency}` : 
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