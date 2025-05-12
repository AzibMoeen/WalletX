import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const VerificationGuidelines = () => {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">
          Verification Guidelines
        </CardTitle>
        <CardDescription>
          Follow these instructions for successful verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-medium">Clear Photos</h3>
          </div>
          <p className="text-xs text-muted-foreground pl-7">
            Ensure all documents are clearly visible and all text is readable.
          </p>
        </div>

        <Separator className="my-2" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-medium">Valid Documents</h3>
          </div>
          <p className="text-xs text-muted-foreground pl-7">
            Use only current, non-expired official documents for verification.
          </p>
        </div>

        <Separator className="my-2" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-medium">Complete Information</h3>
          </div>
          <p className="text-xs text-muted-foreground pl-7">
            Ensure all required information is visible in the document photos.
          </p>
        </div>

        <Separator className="my-2" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="h-3.5 w-3.5 text-primary" />
            </div>
            <h3 className="text-sm font-medium">Accurate Details</h3>
          </div>
          <p className="text-xs text-muted-foreground pl-7">
            All information provided must match the details on your documents.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationGuidelines;
