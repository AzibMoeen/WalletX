import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftRight, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" }
]

const ExchangeForm = ({
  fromCurrency,
  toCurrency,
  fromAmount,
  toAmount,
  handleFromCurrencyChange,
  handleToCurrencyChange,
  handleFromAmountChange,
  handleSwapCurrencies,
  handleSubmit,
  conversionRate,
  getCurrencySymbol,
  isLoading
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Currency Exchange</CardTitle>
        <CardDescription>Convert between different currencies in your wallet</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-6">
            {/* From Currency */}
            <div className="space-y-2">
              <Label className="text-sm md:text-base">From</Label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">{getCurrencySymbol(fromCurrency)}</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-8 h-10"
                    value={fromAmount}
                    onChange={handleFromAmountChange}
                    required
                  />
                </div>
                <Select
                  value={fromCurrency}
                  onValueChange={handleFromCurrencyChange}
                >
                  <SelectTrigger className="w-full sm:w-[120px] h-10">
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
            
            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwapCurrencies}
                className="rounded-full h-10 w-10"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
            
            {/* To Currency */}
            <div className="space-y-2">
              <Label className="text-sm md:text-base">To</Label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:space-x-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">{getCurrencySymbol(toCurrency)}</span>
                  </div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-8 h-10"
                    value={toAmount}
                    readOnly
                  />
                </div>
                <Select
                  value={toCurrency}
                  onValueChange={handleToCurrencyChange}
                >
                  <SelectTrigger className="w-full sm:w-[120px] h-10">
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
          </div>
          
          {/* Exchange Rate Display */}
          <div className="bg-muted p-3 md:p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">Exchange Details</div>
            <div className="space-y-1 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Exchange Rate</span>
                <span>
                  1 {fromCurrency} = {conversionRate} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee</span>
                <span>No Fee (Demo)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">You Receive</span>
                <span className="font-medium">
                  {toAmount ? 
                    `${getCurrencySymbol(toCurrency)}${parseFloat(toAmount).toFixed(2)} ${toCurrency}` : 
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
                <ArrowLeftRight className="mr-2 h-4 w-4" /> Exchange
              </>
            )}
          </Button>
          
          <div className="text-xs text-muted-foreground">
            <p>Exchange rates are updated in real-time.</p>
            <p>You can only exchange between currencies you have in your wallet.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ExchangeForm