"use client";

import { Check, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VerificationStatusCard = ({ user }) => {
  const isVerified = user?.verified;

  return (
    <Card
      className={`mb-6 overflow-hidden flex items-start p-3 ${
        isVerified
          ? "bg-green-50 dark:bg-green-950/20"
          : "bg-amber-50 dark:bg-amber-950/20"
      }`}
    >
      <div
        className={`p-1.5 rounded-full ${
          isVerified
            ? "bg-green-100 dark:bg-green-900/30"
            : "bg-amber-100 dark:bg-amber-900/30"
        }`}
      >
        {isVerified ? (
          <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
        )}
      </div>

      <div className="ml-3">
        <h3
          className={`font-medium text-sm ${
            isVerified
              ? "text-green-700 dark:text-green-500"
              : "text-amber-700 dark:text-amber-500"
          }`}
        >
          {isVerified ? "Account Verified" : "Verification Required"}
        </h3>
        <p className="text-xs text-muted-foreground">
          {isVerified
            ? "Your account is fully verified."
            : "Your account needs verification to access all features."}
        </p>
      </div>

      {!isVerified && (
        <div className="ml-auto">
          <Button
            variant="outline"
            className="h-8 px-3 text-xs border-amber-300 hover:border-amber-400 text-amber-700 hover:text-amber-800 hover:bg-amber-50 dark:bg-amber-950/30 dark:hover:bg-amber-900/30"
            onClick={() => (window.location.href = "/verification")}
          >
            Verify Now
          </Button>
        </div>
      )}
    </Card>
  );
};

export default VerificationStatusCard;
