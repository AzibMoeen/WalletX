import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const QuickActionsCard = ({ stats }) => {
  return (
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
  )
}

export default QuickActionsCard