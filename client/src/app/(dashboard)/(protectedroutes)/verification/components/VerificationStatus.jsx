import { User, Shield, Upload, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const VerificationStatus = () => {
  return (
    <Card className="md:col-span-3">
      <CardHeader className="pb-3">
        <CardTitle>Verification Status</CardTitle>
        <CardDescription>Complete all verification steps to unlock full account features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-none">Basic Information</p>
              <p className="text-sm text-muted-foreground">Account details verified</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Check className="h-4 w-4 text-green-600" />
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-none">Identity Verification</p>
              <p className="text-sm text-muted-foreground">Verify your passport or gun license</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Upload className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-none">Address Verification</p>
              <p className="text-sm text-muted-foreground">Upload proof of address</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default VerificationStatus