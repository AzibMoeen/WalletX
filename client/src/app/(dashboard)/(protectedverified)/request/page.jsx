"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewRequestForm from "./components/NewRequestForm"
import ReceivedRequestsCard from "./components/ReceivedRequestsCard"
import SentRequestsCard from "./components/SentRequestsCard"
import axios from "axios"
import useAuthStore from "@/lib/store/useAuthStore"

export default function RequestPage() {
  const router = useRouter()
  const { isAuthenticated, user, accessToken, fetchUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [requests, setRequests] = useState([])
  
  const [formData, setFormData] = useState({
    targetEmail: "",
    amount: "",
    currency: "USD",
    notes: ""
  })
  
  const [success, setSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("new-request")
  const [receivedRequests, setReceivedRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
  
  // Ensure user is authenticated first
  useEffect(() => {
    if (!isAuthenticated || !user) {
      fetchUser()
    }
  }, [isAuthenticated, user, fetchUser])
  
  // Fetch all money requests
  const fetchMoneyRequests = async () => {
    try {
      setIsLoading(true)
      
      // Use the token from auth store
      const token = accessToken
      
      const response = await axios.get(`${API_URL}/transactions/requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (response.data && response.data.requests) {
        setRequests(response.data.requests)
      }
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch money requests")
      console.error("Error fetching money requests:", err)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Request money function
  const requestMoney = async (requestData) => {
    try {
      setIsLoading(true)
      // Use the token from auth store
      const token = accessToken
      
      const response = await axios.post(`${API_URL}/transactions/request`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      
      setSuccess(true)
      // Refresh the requests list
      fetchMoneyRequests()
      setError(null)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send money request")
      console.error("Error requesting money:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }
  
  // Pay money request function
  const payMoneyRequest = async (requestId) => {
    try {
      setIsLoading(true)
      // Use the token from auth store
      const token = accessToken
      
      console.log("Paying request ID:", requestId); 
      const payload = { requestId };
      console.log("Request payload:", payload);
      
      const response = await axios({
        method: 'post',
        url: `${API_URL}/transactions/pay-request`,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      // Refresh the requests list
      fetchMoneyRequests()
      setError(null)
      return response.data
    } catch (err) {
      console.error("Error paying money request:", err)
      const errorMessage = err.response?.data?.message || "Failed to pay money request"
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }
  
  // Clear error state
  const clearError = () => {
    setError(null)
  }
  
  // Fetch requests when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMoneyRequests()
    }
  }, [isAuthenticated, user])
  
  // Update requests list when requests state changes
  useEffect(() => {
    if (requests && requests.length > 0 && user) {
      const userId = user._id
      
      // Filter requests properly - handle string comparison correctly
      const received = requests.filter(req => 
        req.recipient && 
        (req.recipient._id === userId || String(req.recipient._id) === userId)
      )
      
      const sent = requests.filter(req => 
        req.user && 
        (req.user._id === userId || String(req.user._id) === userId)
      )
      
      setReceivedRequests(received)
      setSentRequests(sent)
    } else {
      // Reset arrays when no requests are available
      setReceivedRequests([])
      setSentRequests([])
    }
  }, [requests, user])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    setSuccess(false)
    
    try {
      // Validate form
      if (!formData.targetEmail) {
        throw new Error("Please enter the recipient's email")
      }
      
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error("Please enter a valid amount")
      }
      
      // Make request
      await requestMoney({
        targetEmail: formData.targetEmail,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        notes: formData.notes
      })
      
      setSuccess(true)
      
      // Reset form
      setFormData({
        targetEmail: "",
        amount: "",
        currency: "USD",
        notes: ""
      })
      
      // Switch to sent requests tab after successful request
      setTimeout(() => {
        setActiveTab("sent-requests")
      }, 1500)
      
    } catch (err) {
      setError(err.message || "An error occurred while sending the request")
      console.error(err)
    }
  }
  
  // Helper to format currency
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "USD": return "$"
      case "EUR": return "€"
      case "PKR": return "₨"
      default: return "$"
    }
  }
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  // Handle paying a money request
  const handlePayRequest = async (requestId) => {
    try {
      await payMoneyRequest(requestId)
      // After successful payment, fetch updated requests
      fetchMoneyRequests()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Money Requests</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="new-request">New Request</TabsTrigger>
          <TabsTrigger value="received-requests">Requests Received</TabsTrigger>
          <TabsTrigger value="sent-requests">Requests Sent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-request">
          <NewRequestForm
            formData={formData}
            handleChange={handleChange}
            handleSelectChange={handleSelectChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            success={success}
            getCurrencySymbol={getCurrencySymbol}
          />
        </TabsContent>
        
        <TabsContent value="received-requests">
          <ReceivedRequestsCard
            receivedRequests={receivedRequests}
            formatDate={formatDate}
            getCurrencySymbol={getCurrencySymbol}
            handlePayRequest={handlePayRequest}
          />
        </TabsContent>
        
        <TabsContent value="sent-requests">
          <SentRequestsCard
            sentRequests={sentRequests}
            formatDate={formatDate}
            getCurrencySymbol={getCurrencySymbol}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}