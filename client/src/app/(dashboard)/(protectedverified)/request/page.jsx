"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useWalletStore from "@/lib/store/useWalletStore"
import NewRequestForm from "./components/NewRequestForm"
import ReceivedRequestsCard from "./components/ReceivedRequestsCard"
import SentRequestsCard from "./components/SentRequestsCard"

export default function RequestPage() {
  const router = useRouter()
  const { requestMoney, fetchMoneyRequests, requests, isLoading, error, clearError } = useWalletStore()
  
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
  
  useEffect(() => {
    fetchMoneyRequests()
  }, [fetchMoneyRequests])
  
  // Update requests list when requests state changes
  useEffect(() => {
    if (requests && requests.length > 0) {
      // Get user ID from localStorage
      const user = localStorage.getItem("user")
      const userId = user ? JSON.parse(user)._id : localStorage.getItem("userId")
     
      // Filter requests properly - handle string comparison correctly
      const received = requests.filter(req => 
        req.recipient && 
        (req.recipient._id === userId || req.recipient._id.toString() === userId)
      );
      
      const sent = requests.filter(req => 
        req.user && 
        (req.user._id === userId || req.user._id.toString() === userId)
      );
      
      setReceivedRequests(received);
      setSentRequests(sent);
    } else {
      // Reset arrays when no requests are available
      setReceivedRequests([]);
      setSentRequests([]);
    }
  }, [requests])
  
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
      // Error will be handled by the store
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
      await useWalletStore.getState().payMoneyRequest(requestId)
      // Money requests will be refreshed automatically via the store
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