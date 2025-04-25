import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

const RecentDepositsCard = ({ recentDeposits = [], getCurrencySymbol }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Deposits</CardTitle>
        <CardDescription>Your most recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {recentDeposits.length > 0 ? (
          <ul className="space-y-2">
            {recentDeposits.map((deposit, index) => (
              <li key={index} className="flex justify-between items-center p-2 rounded-lg border">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-full">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{deposit.method}</p>
                    <p className="text-xs text-muted-foreground">{deposit.date}</p>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {getCurrencySymbol(deposit.currency)}{deposit.amount.toFixed(2)} {deposit.currency}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No recent deposits</p>
            <p className="text-xs mt-1">Add funds to see your transactions here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentDepositsCard