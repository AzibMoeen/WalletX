"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, Check, ArrowRight } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../../../../components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import useWalletStore from "../../../../lib/store/useWalletStore"
import { Textarea } from "../../../../components/ui/textarea"

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
     
      console.log("Current userId from localStorage:", userId);
      console.log("All requests:", requests);
      
      // Filter requests properly - handle string comparison correctly
      const received = requests.filter(req => 
        req.recipient && 
        (req.recipient._id === userId || req.recipient._id.toString() === userId)
      );
      
      const sent = requests.filter(req => 
        req.user && 
        (req.user._id === userId || req.user._id.toString() === userId)
      );
      
      console.log("Filtered received requests:", received);
      console.log("Filtered sent requests:", sent);
      
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
          <Card>
            <CardHeader>
              <CardTitle>Request Money</CardTitle>
              <CardDescription>
                Request money from another user by entering their email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-6 bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-600">Success</AlertTitle>
                  <AlertDescription className="text-green-600">
                    Money request sent successfully!
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="targetEmail">Recipient Email</Label>
                  <Input
                    id="targetEmail"
                    name="targetEmail"
                    placeholder="Enter recipient's email"
                    value={formData.targetEmail}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {getCurrencySymbol(formData.currency)}
                      </span>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleChange}
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => handleSelectChange("currency", value)}
                    >
                      <SelectTrigger id="currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="PKR">PKR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Description (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="What is this request for?"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending Request..." : "Request Money"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="received-requests">
          <Card>
            <CardHeader>
              <CardTitle>Money Requests Received</CardTitle>
              <CardDescription>
                Manage money requests you've received from other users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {receivedRequests.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
                  No money requests received
                </p>
              ) : (
                <div className="space-y-4">
                  {receivedRequests.map((request) => (
                    <Card key={request._id} className={`border ${request.status === 'pending' ? 'border-blue-200' : 'border-green-200'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">
                              Request from: {request.user?.fullname || request.user?.email}
                            </h3>
                            <p className="text-sm text-gray-500">{formatDate(request.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {getCurrencySymbol(request.currencyFrom)} {request.amount.toFixed(2)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              request.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        {request.notes && (
                          <p className="text-sm mb-4 bg-gray-50 p-3 rounded">
                            "{request.notes}"
                          </p>
                        )}
                        
                        {request.status === 'pending' && (
                          <div className="flex justify-end mt-2">
                            <Button 
                              onClick={() => handlePayRequest(request._id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Pay Now
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sent-requests">
          <Card>
            <CardHeader>
              <CardTitle>Money Requests Sent</CardTitle>
              <CardDescription>
                Track the status of money requests you've sent to others
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sentRequests.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
                  No money requests sent
                </p>
              ) : (
                <div className="space-y-4">
                  {sentRequests.map((request) => (
                    <Card key={request._id} className={`border ${request.status === 'pending' ? 'border-amber-200' : 'border-green-200'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">
                              Requested from: {request.recipient?.fullname || request.recipient?.email}
                            </h3>
                            <p className="text-sm text-gray-500">{formatDate(request.createdAt)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {getCurrencySymbol(request.currencyFrom)} {request.amount.toFixed(2)}
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              request.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        {request.notes && (
                          <p className="text-sm mb-2 bg-gray-50 p-3 rounded">
                            "{request.notes}"
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-2">
                          Reference: {request.reference}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}