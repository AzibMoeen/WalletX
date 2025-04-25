import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" }
]

const BalanceCard = ({ wallet, getBalanceDisplay, router, buttonAction = "deposit" }) => {
  const buttonText = buttonAction === "deposit" ? "Add Money" : "View Transactions"
  const buttonLink = buttonAction === "deposit" ? "/deposit" : "/wallet"
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Balances</CardTitle>
        <CardDescription>Your available funds</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {CURRENCIES.map(currency => (
          <div key={currency.value} className="flex justify-between items-center p-2 rounded-lg border">
            <span className="font-medium">{currency.label}</span>
            <span className="text-lg">{getBalanceDisplay(currency.value)}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
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