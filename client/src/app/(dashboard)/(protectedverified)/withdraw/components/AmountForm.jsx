import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormContext, Controller } from "react-hook-form"

const AmountForm = ({
  currencies,
  getCurrencySymbol,
  wallet
}) => {
  const { register, control, formState: { errors }, watch } = useFormContext();
  const currency = watch("currency");
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{getCurrencySymbol(currency)}</span>
            </div>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              className={`pl-8 ${errors.amount ? "border-red-500" : ""}`}
              {...register("amount", {
                required: "Amount is required",
                min: {
                  value: 0.01,
                  message: "Amount must be greater than 0"
                },
                validate: value => {
                  const selectedCurrency = currency;
                  const balance = wallet.balances?.find(b => b.currency === selectedCurrency)?.amount || 0;
                  return parseFloat(value) <= balance || `Insufficient ${selectedCurrency} balance`;
                }
              })}
              step="0.01"
            />
          </div>
          <Controller
            name="currency"
            control={control}
            rules={{ required: "Currency is required" }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger className={`w-[120px] ${errors.currency ? "border-red-500" : ""}`}>
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
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          placeholder="Withdrawal for..."
          {...register("description")}
        />
      </div>
    </div>
  )
}

export default AmountForm