import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useWalletStore from '@/lib/store/useWalletStore'
import { getApiUrl } from '@/lib/config'

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" }
]

export const useWallet = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [wallet, setWallet] = useState({ balances: [], walletId: "" })
  const [user, setUser] = useState({ email: "" })
  const [users, setUsers] = useState([])
  const [isUsersFetched, setIsUsersFetched] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState({
    isVerified: false,
    pendingRequests: [],
    loading: true
  })

  const { 
    balance, 
    transferFunds, 
    fetchBalance: fetchStoreBalance,
    clearError: clearStoreError
  } = useWalletStore()

  const [formData, setFormData] = useState({
    recipientId: "",
    recipientEmail: "",
    amount: "",
    currency: "USD",
    note: ""
  })

  // Fetch wallet balance
  const fetchWalletBalance = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("accessToken")
      const response = await fetch(getApiUrl("api/transactions/balance"), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch wallet balance")
      }
      
      const data = await response.json()
      setWallet(data.wallet)
      setIsLoading(false)
      return data.wallet
    } catch (error) {
      console.error("Error fetching wallet balance:", error)
      setError(error.message)
      setIsLoading(false)
    }
  }, [])

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(getApiUrl("api/auth/profile"), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }
      
      const data = await response.json()
      setUser(data.user)
      return data.user
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError(error.message)
    }
  }, [])

  // Fetch verification status
  const fetchVerificationStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken")
      
      // First check if user is verified
      const userResponse = await fetch(getApiUrl("api/auth/profile"), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data")
      }
      
      const userData = await userResponse.json()
      
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
        fetch(getApiUrl("api/verification/passport/me"), {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ ok: false })),
        
        fetch(getApiUrl("api/verification/gun/me"), {
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
  }, [])

  // Fetch all users for transfer
  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(getApiUrl("api/transactions/users/transfer"), {
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
      return data.users
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error.message)
    }
  }, [])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSelectChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)
    
    try {
      // Validate form
      if (!formData.recipientId && !formData.recipientEmail) {
        throw new Error("Please select a recipient")
      }
      
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error("Please enter a valid amount")
      }
      
      // Check if user has sufficient balance
      const balance = wallet.balances?.find(b => b.currency === formData.currency)?.amount || 0
      if (parseFloat(formData.amount) > balance) {
        throw new Error("Insufficient funds")
      }
      
      // Use the Zustand store to transfer funds
      await transferFunds({
        recipientId: formData.recipientId,
        recipientEmail: formData.recipientEmail,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        notes: formData.note || "Transfer"
      })
      
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
  }, [formData, wallet, transferFunds, fetchWalletBalance, router])

  const getBalanceDisplay = useCallback((currency) => {
    const balance = wallet.balances?.find(b => b.currency === currency)
    const currencyObj = CURRENCIES.find(c => c.value === currency)
    if (balance && currencyObj) {
      return `${currencyObj.symbol}${balance.amount.toFixed(2)}`
    }
    return `${currency} 0.00`
  }, [wallet])

  // Get currency symbol
  const getCurrencySymbol = useCallback((currency) => {
    return CURRENCIES.find(c => c.value === currency)?.symbol || ""
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchWalletBalance()
    fetchUserData()
    fetchVerificationStatus()
  }, [fetchWalletBalance, fetchUserData, fetchVerificationStatus])

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      setError("")
      clearStoreError()
    }
  }, [clearStoreError])

  return {
    wallet,
    user,
    users,
    formData,
    isLoading,
    success,
    error,
    verificationStatus,
    isUsersFetched,
    handleChange,
    handleSelectChange,
    handleSubmit,
    fetchWalletBalance,
    fetchUsers,
    getBalanceDisplay,
    getCurrencySymbol,
    CURRENCIES
  }
}

export default useWallet