import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftRight, Clock } from "lucide-react"

const ExchangeHistoryCard = ({ exchangeHistory, getCurrencySymbol }) => {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6 pb-2 md:pb-3">
        <CardTitle className="text-base md:text-lg">Exchange History</CardTitle>
        <CardDescription>Your recent currency conversions</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-2 md:pt-3">
        {exchangeHistory.length > 0 ? (
          <div className="space-y-3">
            {exchangeHistory.map((exchange, index) => (
              <div 
                key={index} 
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors gap-2 sm:gap-0"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                    <ArrowLeftRight className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {exchange.fromCurrency} to {exchange.toCurrency}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1.5 flex-shrink-0" />
                      {exchange.date}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center sm:block sm:text-right mt-1 sm:mt-0 pl-10 sm:pl-0">
                  <span className="text-xs text-muted-foreground sm:hidden">Amount:</span>
                  <div>
                    <p className="text-sm font-medium">
                      {getCurrencySymbol(exchange.toCurrency)}{exchange.toAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      from {getCurrencySymbol(exchange.fromCurrency)}{exchange.fromAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 sm:py-6 text-muted-foreground">
            <p>No exchange history</p>
            <p className="text-xs mt-1">Your recent exchanges will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ExchangeHistoryCard