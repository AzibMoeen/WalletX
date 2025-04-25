import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, ArrowDown } from "lucide-react"

const WithdrawalHistoryCard = ({ withdrawalHistory, getCurrencySymbol }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Withdrawal History</CardTitle>
        <CardDescription>Your recent withdrawal transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {withdrawalHistory && withdrawalHistory.length > 0 ? (
          <div className="space-y-3">
            {withdrawalHistory.map((transaction, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <ArrowDown className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {transaction.withdrawalMethod === "card" ? "Card Withdrawal" : "Bank Transfer"}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1.5" />
                      {transaction.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">
                    - {getCurrencySymbol(transaction.currency)}{transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No withdrawal history</p>
            <p className="text-xs mt-1">Your recent withdrawals will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default WithdrawalHistoryCard