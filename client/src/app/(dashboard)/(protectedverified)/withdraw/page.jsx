"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, AlertCircle } from "lucide-react"
import BalanceCard from "./components/BalanceCard"
import WithdrawalMethods from "./components/WithdrawalMethods"
import WithdrawalHistoryCard from "./components/WithdrawalHistoryCard"
import WithdrawalForm from "./components/WithdrawalForm"

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" }
]

export default function WithdrawPage() {
  const router = useRouter()
  const [wallet, setWallet] = useState({ balances: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [withdrawalHistory, setWithdrawalHistory] = useState([])

  useEffect(() => {
    fetchWalletBalance()
    fetchWithdrawalHistory()
  }, [])

  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("https://walletx-production.up.railway.app/api/transactions/balance", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch wallet balance")
      }
      
      const data = await response.json()
      setWallet(data.wallet)
    } catch (error) {
      console.error("Error fetching wallet balance:", error)
    }
  }
  
  const fetchWithdrawalHistory = () => {
    // This would normally fetch from the API
    // For demo purposes, we're using mock data
    setWithdrawalHistory([
      { 
        amount: 150,
        currency: "USD",
        withdrawalMethod: "card",
        date: "Apr 20, 2025",
        status: "Completed"
      },
      { 
        amount: 100,
        currency: "EUR",
        withdrawalMethod: "bank",
        date: "Apr 15, 2025",
        status: "Processing"
      },
      { 
        amount: 5000,
        currency: "PKR",
        withdrawalMethod: "bank",
        date: "Apr 10, 2025",
        status: "Completed"
      }
    ])
  }

  // Helper to format balance display
  const getBalanceDisplay = (currency) => {
    const balance = wallet.balances?.find(b => b.currency === currency)
    const currencyObj = CURRENCIES.find(c => c.value === currency)
    if (balance && currencyObj) {
      return `${currencyObj.symbol}${balance.amount.toFixed(2)}`
    }
    return `${currency} 0.00`
  }

  // Get currency symbol
  const getCurrencySymbol = (currency) => {
    return CURRENCIES.find(c => c.value === currency)?.symbol || ""
  }

  const handleSubmit = async (formData) => {
    setIsLoading(true)
    setError("")
    setSuccess(false)
    
    try {
      // Validate form
      if (!formData.amount || formData.amount <= 0) {
        throw new Error("Please enter a valid amount to withdraw")
      }
      
      // Check if user has sufficient balance
      const fromBalance = wallet.balances?.find(b => b.currency === formData.currency)?.amount || 0
      if (formData.amount > fromBalance) {
        throw new Error(`Insufficient ${formData.currency} balance`)
      }
      
      const token = localStorage.getItem("accessToken")
      const response = await fetch("https://walletx-production.up.railway.app/api/transactions/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to process withdrawal")
      }
      
      // Update wallet balance
      await fetchWalletBalance()
      
      setSuccess(true)
      
      // Add the withdrawal to history
      setWithdrawalHistory(prev => [{
        amount: formData.amount,
        currency: formData.currency,
        withdrawalMethod: formData.withdrawalMethod,
        date: new Date().toLocaleDateString(),
        status: "Processing"
      }, ...prev])
      
      // Redirect to wallet page after 2 seconds
      setTimeout(() => {
        router.push("/wallet")
      }, 2000)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Withdraw Funds</h1>
      
      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Withdrawal request submitted successfully. Redirecting to your wallet...
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-6 md:grid-cols-12">
        {/* Sidebar */}
        <div className="md:col-span-4 space-y-4">
          <BalanceCard 
            wallet={wallet} 
            getBalanceDisplay={getBalanceDisplay} 
            router={router}
            buttonAction="deposit"
          />
          
          <WithdrawalMethods />
          
          <WithdrawalHistoryCard 
            withdrawalHistory={withdrawalHistory}
            getCurrencySymbol={getCurrencySymbol}
          />
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-8">
          <WithdrawalForm
            wallet={wallet}
            currencies={CURRENCIES}
            getCurrencySymbol={getCurrencySymbol}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
