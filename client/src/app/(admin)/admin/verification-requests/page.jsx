"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog } from "@/components/ui/dialog"
import useAdminStore from "@/lib/store/useAdminStore"

import { SearchHeader } from "./components/SearchHeader"
import { RequestsTable } from "./components/RequestsTable"
import { RequestDetailDialog } from "./components/RequestDetailDialog"

export default function VerificationRequestsPage() {
  const [activeTab, setActiveTab] = useState("passport")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // Use the admin store for verification requests data and operations
  const { 
    passportVerifications, 
    gunVerifications, 
    isLoading,
    fetchPassportVerifications,
    fetchGunVerifications,
    updatePassportVerificationStatus,
    updateGunVerificationStatus
  } = useAdminStore();

  useEffect(() => {
    fetchVerificationRequests();
  }, []);

  const fetchVerificationRequests = async () => {
    try {
      // Fetch both types of verification requests
      await Promise.all([
        fetchPassportVerifications(),
        fetchGunVerifications()
      ]);
    } catch (error) {
      console.error("Error fetching verification requests:", error);
    }
  };

  const updateVerificationStatus = async (id, type, status) => {
    if (type === 'passport') {
      await updatePassportVerificationStatus(id, status);
    } else {
      await updateGunVerificationStatus(id, status);
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
        (req.user?.fullname?.toLowerCase() || "").includes(searchLower) ||
        (req.user?.email?.toLowerCase() || "").includes(searchLower)
      )
    })
  }

  const filteredPassportRequests = getFilteredRequests(passportVerifications)
  const filteredGunRequests = getFilteredRequests(gunVerifications)

  return (
    <div className="flex flex-col gap-6 px-2 sm:px-4 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Verification Requests</h1>
      </div>
      
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Manage Verification Requests</CardTitle>
          <CardDescription>
            Review and process identity verification requests from users.
          </CardDescription>
          <SearchHeader 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            fetchRequests={fetchVerificationRequests}
          />
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full max-w-[400px] mx-auto">
              <TabsTrigger value="passport" className="px-2 sm:px-4">Passport</TabsTrigger>
              <TabsTrigger value="gun" className="px-2 sm:px-4">Gun License</TabsTrigger>
            </TabsList>
            
            <TabsContent value="passport">
              <RequestsTable 
                requests={filteredPassportRequests}
                loading={isLoading}
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
                loading={isLoading}
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