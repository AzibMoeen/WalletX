"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import VerificationCodeInput from "./VerificationCodeInput";

const VerificationForm = ({
  email,
  onVerify,
  onResend,
  onBack,
  isLoading,
  isResending,
  verificationError,
}) => {
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);

  const handleVerifyCode = () => {
    const code = verificationCode.join("");
    onVerify(code);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-gray-500 mb-6">
          Enter the 4-digit verification code sent to your email
        </p>

        <VerificationCodeInput
          value={verificationCode}
          onChange={setVerificationCode}
          error={verificationError}
        />
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          onClick={handleVerifyCode}
          disabled={isLoading}
          className="w-full cursor-pointer bg-gradient-to-r from-purple-600    to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Verify and Create Account
            </>
          )}
        </Button>

        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="cursor-pointer text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button
            type="button"
            variant="link"
            onClick={onResend}
            disabled={isResending}
            className="cursor-pointer text-purple-600 hover:text-purple-800"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Resending...
              </>
            ) : (
              "Resend Code"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;
