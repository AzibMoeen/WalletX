import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const RecentRecipients = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Recipients</CardTitle>
        <CardDescription>People you've sent money to recently</CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="text-center py-4 text-muted-foreground">
          <p>Your recent recipients will appear here</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentRecipients