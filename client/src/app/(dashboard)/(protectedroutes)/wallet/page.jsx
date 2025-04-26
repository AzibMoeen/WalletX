"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BalanceCard from "./components/BalanceCard"
import RecentRecipients from "./components/RecentRecipients"
import SendMoneyForm from "./components/SendMoneyForm"
import ReceiveMoneyCard from "./components/ReceiveMoneyCard"

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" }
]

export default function WalletPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [wallet, setWallet] = useState({ balances: [], walletId: "" })
  const [user, setUser] = useState({ email: "" })
  const [users, setUsers] = useState([])
  const [isUsersFetched, setIsUsersFetched] = useState(false)
  
  const [formData, setFormData] = useState({
    recipientId: "",
    recipientEmail: "",
    amount: "",
    currency: "USD",
    note: ""
  })
  const [verificationStatus, setVerificationStatus] = useState({
    isVerified: false,
    pendingRequests: [],
    loading: true
  })

  useEffect(() => {
    fetchWalletBalance()
    fetchUserData()
    fetchVerificationStatus()
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
  
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("http://localhost:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }
      
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      
      // First check if user is verified
      const userResponse = await fetch("http://localhost:8000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data")
      }
      
      const userData = await userResponse.json()
      console.log(userData)
      
      // If user is already verified, no need to fetch verification requests
      if (userData.user && userData.user.verified === true) {
        setVerificationStatus({
          isVerified: true,
          pendingRequests: [],
          loading: false
        })
        return
      }
      
      // Fetch both passport and gun license verification requests
      const [passportRes, gunRes] = await Promise.all([
        fetch("http://localhost:8000/api/verification/passport/me", {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ ok: false })),
        
        fetch("http://localhost:8000/api/verification/gun/me", {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ ok: false }))
      ])
      
      const pendingRequests = []
      
      if (passportRes.ok) {
        const passportData = await passportRes.json()
        if (passportData && passportData.verifications) {
          pendingRequests.push(...passportData.verifications.map(v => ({...v, type: 'passport'})))
        }
      }
      
      if (gunRes.ok) {
        const gunData = await gunRes.json()
        if (gunData && gunData.verifications) {
          pendingRequests.push(...gunData.verifications.map(v => ({...v, type: 'gun'})))
        }
      }
      
      setVerificationStatus({
        isVerified: false,
        pendingRequests,
        loading: false
      })
    } catch (error) {
      console.error("Error fetching verification status:", error)
      setVerificationStatus(prev => ({...prev, loading: false}))
    }
  }

  // Fetch all users for transfer
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("http://localhost:8000/api/transactions/users/transfer", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      
      const data = await response.json()
      setUsers(data.users)
      setIsUsersFetched(true)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)
    
    try {
      // Validate form
      if (!formData.recipientId) {
        throw new Error("Please enter a recipient wallet ID")
      }
      
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error("Please enter a valid amount")
      }
      
      // Check if user has sufficient balance
      const balance = wallet.balances?.find(b => b.currency === formData.currency)?.amount || 0
      if (parseFloat(formData.amount) > balance) {
        throw new Error("Insufficient funds")
      }
      
      const token = localStorage.getItem("accessToken")
      const response = await fetch("http://localhost:8000/api/transactions/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: formData.recipientId,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          notes: formData.note || "Transfer"
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send money")
      }
      
      // Update wallet balance
      await fetchWalletBalance()
      
      setSuccess(true)
      // Reset form
      setFormData({
        recipientId: "",
        recipientEmail: "",
        amount: "",
        currency: "USD",
        note: ""
      })
      
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
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">Send & Receive Money</h1>
      
      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
          <TabsTrigger value="send">Send Money</TabsTrigger>
          <TabsTrigger value="receive">Receive Money</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send">
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 space-y-4">
              <BalanceCard 
                wallet={wallet} 
                getBalanceDisplay={getBalanceDisplay} 
                router={router} 
                buttonAction="deposit"
              />
              
              <RecentRecipients />
            </div>
            
            {/* Send Money Form */}
            <div className="md:col-span-8">
              <SendMoneyForm 
                formData={formData}
                handleChange={handleChange}
                handleSelectChange={handleSelectChange}
                handleSubmit={handleSubmit}
                getCurrencySymbol={getCurrencySymbol}
                isLoading={isLoading}
                success={success}
                error={error}
                users={users}
                isUsersFetched={isUsersFetched}
                fetchUsers={fetchUsers}
                user={user}
                verificationStatus={verificationStatus}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="receive">
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-12">
            {/* Balance Cards */}
            <div className="md:col-span-4 space-y-4">
              <BalanceCard 
                wallet={wallet} 
                getBalanceDisplay={getBalanceDisplay} 
                router={router} 
                buttonAction="transactions"
              />
            </div>
            
            {/* Receive Money */}
            <div className="md:col-span-8">
              <ReceiveMoneyCard wallet={wallet} user={user} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
