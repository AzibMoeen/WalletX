import { Check, Shield, CreditCard, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const VerificationBenefits = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Verification Benefits</CardTitle>
        <CardDescription>Advantages of completing verification</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-green-100 flex items-center justify-center">
              <Shield className="h-3 w-3 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Enhanced Security</p>
              <p className="text-xs text-muted-foreground">
                Additional layers of protection for your account and transactions
              </p>
            </div>
          </li>
          
          <li className="flex gap-3">
            <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-green-100 flex items-center justify-center">
              <CreditCard className="h-3 w-3 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Higher Limits</p>
              <p className="text-xs text-muted-foreground">
                Increase your transaction limits for deposits and withdrawals
              </p>
            </div>
          </li>
          
          <li className="flex gap-3">
            <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="h-3 w-3 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Full Services</p>
              <p className="text-xs text-muted-foreground">
                Unlock access to all platform features and services
              </p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}

export default VerificationBenefits