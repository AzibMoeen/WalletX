"use client"

import { useEffect } from "react"
import StatsCards from "./components/StatsCards"
import RecentActivitiesCard from "./components/RecentActivitiesCard"
import QuickActionsCard from "./components/QuickActionsCard"
import useAdminStore from "@/lib/store/useAdminStore"

export default function AdminDashboard() {
  const { 
    dashboardStats, 
    recentActivity, 
    fetchDashboardStats, 
    isLoading 
  } = useAdminStore();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <StatsCards stats={dashboardStats} loading={isLoading} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RecentActivitiesCard activities={recentActivity} loading={isLoading} />
        
        <QuickActionsCard stats={dashboardStats} />
      </div>
    </div>
  )
}