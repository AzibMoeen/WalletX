import { ArrowUp, ArrowDown, PieChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TransactionStatsCards = ({ 
  spentTotals,
  receivedTotals,
  getCurrencySymbol
}) => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <ArrowUp className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {["USD", "EUR", "PKR"].map(currency => (
              <div key={currency} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {currency}
                </span>
                <span className="font-medium text-red-500">
                  {getCurrencySymbol(currency)} {spentTotals[currency]?.toFixed(2) || "0.00"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Received</CardTitle>
          <ArrowDown className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {["USD", "EUR", "PKR"].map(currency => (
              <div key={currency} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {currency}
                </span>
                <span className="font-medium text-green-500">
                  {getCurrencySymbol(currency)} {receivedTotals[currency]?.toFixed(2) || "0.00"}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
          <PieChart className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {["USD", "EUR", "PKR"].map(currency => {
              const net = (receivedTotals[currency] || 0) - (spentTotals[currency] || 0)
              return (
                <div key={currency} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {currency}
                  </span>
                  <span className={`font-medium ${net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {getCurrencySymbol(currency)} {net.toFixed(2)}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionStatsCards