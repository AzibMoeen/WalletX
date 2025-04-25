import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

const ExchangeRatesCard = ({ exchangeRates, getCurrencySymbol, lastUpdated }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Exchange Rates</CardTitle>
            <CardDescription>Current conversion rates</CardDescription>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3 mr-1" />
            Updated {lastUpdated || "recently"}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {exchangeRates.map((rate, index) => (
            <div key={index} className="flex justify-between items-center p-2 rounded-lg border">
              <div className="flex items-center">
                <span className="font-medium">{rate.from} to {rate.to}</span>
              </div>
              <div className="text-sm">
                {getCurrencySymbol(rate.from)}1 = {getCurrencySymbol(rate.to)}{rate.rate.toFixed(4)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default ExchangeRatesCard