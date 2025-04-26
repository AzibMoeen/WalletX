"use client"

import { useState, useEffect } from "react"
import { Search, CheckCircle, XCircle, Filter, Eye, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
          <div className="flex items-center gap-4 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchRequests}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="passport" className="flex-1">Passport Verifications</TabsTrigger>
              <TabsTrigger value="gun" className="flex-1">Gun License Verifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="passport">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>CNIC</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPassportRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No passport verification requests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPassportRequests.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell className="font-medium">
                            <div>
                              <p>{request.user.fullname}</p>
                              <p className="text-xs text-muted-foreground">{request.user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{request.passwordCnic}</TableCell>
                          <TableCell>{formatDate(request.createdAt)}</TableCell>
                          <TableCell>
                            <StatusBadge status={request.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  setSelectedRequest({...request, type: 'passport'})
                                  setViewDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-green-600"
                                disabled={request.status === 'verified'}
                                onClick={() => updateVerificationStatus(request._id, 'passport', 'verified')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-red-600"
                                disabled={request.status === 'rejected'}
                                onClick={() => updateVerificationStatus(request._id, 'passport', 'rejected')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="gun">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>License Number</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="w-[100px]">Status</TableHead>
                      <TableHead className="w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGunRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No gun license verification requests found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredGunRequests.map((request) => (
                        <TableRow key={request._id}>
                          <TableCell className="font-medium">
                            <div>
                              <p>{request.user.fullname}</p>
                              <p className="text-xs text-muted-foreground">{request.user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{request.licenseNumber}</TableCell>
                          <TableCell>{formatDate(request.createdAt)}</TableCell>
                          <TableCell>
                            <StatusBadge status={request.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  setSelectedRequest({...request, type: 'gun'})
                                  setViewDialogOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-green-600"
                                disabled={request.status === 'verified'}
                                onClick={() => updateVerificationStatus(request._id, 'gun', 'verified')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-red-600"
                                disabled={request.status === 'rejected'}
                                onClick={() => updateVerificationStatus(request._id, 'gun', 'rejected')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {selectedRequest?.type === 'passport' ? 'Passport Verification Details' : 'Gun License Verification Details'}
            </DialogTitle>
            <DialogDescription>
              Review the details of this verification request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right text-sm font-medium col-span-1">User:</p>
                <div className="col-span-3">
                  <p className="text-sm">{selectedRequest.user.fullname}</p>
                  <p className="text-xs text-muted-foreground">{selectedRequest.user.email}</p>
                </div>
              </div>
              
              {selectedRequest.type === 'passport' ? (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <p className="text-right text-sm font-medium col-span-1">CNIC:</p>
                    <p className="text-sm col-span-3">{selectedRequest.passwordCnic}</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <p className="text-right text-sm font-medium col-span-1">Full Name:</p>
                    <p className="text-sm col-span-3">{selectedRequest.fullName}</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <p className="text-right text-sm font-medium col-span-1">Date of Birth:</p>
                    <p className="text-sm col-span-3">{new Date(selectedRequest.dob).toLocaleDateString()}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <p className="text-right text-sm font-medium col-span-1">License #:</p>
                    <p className="text-sm col-span-3">{selectedRequest.licenseNumber}</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <p className="text-right text-sm font-medium col-span-1">CNIC:</p>
                    <p className="text-sm col-span-3">{selectedRequest.cnic}</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <p className="text-right text-sm font-medium col-span-1">Issue Date:</p>
                    <p className="text-sm col-span-3">{new Date(selectedRequest.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <p className="text-right text-sm font-medium col-span-1">Expiry Date:</p>
                    <p className="text-sm col-span-3">{new Date(selectedRequest.expiryDate).toLocaleDateString()}</p>
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-right text-sm font-medium col-span-1">Status:</p>
                <div className="col-span-3">
                  <StatusBadge status={selectedRequest.status} />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <p className="text-right text-sm font-medium col-span-1">Document:</p>
                <div className="col-span-3">
                 <img 
                    src={selectedRequest.type === 'passport' ? selectedRequest.passportImage : selectedRequest.gunImage} 
                    alt={selectedRequest.type === 'passport' ? "Passport" : "Gun License"}
                    className="w-full rounded-md border h-40 object-cover"
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-green-600"
                disabled={selectedRequest?.status === 'verified'}
                onClick={() => {
                  updateVerificationStatus(
                    selectedRequest._id, 
                    selectedRequest.type, 
                    'verified'
                  )
                  setViewDialogOpen(false)
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600"
                disabled={selectedRequest?.status === 'rejected'}
                onClick={() => {
                  updateVerificationStatus(
                    selectedRequest._id, 
                    selectedRequest.type, 
                    'rejected'
                  )
                  setViewDialogOpen(false)
                }}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
            <DialogClose asChild>
              <Button variant="outline" size="sm">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatusBadge({ status }) {
  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
      default:
        return 'bg-amber-100 text-amber-800'
    }
  }

  return (
    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}