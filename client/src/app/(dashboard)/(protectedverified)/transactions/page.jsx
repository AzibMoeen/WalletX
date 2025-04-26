"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowDown, 
  ArrowUp, 
  Calendar, 
  DollarSign, 
  Download,
  Filter,
  PieChart,
  Clock
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useWalletStore from "@/lib/store/useWalletStore"
import { toast } from "sonner"

export default function TransactionsPage() {
  const router = useRouter()
  const { fetchTransactions, transactions, stats, isLoading, error } = useWalletStore()
  
  const [period, setPeriod] = useState("all")
  const [activeCurrency, setActiveCurrency] = useState("all")
  const [activeTransactionType, setActiveTransactionType] = useState("all")
  
  useEffect(() => {
    fetchTransactions(period !== "all" ? period : null)
  }, [fetchTransactions, period])
  
  // Format currency amounts
  const formatCurrency = (amount, currency) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    })
    return formatter.format(amount)
  }
  
  // Get currency symbol
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "USD": return "$"
      case "EUR": return "€"
      case "PKR": return "₨"
      default: return "$"
    }
  }
  
  // Helper to determine if transaction is outgoing
  const isOutgoingTransaction = (type) => {
    return ["send", "withdraw", "payment"].includes(type)
  }
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Filter transactions based on selected filters
  const filteredTransactions = transactions?.filter(tx => {
    if (activeCurrency !== "all" && tx.currencyFrom !== activeCurrency) {
      return false
    }
    
    if (activeTransactionType !== "all") {
      if (activeTransactionType === "incoming" && isOutgoingTransaction(tx.type)) {
        return false
      }
      if (activeTransactionType === "outgoing" && !isOutgoingTransaction(tx.type)) {
        return false
      }
    }
    
    return true
  }) || []
  
  // Calculate totals for the stats section
  const getTotalSpent = () => {
    if (!stats?.spent) return { USD: 0, EUR: 0, PKR: 0 }
    
    const result = { USD: 0, EUR: 0, PKR: 0 }
    stats.spent.forEach(item => {
      result[item._id] = item.total
    })
    return result
  }
  
  const getTotalReceived = () => {
    if (!stats?.received) return { USD: 0, EUR: 0, PKR: 0 }
    
    const result = { USD: 0, EUR: 0, PKR: 0 }
    stats.received.forEach(item => {
      result[item._id] = item.total
    })
    return result
  }

  // Export transactions to CSV
  const exportTransactionsToCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    try {
      // Define CSV headers
      const headers = [
        "Date",
        "Type",
        "Description",
        "Amount",
        "Currency",
        "Status",
        "Reference",
      ];

      // Format transaction data for CSV
      const csvRows = filteredTransactions.map(tx => {
        const sign = isOutgoingTransaction(tx.type) ? '-' : '+';
        
        // Generate description based on transaction type
        let description = "";
        if (tx.type === 'send') description = `Sent to ${tx.recipient?.fullname || tx.recipient?.email || 'User'}`;
        else if (tx.type === 'receive') description = `Received from ${tx.sender?.fullname || tx.sender?.email || 'User'}`;
        else if (tx.type === 'deposit') description = 'Deposit';
        else if (tx.type === 'withdraw') description = 'Withdrawal';
        else if (tx.type === 'exchange') description = `Exchanged ${tx.currencyFrom} to ${tx.currencyTo}`;
        else if (tx.type === 'request') description = `Requested from ${tx.recipient?.fullname || tx.recipient?.email || 'User'}`;
        else if (tx.type === 'payment') description = `Paid to ${tx.recipient?.fullname || tx.recipient?.email || 'User'}`;

        return [
          new Date(tx.createdAt).toISOString().split('T')[0], // Date in YYYY-MM-DD format
          tx.type.charAt(0).toUpperCase() + tx.type.slice(1), // Capitalized type
          description,
          `${sign}${tx.amount.toFixed(2)}`,
          tx.currencyFrom,
          tx.status.charAt(0).toUpperCase() + tx.status.slice(1), // Capitalized status
          tx.reference
        ];
      });

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...csvRows.map(row => row.join(","))
      ].join("\n");

      // Create a Blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      // Set filename with current date
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const filename = `transaction_history_${today}.csv`;
      
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.display = "none";
      
      // Append to document, trigger download, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Transaction history exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export transactions");
    }
  };
  
  // Prepare stats data for display
  const spentTotals = getTotalSpent()
  const receivedTotals = getTotalReceived()
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-xl md:text-2xl font-bold">Transactions History</h1>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={period} onValueChange={setPeriod} className="flex-1 sm:flex-none">
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {period === "all" && "All Time"}
                  {period === "daily" && "Today"}
                  {period === "weekly" && "This Week"}
                  {period === "monthly" && "This Month"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="daily">Today</SelectItem>
              <SelectItem value="weekly">This Week</SelectItem>
              <SelectItem value="monthly">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={exportTransactionsToCSV}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ArrowUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["USD", "EUR", "PKR"].map(currency => (
                <div key={currency} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {currency}
                  </span>
                  <span className="font-medium text-red-500">
                    {getCurrencySymbol(currency)} {spentTotals[currency]?.toFixed(2) || "0.00"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <ArrowDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["USD", "EUR", "PKR"].map(currency => (
                <div key={currency} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {currency}
                  </span>
                  <span className="font-medium text-green-500">
                    {getCurrencySymbol(currency)} {receivedTotals[currency]?.toFixed(2) || "0.00"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
            <PieChart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["USD", "EUR", "PKR"].map(currency => {
                const net = (receivedTotals[currency] || 0) - (spentTotals[currency] || 0)
                return (
                  <div key={currency} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {currency}
                    </span>
                    <span className={`font-medium ${net >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {getCurrencySymbol(currency)} {net.toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Transactions List */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle>Transactions</CardTitle>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Select 
                value={activeCurrency} 
                onValueChange={setActiveCurrency}
                className="flex-1 sm:flex-none"
              >
                <SelectTrigger className="w-full sm:w-[120px]">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{activeCurrency === "all" ? "All" : activeCurrency}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Currencies</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="PKR">PKR</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={activeTransactionType} 
                onValueChange={setActiveTransactionType}
                className="flex-1 sm:flex-none"
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {activeTransactionType === "all" && "All Types"}
                      {activeTransactionType === "incoming" && "Incoming"}
                      {activeTransactionType === "outgoing" && "Outgoing"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="incoming">Incoming</SelectItem>
                  <SelectItem value="outgoing">Outgoing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>
            {period === "all" && "Your complete transaction history"}
            {period === "daily" && "Your transactions from today"}
            {period === "weekly" && "Your transactions from this week"}
            {period === "monthly" && "Your transactions from this month"}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mb-2"></div>
              <p>Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No transactions found for the selected filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map(transaction => (
                <div 
                  key={transaction._id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer gap-3"
                  onClick={() => router.push(`/transactions/${transaction._id}`)}
                >
                  <div className="flex items-start sm:items-center gap-3 md:gap-4 w-full sm:w-auto">
                    <div className={`p-2 rounded-full flex-shrink-0 ${isOutgoingTransaction(transaction.type) ? 'bg-red-100' : 'bg-green-100'}`}>
                      {isOutgoingTransaction(transaction.type) ? (
                        <ArrowUp className="h-4 w-4 text-red-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-medium text-sm md:text-base line-clamp-1">
                        {transaction.type === 'send' && `Sent to ${transaction.recipient?.fullname || transaction.recipient?.email || 'User'}`}
                        {transaction.type === 'receive' && `Received from ${transaction.sender?.fullname || transaction.sender?.email || 'User'}`}
                        {transaction.type === 'deposit' && 'Deposit'}
                        {transaction.type === 'withdraw' && 'Withdrawal'}
                        {transaction.type === 'exchange' && `Exchanged ${transaction.currencyFrom} to ${transaction.currencyTo}`}
                        {transaction.type === 'request' && `Requested from ${transaction.recipient?.fullname || transaction.recipient?.email || 'User'}`}
                        {transaction.type === 'payment' && `Paid to ${transaction.recipient?.fullname || transaction.recipient?.email || 'User'}`}
                      </p>
                      <div className="flex flex-wrap items-center text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="mr-2">{formatDate(transaction.createdAt)}</span>
                        <span className="hidden sm:inline mx-1">•</span>
                        <span>Ref: {transaction.reference}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center w-full sm:w-auto sm:text-right mt-2 sm:mt-0">
                    <span className="sm:hidden text-xs text-muted-foreground">Amount:</span>
                    <div>
                      <p className={`font-medium ${isOutgoingTransaction(transaction.type) ? 'text-red-500' : 'text-green-500'}`}>
                        {isOutgoingTransaction(transaction.type) ? '-' : '+'} 
                        {getCurrencySymbol(transaction.currencyFrom)} 
                        {transaction.amount.toFixed(2)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t px-4 py-3 md:px-6 md:py-4">
          <Button variant="outline" className="w-full" onClick={exportTransactionsToCSV}>
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export Transaction History</span>
            <span className="sm:hidden">Export History</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}