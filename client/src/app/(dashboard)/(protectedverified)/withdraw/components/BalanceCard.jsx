import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"

const BalanceCard = ({ wallet, getBalanceDisplay, router, buttonAction = "deposit" }) => {
  const handleButtonClick = () => {
    if (buttonAction === "deposit") {
      router.push("/wallet/deposit")
    } else if (buttonAction === "withdraw") {
      router.push("/wallet/request")
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Wallet Balance</CardTitle>
        <CardDescription>Your current balance across all currencies</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          {wallet.balances && wallet.balances.length > 0 ? (
            wallet.balances.map((balance, index) => (
              <div key={index} className="flex justify-between items-center p-2 rounded-lg border">
                <span className="font-medium">{balance.currency}</span>
                <span className="text-sm">{getBalanceDisplay(balance.currency)}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>No balances found</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleButtonClick}
        >
          {buttonAction === "deposit" ? (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Funds
            </>
          ) : (
            <>
              <ArrowRight className="mr-2 h-4 w-4" /> Withdraw
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default BalanceCard