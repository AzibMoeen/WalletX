import { Users, FileCheck, CreditCard, AlertTriangle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ActivityIcon = ({ type }) => {
  switch (type) {
    case 'USER_REGISTERED':
      return <Users className="h-5 w-5 text-primary" />
    case 'VERIFICATION_SUBMITTED':
    case 'VERIFICATION_APPROVED':
    case 'VERIFICATION_REJECTED':
      return <FileCheck className="h-5 w-5 text-primary" />
    case 'TRANSACTION':
      return <CreditCard className="h-5 w-5 text-primary" />
    default:
      return <AlertTriangle className="h-5 w-5 text-primary" />
  }
}

const formatTimeAgo = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now - date) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return days === 1 ? 'Yesterday' : `${days} days ago`
  } else if (hours > 0) {
    return `${hours}h ago`
  } else if (minutes > 0) {
    return `${minutes}m ago`
  } else {
    return 'Just now'
  }
}

const RecentActivitiesCard = ({ activities = [], loading = false }) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Overview of system activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            // Loading skeletons
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))
          ) : activities && activities.length > 0 ? (
            // Actual activities from the store
            activities.slice(0, 4).map((activity, index) => (
              <div key={index} className="flex items-center gap-4 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</div>
              </div>
            ))
          ) : (
            // Fallback when no activities
            <div className="text-center py-6 text-muted-foreground">
              No recent activities to display
            </div>
          )}
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
  )
}

export default RecentActivitiesCard