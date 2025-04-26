import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

const RecentDepositsCard = ({ recentDeposits = [], getCurrencySymbol }) => {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6 pb-2 md:pb-3">
        <CardTitle className="text-base md:text-lg">Recent Deposits</CardTitle>
        <CardDescription>Your most recent transactions</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-2 md:pt-3">
        {recentDeposits.length > 0 ? (
          <ul className="space-y-2">
            {recentDeposits.map((deposit, index) => (
              <li 
                key={index} 
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 sm:p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-full flex-shrink-0">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{deposit.method}</p>
                    <p className="text-xs text-muted-foreground">{deposit.date}</p>
                  </div>
                </div>
                <div className="text-sm font-medium mt-1 sm:mt-0 ml-7 sm:ml-0">
                  {getCurrencySymbol(deposit.currency)}{deposit.amount.toFixed(2)} {deposit.currency}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 sm:py-6 text-muted-foreground">
            <p>No recent deposits</p>
            <p className="text-xs mt-1">Add funds to see your transactions here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentDepositsCard