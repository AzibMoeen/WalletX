import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

const ExchangeRatesCard = ({ exchangeRates, getCurrencySymbol, lastUpdated }) => {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6 pb-2 md:pb-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
          <div>
            <CardTitle className="text-base md:text-lg">Exchange Rates</CardTitle>
            <CardDescription>Current conversion rates</CardDescription>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3 mr-1" />
            Updated {lastUpdated || "recently"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-2 md:pt-3">
        <div className="space-y-2">
          {exchangeRates.map((rate, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center p-2 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <span className="font-medium text-xs sm:text-sm">
                  {rate.from} <span className="hidden xs:inline">to</span> {rate.to}
                </span>
              </div>
              <div className="text-xs sm:text-sm">
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