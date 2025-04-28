"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog } from "@/components/ui/dialog"

import { SearchHeader } from "./components/SearchHeader"
import { RequestsTable } from "./components/RequestsTable"
import { RequestDetailDialog } from "./components/RequestDetailDialog"

export default function VerificationRequestsPage() {
  const [activeTab, setActiveTab] = useState("passport")
  const [passportRequests, setPassportRequests] = useState([])
  const [gunRequests, setGunRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      
      // Fetch passport verification requests
      const passportResponse = await fetch("http://localhost:8000/api/admin/verifications/passport", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Fetch gun verification requests
      const gunResponse = await fetch("http://localhost:8000/api/admin/verifications/gun", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!passportResponse.ok || !gunResponse.ok) {
        throw new Error("Failed to fetch verification requests");
      }
      
      const passportData = await passportResponse.json();
      const gunData = await gunResponse.json();
      
      setPassportRequests(passportData.verifications);
      setGunRequests(gunData.verifications);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching verification requests:", error);
      setLoading(false);
    }
  };

  const updateVerificationStatus = async (id, type, status) => {
    try {
      const token = localStorage.getItem("accessToken");
      
      const response = await fetch(`http://localhost:8000/api/admin/verifications/${type}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update verification status");
      }
      
      // Update local state after successful API call
      if (type === 'passport') {
        setPassportRequests(passportRequests.map(req => 
          req._id === id ? { ...req, status } : req
        ));
      } else {
        setGunRequests(gunRequests.map(req => 
          req._id === id ? { ...req, status } : req
        ));
      }
    } catch (error) {
      console.error(`Error updating ${type} verification status:`, error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const getFilteredRequests = (requests) => {
    return requests.filter(req => {
      // Apply status filter
      if (statusFilter !== "all" && req.status !== statusFilter) {
        return false
      }
      
      // Apply search filter to user fullname or email
      const searchLower = searchQuery.toLowerCase()
      return (
        req.user.fullname.toLowerCase().includes(searchLower) ||
        req.user.email.toLowerCase().includes(searchLower)
      )
    })
  }

  const filteredPassportRequests = getFilteredRequests(passportRequests)
  const filteredGunRequests = getFilteredRequests(gunRequests)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Verification Requests</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Manage Verification Requests</CardTitle>
          <CardDescription>
            Review and process identity verification requests from users.
          </CardDescription>
          <SearchHeader 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            fetchRequests={fetchRequests}
          />
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="passport" className="flex-1">Passport Verifications</TabsTrigger>
              <TabsTrigger value="gun" className="flex-1">Gun License Verifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="passport">
              <RequestsTable 
                requests={filteredPassportRequests}
                loading={loading}
                type="passport"
                formatDate={formatDate}
                updateVerificationStatus={updateVerificationStatus}
                setSelectedRequest={setSelectedRequest}
                setViewDialogOpen={setViewDialogOpen}
              />
            </TabsContent>
            
            <TabsContent value="gun">
              <RequestsTable 
                requests={filteredGunRequests}
                loading={loading}
                type="gun"
                formatDate={formatDate}
                updateVerificationStatus={updateVerificationStatus}
                setSelectedRequest={setSelectedRequest}
                setViewDialogOpen={setViewDialogOpen}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <RequestDetailDialog
          selectedRequest={selectedRequest}
          updateVerificationStatus={updateVerificationStatus}
          setViewDialogOpen={setViewDialogOpen}
        />
      </Dialog>
    </div>
  )
}