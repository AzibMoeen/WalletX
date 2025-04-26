"use client"

import { CreditCard, Users, FileCheck, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    totalTransactions: 0,
    activeUsers: 0
  })

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:8000/api/admin/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setStats({
        totalUsers: data.stats.totalUsers,
        pendingVerifications: data.stats.pendingVerifications,
        totalTransactions: data.stats.totalTransactions || 0, // In case your backend doesn't provide this yet
        activeUsers: data.stats.verifiedUsers
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // If API fails, use placeholder data
      setStats({
        totalUsers: 0,
        pendingVerifications: 0,
        totalTransactions: 0,
        activeUsers: 0
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+7% from last week</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Overview of system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">John Doe created a new account</p>
                </div>
                <div className="text-xs text-muted-foreground">2h ago</div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Verification request submitted</p>
                  <p className="text-xs text-muted-foreground">Alice Johnson submitted passport verification</p>
                </div>
                <div className="text-xs text-muted-foreground">5h ago</div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Large transaction detected</p>
                  <p className="text-xs text-muted-foreground">Transaction of $5,000 by Mark Smith</p>
                </div>
                <div className="text-xs text-muted-foreground">Yesterday</div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Failed login attempts</p>
                  <p className="text-xs text-muted-foreground">Multiple failed login attempts for user ID #23421</p>
                </div>
                <div className="text-xs text-muted-foreground">2 days ago</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <a
              href="#"
              className="flex items-center text-sm text-primary hover:underline"
            >
              View all activities
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="rounded-lg border p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <h3 className="font-medium">Review Verification Requests</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.pendingVerifications} requests pending review
              </p>
            </div>
            <div className="rounded-lg border p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <h3 className="font-medium">Manage User Accounts</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Add, edit, or deactivate user accounts
              </p>
            </div>
            <div className="rounded-lg border p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <h3 className="font-medium">View Transaction Reports</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Generate and export transaction reports
              </p>
            </div>
            <div className="rounded-lg border p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <h3 className="font-medium">Update System Settings</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Configure application settings and parameters
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}