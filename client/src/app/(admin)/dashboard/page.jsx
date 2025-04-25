"use client";

import { useEffect } from "react";
import { ArrowUpRight, Check, DollarSign, Users, Clock, XCircle, CheckCircle, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Import Zustand store
import useAdminStore from "@/lib/store/useAdminStore";

export default function AdminDashboardPage() {
  // Use the admin store for dashboard state
  const { 
    dashboardStats, 
    recentActivity, 
    isLoading, 
    fetchDashboardStats, 
    updatePassportVerificationStatus,
    updateGunVerificationStatus
  } = useAdminStore();

  // Fetch dashboard data when component mounts
  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Helper to format dates
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle verification approval
  const handleApprove = async (id, type) => {
    try {
      if (type === 'passport') {
        await updatePassportVerificationStatus(id, 'verified');
      } else {
        await updateGunVerificationStatus(id, 'verified');
      }
      // Refresh dashboard data
      fetchDashboardStats();
    } catch (error) {
      console.error("Error approving verification:", error);
    }
  };

  // Handle verification rejection
  const handleReject = async (id, type) => {
    try {
      if (type === 'passport') {
        await updatePassportVerificationStatus(id, 'rejected');
      } else {
        await updateGunVerificationStatus(id, 'rejected');
      }
      // Refresh dashboard data
      fetchDashboardStats();
    } catch (error) {
      console.error("Error rejecting verification:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button
          onClick={() => fetchDashboardStats()}
          variant="outline"
          className="h-9"
        >
          Refresh
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-3xl">{dashboardStats.totalUsers}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xs text-muted-foreground">
              +{dashboardStats.newUsers} in the last 30 days
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="pl-0 h-8" asChild>
              <a href="/admin/users">
                <span>View all</span>
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Verified Users</CardDescription>
            <CardTitle className="text-3xl">{dashboardStats.verifiedUsers}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <Progress value={(dashboardStats.verifiedUsers / dashboardStats.totalUsers) * 100} className="h-2" />
              <span className="text-xs text-muted-foreground">
                {Math.round((dashboardStats.verifiedUsers / dashboardStats.totalUsers) * 100) || 0}%
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground flex items-center">
              <Check className="mr-1 h-3 w-3 text-green-500" />
              <span>Fully verified</span>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Verifications</CardDescription>
            <CardTitle className="text-3xl">{dashboardStats.pendingVerifications}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xs text-muted-foreground">
              Passport and gun license verification requests
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="pl-0 h-8" asChild>
              <a href="/admin/verification-requests">
                <span>Review now</span>
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>New Users (30 days)</CardDescription>
            <CardTitle className="text-3xl">{dashboardStats.newUsers}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <Progress value={(dashboardStats.newUsers / dashboardStats.totalUsers) * 100} className="h-2" />
              <span className="text-xs text-muted-foreground">
                {Math.round((dashboardStats.newUsers / dashboardStats.totalUsers) * 100) || 0}%
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground flex items-center">
              <Users className="mr-1 h-3 w-3" />
              <span>Of total users</span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Verification Requests</CardTitle>
            <CardDescription>
              Latest passport and gun license verification submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent verification requests
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{activity.user.fullname}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                            {activity.type === 'passport' ? 'Passport' : 'Gun License'}
                          </span>
                          {activity.status === 'pending' ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              Pending
                            </span>
                          ) : activity.status === 'verified' ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                              Verified
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                              Rejected
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {activity.user.email}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(activity.createdAt)}
                      </div>
                    </div>
                    
                    {activity.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                          onClick={() => handleApprove(activity.id, activity.type)}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          onClick={() => handleReject(activity.id, activity.type)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href="/admin/verification-requests">View All Verification Requests</a>
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>
              Manage service verification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="information">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="information">Information</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="information" className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span className="font-medium">Passport Verification</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">
                    Verify user identity via passport information
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      <span className="font-medium">Gun License Verification</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">
                    Verify user identity via gun license verification
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-amber-500" />
                      <span className="font-medium">Address Verification</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      In Development
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">
                    Verify user address via utility bills or other documents
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Verification Processing Time</label>
                  <select className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm">
                    <option>1-3 business days (Default)</option>
                    <option>24 hours (Express)</option>
                    <option>3-5 business days</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Set the expected processing time for verification requests
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-Rejection Criteria</label>
                  <select className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm">
                    <option>Expired documents</option>
                    <option>Blurry images</option>
                    <option>Incomplete information</option>
                    <option>All of the above</option>
                  </select>
                  <p className="text-xs text-muted-foreground">
                    Set automatic rejection criteria for verification requests
                  </p>
                </div>
                
                <Button className="w-full">Save Settings</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}