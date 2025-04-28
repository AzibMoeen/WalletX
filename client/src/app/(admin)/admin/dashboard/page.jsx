"use client"

import { useEffect, useState } from "react"
import StatsCards from "./components/StatsCards"
import RecentActivitiesCard from "./components/RecentActivitiesCard"
import QuickActionsCard from "./components/QuickActionsCard"

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
        totalTransactions: data.stats.totalTransactions || 0, 
        activeUsers: data.stats.verifiedUsers
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
     
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
      
      {/* Stats Cards */}
      <StatsCards stats={stats} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activities Card */}
        <RecentActivitiesCard />
        
        {/* Quick Actions Card */}
        <QuickActionsCard stats={stats} />
      </div>
    </div>
  )
}