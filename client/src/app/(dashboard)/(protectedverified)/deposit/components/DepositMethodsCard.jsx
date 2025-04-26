import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Landmark, Banknote } from "lucide-react"

const DepositMethodsCard = () => {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6 pb-2 md:pb-3">
        <CardTitle className="text-base md:text-lg">Deposit Methods</CardTitle>
        <CardDescription>Available methods to add funds to your wallet</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-2 md:pt-3 space-y-2 text-sm">
        <div className="flex items-center gap-2 p-2.5 rounded-lg border hover:bg-gray-50 transition-colors">
          <CreditCard className="h-4 w-4 text-primary flex-shrink-0" />
          <div>
            <p className="font-medium text-sm md:text-base">Credit/Debit Card</p>
            <p className="text-muted-foreground text-xs sm:text-sm">Instant deposit to your wallet</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg border hover:bg-gray-50 transition-colors">
          <Landmark className="h-4 w-4 text-primary flex-shrink-0" />
          <div>
            <p className="font-medium text-sm md:text-base">Bank Transfer</p>
            <p className="text-muted-foreground text-xs sm:text-sm">1-3 business days processing time</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 rounded-lg border hover:bg-gray-50 transition-colors">
          <Banknote className="h-4 w-4 text-primary flex-shrink-0" />
          <div>
            <p className="font-medium text-sm md:text-base">Cash Deposit</p>
            <p className="text-muted-foreground text-xs sm:text-sm">Available at partner locations</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DepositMethodsCard