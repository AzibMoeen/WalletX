import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const CurrencyCard = ({ currency }) => {
  return (
    <Card key={currency.id} className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{currency.name}</CardTitle>
        <div className={`rounded-full p-1 ${currency.color}`}>
          <currency.icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currency.symbol}{" "}
          {currency.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <p
          className={`text-xs ${currency.change >= 0 ? "text-green-500" : "text-red-500"} flex items-center mt-1`}
        >
          {currency.change >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
          {Math.abs(currency.change)}% from last month
        </p>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
        <Button variant="ghost" size="sm">
          Deposit
        </Button>
        <Button variant="ghost" size="sm">
          Withdraw
        </Button>
        <Button variant="ghost" size="sm">
          Exchange
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CurrencyCard