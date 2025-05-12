import { Shield, Lock, Clock, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VerificationBenefits = () => {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">
          Benefits of Verification
        </CardTitle>
        <CardDescription>Why you should complete verification</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Enhanced Security</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Protect your account with additional security measures.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Full Access</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Unlock all platform features and higher transaction limits.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Faster Processing</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Enjoy quicker approval times for future requests.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Priority Support</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Get prioritized customer support and assistance.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationBenefits;
