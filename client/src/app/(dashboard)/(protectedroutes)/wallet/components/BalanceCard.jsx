import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" }
]

const BalanceCard = ({ wallet, getBalanceDisplay, router, buttonAction = "deposit" }) => {
  const buttonText = buttonAction === "deposit" ? "Add Money" : "View Transactions"
  const buttonLink = buttonAction === "deposit" ? "/deposit" : "/wallet/transactions"
  
  return (
    <Card className="h-full">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">My Balances</CardTitle>
        <CardDescription>Your available funds</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-4 md:p-6 pt-0 md:pt-0">
        {CURRENCIES.map(currency => (
          <div 
            key={currency.value} 
            className="flex justify-between items-center p-2 sm:p-3 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-sm md:text-base">{currency.label}</span>
            <span className="text-base md:text-lg font-semibold">{getBalanceDisplay(currency.value)}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="p-4 md:p-6 pt-0 md:pt-0">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => router.push(buttonLink)}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default BalanceCard