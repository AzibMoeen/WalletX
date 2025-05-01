import { Users, FileCheck, CreditCard, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const StatsCards = ({ stats, loading = false }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.pendingVerifications || 0}</div>
              <p className="text-xs text-muted-foreground">Requires review</p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.totalTransactions || 0}</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.activeUsers || 0}</div>
              <p className="text-xs text-muted-foreground">+7% from last week</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsCards