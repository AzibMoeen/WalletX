"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BalanceCard from "../withdraw/components/BalanceCard"// Fixed import
import RecentDepositsCard from "./components/RecentDepositsCard"
import DepositMethodsCard from "./components/DepositMethodsCard"
import DepositOptionsSelector from "./components/DepositOptionsSelector"
import CardDepositForm from "./components/CardDepositForm"
import BankDepositForm from "./components/BankDepositForm"

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" }
]

export default function DepositPage() {
  const router = useRouter()
  const [depositMethod, setDepositMethod] = useState("card")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [wallet, setWallet] = useState({ balances: [] })
  const [recentDeposits, setRecentDeposits] = useState([])
  
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    transferReference: ""
  })

  useEffect(() => {
    fetchWalletBalance()
    fetchRecentDeposits()
  }, [])

  const fetchWalletBalance = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("http://localhost:8000/api/transactions/balance", {
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
  
  const fetchRecentDeposits = async () => {
    try {
      // This would be replaced with a real API call
      // Simulating recent deposits for demo purposes
      setRecentDeposits([
        { method: "Card Deposit", amount: 100, currency: "USD", date: "Apr 23, 2025" },
        { method: "Bank Transfer", amount: 250, currency: "EUR", date: "Apr 20, 2025" },
        { method: "Card Deposit", amount: 50, currency: "USD", date: "Apr 15, 2025" }
      ])
    } catch (error) {
      console.error("Error fetching recent deposits:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMethodChange = (value) => {
    setDepositMethod(value)
    // Reset form errors when changing methods
    setError("")
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)
    
    try {
      // Validate form
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error("Please enter a valid amount")
      }
      
      // Validate card details if card deposit method selected
      if (depositMethod === "card") {
        if (
          !formData.cardholderName || 
          !formData.cardNumber || 
          !formData.expiryDate || 
          !formData.cvv
        ) {
          throw new Error("Please fill in all card details")
        }
      }
      
      // Validate bank details if bank deposit method selected
      if (depositMethod === "bank") {
        if (!formData.transferReference) {
          throw new Error("Please enter the transfer reference")
        }
      }
      
      const token = localStorage.getItem("accessToken")
      const response = await fetch("http://localhost:8000/api/transactions/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          method: depositMethod,
          cardDetails: depositMethod === "card" ? {
            cardNumber: formData.cardNumber,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv,
            cardholderName: formData.cardholderName
          } : undefined,
          bankDetails: depositMethod === "bank" ? {
            transferReference: formData.transferReference
          } : undefined
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to process deposit")
      }
      
      // Update wallet balance and recent deposits
      await fetchWalletBalance()
      await fetchRecentDeposits()
      
      setSuccess(true)
      // Reset form
      setFormData({
        amount: "",
        currency: "USD",
        cardholderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        transferReference: ""
      })
      
      // Redirect to wallet page after 2 seconds
      setTimeout(() => {
        router.push("/wallet/wallet")
      }, 2000)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
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

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 max-w-4xl">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">Add Funds to Wallet</h1>
      
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-12">
        {/* Sidebar */}
        <div className="md:col-span-4 space-y-4">
          <BalanceCard 
            wallet={wallet} 
            getBalanceDisplay={getBalanceDisplay} 
            router={router}
            buttonAction="withdraw"
          />
          
          <DepositMethodsCard />
          
          <RecentDepositsCard 
            recentDeposits={recentDeposits} 
            getCurrencySymbol={getCurrencySymbol} 
          />
        </div>
        
        {/* Deposit Form */}
        <div className="md:col-span-8">
          <Card>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg md:text-xl">Deposit Funds</CardTitle>
              <CardDescription>Add money to your wallet from various sources</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
              <DepositOptionsSelector 
                selectedMethod={depositMethod} 
                handleMethodChange={handleMethodChange} 
              />
              
              {depositMethod === "card" ? (
                <CardDepositForm
                  formData={formData}
                  handleChange={handleChange}
                  handleSelectChange={handleSelectChange}
                  handleSubmit={handleSubmit}
                  getCurrencySymbol={getCurrencySymbol}
                  isLoading={isLoading}
                  success={success}
                  error={error}
                />
              ) : (
                <BankDepositForm
                  formData={formData}
                  handleChange={handleChange}
                  handleSelectChange={handleSelectChange}
                  handleSubmit={handleSubmit}
                  getCurrencySymbol={getCurrencySymbol}
                  isLoading={isLoading}
                  success={success}
                  error={error}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
