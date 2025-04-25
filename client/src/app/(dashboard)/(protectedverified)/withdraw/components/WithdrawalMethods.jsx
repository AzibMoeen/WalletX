import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Landmark } from "lucide-react"

const WithdrawalMethods = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Withdrawal Methods</CardTitle>
        <CardDescription>Available options to withdraw funds</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <div className="bg-primary/10 p-2 rounded-full">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Card Withdrawal</p>
              <p className="text-xs text-muted-foreground">
                Withdraw directly to your bank card
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border">
            <div className="bg-primary/10 p-2 rounded-full">
              <Landmark className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Bank Transfer</p>
              <p className="text-xs text-muted-foreground">
                Withdraw to your bank account
              </p>
            </div>
          </div>

          <div className="mt-4 text-xs text-muted-foreground">
            <p>Withdrawals typically take 1-3 business days to process.</p>
            <p className="mt-1">Verification may be required for large amounts.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WithdrawalMethods