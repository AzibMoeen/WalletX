import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftRight, Clock } from "lucide-react"

const ExchangeHistoryCard = ({ exchangeHistory, getCurrencySymbol }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Exchange History</CardTitle>
        <CardDescription>Your recent currency conversions</CardDescription>
      </CardHeader>
      <CardContent>
        {exchangeHistory.length > 0 ? (
          <div className="space-y-3">
            {exchangeHistory.map((exchange, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ArrowLeftRight className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{exchange.fromCurrency} to {exchange.toCurrency}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1.5" />
                      {exchange.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {getCurrencySymbol(exchange.toCurrency)}{exchange.toAmount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    from {getCurrencySymbol(exchange.fromCurrency)}{exchange.fromAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No exchange history</p>
            <p className="text-xs mt-1">Your recent exchanges will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ExchangeHistoryCard