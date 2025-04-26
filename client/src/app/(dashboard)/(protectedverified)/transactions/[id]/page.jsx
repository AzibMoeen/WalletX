"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowDown, 
  ArrowUp, 
  Clock, 
  Copy, 
  Check,
  ArrowLeft,
  CreditCard,
  Building,
  Download
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
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export default function TransactionDetailPage({ params }) {
  const router = useRouter()
  const { id } = params
  const [transaction, setTransaction] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copiedItem, setCopiedItem] = useState(null)

  useEffect(() => {
    fetchTransactionDetails()
  }, [id])

  const fetchTransactionDetails = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`http://localhost:8000/api/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to fetch transaction details")
      }

      const data = await response.json()
      setTransaction(data.transaction)
    } catch (error) {
      console.error("Error fetching transaction details:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
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

  // Copy to clipboard function
  const copyToClipboard = (text, itemType) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(itemType)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopiedItem(null), 2000)
    })
  }

  // Get transaction description
  const getTransactionDescription = (tx) => {
    if (!tx) return ""
    
    switch (tx.type) {
      case 'send':
        return `Sent to ${tx.recipient?.fullname || tx.recipient?.email || 'User'}`
      case 'receive':
        return `Received from ${tx.sender?.fullname || tx.sender?.email || 'User'}`
      case 'deposit':
        return 'Deposit to wallet'
      case 'withdraw':
        return 'Withdrawal from wallet'
      case 'exchange':
        return `Exchanged ${tx.currencyFrom} to ${tx.currencyTo}`
      case 'request':
        return `Requested from ${tx.recipient?.fullname || tx.recipient?.email || 'User'}`
      case 'payment':
        return `Paid to ${tx.recipient?.fullname || tx.recipient?.email || 'User'}`
      default:
        return tx.type.charAt(0).toUpperCase() + tx.type.slice(1)
    }
  }

  // Generate receipt PDF (simplified for demo)
  const generateReceipt = () => {
    toast.success("Receipt downloaded successfully")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 mb-4"></div>
          <p>Loading transaction details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Alert className="bg-red-50 border-red-200 mb-6">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Alert className="bg-amber-50 border-amber-200 mb-6">
          <AlertDescription className="text-amber-800">Transaction not found</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push("/wallet/transactions")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Transactions
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl md:text-2xl font-bold">Transaction Details</h1>
        </div>
        <Button variant="outline" size="sm" onClick={generateReceipt}>
          <Download className="h-4 w-4 mr-2" />
          <span>Download Receipt</span>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg md:text-xl">
                {getTransactionDescription(transaction)}
              </CardTitle>
              <CardDescription>
                {formatDate(transaction.createdAt)}
              </CardDescription>
            </div>
            <div className={`p-3 rounded-full ${isOutgoingTransaction(transaction.type) ? 'bg-red-100' : 'bg-green-100'}`}>
              {isOutgoingTransaction(transaction.type) ? (
                <ArrowUp className="h-5 w-5 text-red-500" />
              ) : (
                <ArrowDown className="h-5 w-5 text-green-500" />
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between bg-muted p-4 rounded-lg">
            <div className="text-center sm:text-left mb-3 sm:mb-0">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className={`text-2xl font-bold ${isOutgoingTransaction(transaction.type) ? 'text-red-500' : 'text-green-500'}`}>
                {isOutgoingTransaction(transaction.type) ? '-' : '+'} 
                {getCurrencySymbol(transaction.currencyFrom)} 
                {transaction.amount.toFixed(2)} 
                <span className="text-base font-medium">{transaction.currencyFrom}</span>
              </p>
            </div>
            
            <div className={`px-3 py-2 rounded-full text-sm font-medium ${
              transaction.status === 'completed' ? 'bg-green-100 text-green-700' : 
              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
              'bg-gray-100 text-gray-700'
            }`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground">Transaction ID</span>
              <div className="flex items-center">
                <span className="font-mono text-sm mr-2">{transaction._id}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(transaction._id, 'txid')}
                >
                  {copiedItem === 'txid' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground">Reference Number</span>
              <div className="flex items-center">
                <span className="font-mono text-sm mr-2">{transaction.reference}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(transaction.reference, 'reference')}
                >
                  {copiedItem === 'reference' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground">Date & Time</span>
              <span>{formatDate(transaction.createdAt)}</span>
            </div>
            
            {transaction.type === 'send' || transaction.type === 'payment' ? (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-muted-foreground">Recipient</span>
                <span>{transaction.recipient?.fullname || transaction.recipient?.email || 'User'}</span>
              </div>
            ) : null}
            
            {transaction.type === 'receive' ? (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-muted-foreground">Sender</span>
                <span>{transaction.sender?.fullname || transaction.sender?.email || 'User'}</span>
              </div>
            ) : null}
            
            {transaction.type === 'exchange' ? (
              <>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">From Currency</span>
                  <span>{transaction.currencyFrom}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">To Currency</span>
                  <span>{transaction.currencyTo}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span>1 {transaction.currencyFrom} = {transaction.exchangeRate} {transaction.currencyTo}</span>
                </div>
              </>
            ) : null}
            
            {transaction.paymentMethod ? (
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-muted-foreground">Payment Method</span>
                <div className="flex items-center">
                  {transaction.paymentMethod === 'card' ? (
                    <CreditCard className="h-4 w-4 mr-2 text-primary" />
                  ) : transaction.paymentMethod === 'bank' ? (
                    <Building className="h-4 w-4 mr-2 text-primary" />
                  ) : null}
                  <span className="capitalize">{transaction.paymentMethod}</span>
                </div>
              </div>
            ) : null}
            
            {transaction.notes ? (
              <div className="flex justify-between items-start pb-2 border-b">
                <span className="text-muted-foreground">Notes</span>
                <span className="text-right max-w-[60%]">{transaction.notes}</span>
              </div>
            ) : null}
            
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-muted-foreground">Fee</span>
              <span>{getCurrencySymbol(transaction.currencyFrom)} {transaction.fee ? transaction.fee.toFixed(2) : '0.00'}</span>
            </div>
          </div>

          {(transaction.paymentMethod === 'card' && transaction.cardDetails && transaction.type === 'deposit') && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Card Details</h3>
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Card Number</span>
                  <span>•••• •••• •••• {transaction.cardDetails.cardNumber?.slice(-4) || '****'}</span>
                </div>
                {transaction.cardDetails.cardholderName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cardholder</span>
                    <span>{transaction.cardDetails.cardholderName}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {(transaction.paymentMethod === 'bank' && transaction.bankDetails) && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Bank Details</h3>
              <div className="bg-muted rounded-lg p-4 space-y-2">
                {transaction.bankDetails.bankName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Name</span>
                    <span>{transaction.bankDetails.bankName}</span>
                  </div>
                )}
                {transaction.bankDetails.accountNumber && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Number</span>
                    <span>•••• •••• {transaction.bankDetails.accountNumber.slice(-4) || '****'}</span>
                  </div>
                )}
                {transaction.bankDetails.transferReference && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transfer Reference</span>
                    <span>{transaction.bankDetails.transferReference}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-5">
          <Button variant="outline" onClick={() => router.push("/wallet/transactions")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Transactions
          </Button>
          
          {transaction.status === 'pending' && (
            <Button variant="destructive" onClick={() => toast.info("This functionality is not available in the demo")}>
              Cancel Transaction
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}