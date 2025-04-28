import { Users, FileCheck, CreditCard, AlertTriangle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const RecentActivitiesCard = () => {
  return (
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
  )
}

export default RecentActivitiesCard