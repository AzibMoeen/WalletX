import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Landmark, Banknote } from "lucide-react"

const DepositMethodsCard = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Deposit Methods</CardTitle>
        <CardDescription>Available methods to add funds to your wallet</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 p-2 rounded-lg border">
          <CreditCard className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">Credit/Debit Card</p>
            <p className="text-muted-foreground">Instant deposit to your wallet</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg border">
          <Landmark className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">Bank Transfer</p>
            <p className="text-muted-foreground">1-3 business days processing time</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 rounded-lg border">
          <Banknote className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">Cash Deposit</p>
            <p className="text-muted-foreground">Available at partner locations</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DepositMethodsCard