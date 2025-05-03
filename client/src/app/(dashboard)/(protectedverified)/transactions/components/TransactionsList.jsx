import { DollarSign, Filter, Download, ArrowUp, ArrowDown, Clock } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const TransactionsList = ({
  period, 
  activeCurrency,
  setActiveCurrency,
  activeTransactionType,
  setActiveTransactionType,
  filteredTransactions,
  isLoading,
  isOutgoingTransaction,
  formatDate,
  getCurrencySymbol,
  exportTransactionsToCSV
}) => {
  const router = useRouter()
  
  return (
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
          <div className="flex flex-col items-center justify-center w-full py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mb-2"></div>
            <p>Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full py-10 text-muted-foreground">
            <p>No transactions found for the selected filters</p>
          </div>
        ) : (
          <div className="space-y-4 overflow-hidden">
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
  )
}

export default TransactionsList