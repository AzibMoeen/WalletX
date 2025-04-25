import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const AmountForm = ({
  formData,
  handleChange,
  handleCurrencyChange,
  currencies,
  getCurrencySymbol,
  wallet
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="flex space-x-2">
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
              min="0.01"
              step="0.01"
            />
          </div>
          <Select
            value={formData.currency}
            onValueChange={(value) => handleCurrencyChange(value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(currency => {
                const balance = wallet.balances?.find(b => b.currency === currency.value)
                return (
                  <SelectItem key={currency.value} value={currency.value}>
                    <div className="flex justify-between items-center w-full">
                      <span>{currency.label}</span>
                      <span className="text-xs text-muted-foreground">
                        {balance ? `${getCurrencySymbol(currency.value)}${balance.amount.toFixed(2)}` : '0.00'}
                      </span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Withdrawal for..."
        />
      </div>
    </div>
  )
}

export default AmountForm