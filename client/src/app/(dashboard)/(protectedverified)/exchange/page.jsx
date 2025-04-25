"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, AlertCircle } from "lucide-react"
import BalanceCard from "../withdraw/components/BalanceCard"
import ExchangeForm from "./components/ExchangeForm"
import ExchangeRatesCard from "./components/ExchangeRatesCard"
import ExchangeHistoryCard from "./components/ExchangeHistoryCard"

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" }
]

// Demo exchange rates
const EXCHANGE_RATES = {
  USD: { EUR: 0.91, PKR: 278.5 },
  EUR: { USD: 1.10, PKR: 306.3 },
  PKR: { USD: 0.0036, EUR: 0.0033 }
}

export default function ExchangePage() {
  const router = useRouter()
  const [wallet, setWallet] = useState({ balances: [] })
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [conversionRate, setConversionRate] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [exchangeHistory, setExchangeHistory] = useState([])
  const [exchangeRates, setExchangeRates] = useState([])
  const [lastUpdated, setLastUpdated] = useState("")

  useEffect(() => {
    fetchWalletBalance()
    fetchExchangeHistory()
    generateExchangeRates()
    
    // Set the current time as last updated
    setLastUpdated(new Date().toLocaleTimeString())
  }, [])

  useEffect(() => {
    // Update conversion rate when currencies change
    if (fromCurrency && toCurrency) {
      const rate = EXCHANGE_RATES[fromCurrency]?.[toCurrency] || 0
      setConversionRate(rate)
      
      // Update toAmount based on fromAmount and new rate
      if (fromAmount) {
        setToAmount((parseFloat(fromAmount) * rate).toFixed(2))
      }
    }
  }, [fromCurrency, toCurrency, fromAmount])

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
  
  const fetchExchangeHistory = () => {
    // This would be replaced with a real API call
    // Simulating exchange history for demo purposes
    setExchangeHistory([
      { 
        fromCurrency: "USD", 
        toCurrency: "EUR", 
        fromAmount: 100, 
        toAmount: 91, 
        date: "Apr 23, 2025"
      },
      { 
        fromCurrency: "EUR", 
        toCurrency: "PKR", 
        fromAmount: 50, 
        toAmount: 15315, 
        date: "Apr 20, 2025"
      },
      { 
        fromCurrency: "PKR", 
        toCurrency: "USD", 
        fromAmount: 5000, 
        toAmount: 18, 
        date: "Apr 15, 2025"
      }
    ])
  }
  
  const generateExchangeRates = () => {
    const rates = []
    Object.keys(EXCHANGE_RATES).forEach(from => {
      Object.keys(EXCHANGE_RATES[from]).forEach(to => {
        rates.push({
          from,
          to,
          rate: EXCHANGE_RATES[from][to]
        })
      })
    })
    setExchangeRates(rates)
  }

  const handleFromCurrencyChange = (value) => {
    setFromCurrency(value)
  }

  const handleToCurrencyChange = (value) => {
    setToCurrency(value)
  }

  const handleFromAmountChange = (e) => {
    const value = e.target.value
    setFromAmount(value)
    if (value && conversionRate) {
      setToAmount((parseFloat(value) * conversionRate).toFixed(2))
    } else {
      setToAmount("")
    }
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    // The useEffect will handle updating the conversion rate and amounts
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)
    
    try {
      // Validate form
      if (!fromAmount || parseFloat(fromAmount) <= 0) {
        throw new Error("Please enter a valid amount to exchange")
      }
      
      // Check if user has sufficient balance
      const fromBalance = wallet.balances?.find(b => b.currency === fromCurrency)?.amount || 0
      if (parseFloat(fromAmount) > fromBalance) {
        throw new Error(`Insufficient ${fromCurrency} balance`)
      }
      
      const token = localStorage.getItem("accessToken")
      const response = await fetch("http://localhost:8000/api/transactions/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fromCurrency,
          toCurrency,
          amount: parseFloat(fromAmount)
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to exchange currencies")
      }
      
      // Update wallet balance
      await fetchWalletBalance()
      
      setSuccess(true)
      
      // Add the exchange to history
      setExchangeHistory(prev => [{
        fromCurrency,
        toCurrency,
        fromAmount: parseFloat(fromAmount),
        toAmount: parseFloat(toAmount),
        date: new Date().toLocaleDateString()
      }, ...prev])
      
      // Reset form
      setFromAmount("")
      setToAmount("")
      
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
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Currency Exchange</h1>
      
      {success && (
        <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Currency exchanged successfully. Redirecting to your wallet...
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
          
          <ExchangeRatesCard 
            exchangeRates={exchangeRates}
            getCurrencySymbol={getCurrencySymbol}
            lastUpdated={lastUpdated}
          />
          
          <ExchangeHistoryCard 
            exchangeHistory={exchangeHistory}
            getCurrencySymbol={getCurrencySymbol}
          />
        </div>
        
        {/* Exchange Form */}
        <div className="md:col-span-8">
          <ExchangeForm
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            fromAmount={fromAmount}
            toAmount={toAmount}
            handleFromCurrencyChange={handleFromCurrencyChange}
            handleToCurrencyChange={handleToCurrencyChange}
            handleFromAmountChange={handleFromAmountChange}
            handleSwapCurrencies={handleSwapCurrencies}
            handleSubmit={handleSubmit}
            conversionRate={conversionRate}
            getCurrencySymbol={getCurrencySymbol}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
