"use client"

import { useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Clock,
  CreditCard,
  DollarSign,
  EuroIcon,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const currencies = [
    {
      id: "usd",
      name: "US Dollar",
      code: "USD",
      symbol: "$",
      balance: 4285.75,
      change: 2.5,
      icon: DollarSign,
      color: "bg-emerald-500",
    },
    {
      id: "eur",
      name: "Euro",
      code: "EUR",
      symbol: "€",
      balance: 3950.2,
      change: -1.2,
      icon: EuroIcon,
      color: "bg-blue-500",
    },
    {
      id: "pkr",
      name: "Pakistan Rupee",
      code: "PKR",
      symbol: "₨",
      balance: 275000.0,
      change: 0.8,
      icon: CreditCard,
      color: "bg-green-500",
    },
  ]

  const transactions = [
    {
      id: "tx1",
      type: "incoming",
      amount: 250.0,
      currency: "USD",
      date: "Today, 10:45 AM",
      description: "Payment from John Doe",
    },
    {
      id: "tx2",
      type: "outgoing",
      amount: 120.5,
      currency: "EUR",
      date: "Yesterday, 3:20 PM",
      description: "Online Purchase",
    },
    {
      id: "tx3",
      type: "incoming",
      amount: 15000.0,
      currency: "PKR",
      date: "Mar 15, 2023",
      description: "Salary Deposit",
    },
    {
      id: "tx4",
      type: "outgoing",
      amount: 75.25,
      currency: "USD",
      date: "Mar 14, 2023",
      description: "Subscription Payment",
    },
    {
      id: "tx5",
      type: "incoming",
      amount: 180.0,
      currency: "EUR",
      date: "Mar 12, 2023",
      description: "Refund",
    },
  ]

  const formatCurrency = (amount, currency) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    })
    return formatter.format(amount)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Wallet</h1>
          <p className="text-muted-foreground">Manage your currencies and transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Export Statement</DropdownMenuItem>
              <DropdownMenuItem>Print Summary</DropdownMenuItem>
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {currencies.map((currency) => (
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
        ))}
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent transactions across all currencies</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-full p-2 ${tx.type === "incoming" ? "bg-green-100" : "bg-red-100"}`}>
                        {tx.type === "incoming" ? (
                          <ArrowDown
                            className={`h-4 w-4 ${tx.type === "incoming" ? "text-green-500" : "text-red-500"}`}
                          />
                        ) : (
                          <ArrowUp
                            className={`h-4 w-4 ${tx.type === "incoming" ? "text-green-500" : "text-red-500"}`}
                          />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" /> {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className={`text-right ${tx.type === "incoming" ? "text-green-500" : "text-red-500"}`}>
                      <p className="font-medium">
                        {tx.type === "incoming" ? "+" : "-"} {formatCurrency(tx.amount, tx.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground">{tx.currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 px-6 py-3">
              <Button variant="outline" className="w-full">
                View All Transactions
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchange Rates</CardTitle>
              <CardDescription>Current exchange rates between your currencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>1 USD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>0.92 EUR</span>
                    <EuroIcon className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>1 USD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>278.50 PKR</span>
                    <CreditCard className="h-4 w-4" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <EuroIcon className="h-4 w-4" />
                    <span>1 EUR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>302.72 PKR</span>
                    <CreditCard className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and filter your transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Detailed transaction history will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View your spending patterns and currency performance</CardDescription>
            </CardHeader>
            <CardContent className="flex h-[300px] items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                <p className="mt-2 text-sm text-muted-foreground">Detailed analytics and charts will appear here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
