import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const BankDetailsForm = ({
  formData,
  handleChange,
  isWithdrawalMethod,
  getCurrencySymbol
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accountHolderName">Account Holder Name</Label>
        <Input
          id="accountHolderName"
          name="accountHolderName"
          value={formData.accountHolderName}
          onChange={handleChange}
          placeholder="John Doe"
          required={isWithdrawalMethod}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          placeholder="Bank Name"
          required={isWithdrawalMethod}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="Account Number"
          required={isWithdrawalMethod}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="routingNumber">Routing/Swift Number</Label>
        <Input
          id="routingNumber"
          name="routingNumber"
          value={formData.routingNumber}
          onChange={handleChange}
          placeholder="Routing/Swift Number"
          required={isWithdrawalMethod}
        />
      </div>
      
      <div className="bg-muted p-4 rounded-lg">
        <div className="text-sm font-medium mb-2">Bank Transfer Details</div>
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
  )
}

export default BankDetailsForm