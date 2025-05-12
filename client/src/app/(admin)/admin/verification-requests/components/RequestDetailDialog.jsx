"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  User,
  Calendar,
  CreditCard,
  FileText,
} from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { StatusBadge } from "./StatusBadge";

export function RequestDetailDialog({
  selectedRequest,
  updateVerificationStatus,
  setViewDialogOpen,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!selectedRequest) return null;

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto border-0 p-0 rounded-xl shadow-xl">
      <div className="bg-gradient-to-r from-[color:var(--gradient-from)] to-[color:var(--gradient-to)] text-white p-6 rounded-t-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {selectedRequest.type === "passport"
              ? "Passport Verification"
              : "Gun License Verification"}
          </DialogTitle>
          <DialogDescription className="text-white/90 mt-1">
            Review verification request details submitted on{" "}
            {new Date(
              selectedRequest.createdAt || Date.now()
            ).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="p-6 space-y-6 bg-[color:var(--background)]">
        {/* User information card */}
        <div className="alert-info">
          {" "}
          {/* Using the new alert-info class */}
          <div className="flex items-start gap-3">
            <div className="bg-[color:var(--primary)]/10 rounded-full p-2 mt-1">
              <User className="h-5 w-5 text-[color:var(--primary)]" />
            </div>
            <div>
              <h3 className="font-medium text-[color:var(--foreground)]">
                {selectedRequest.user.fullname}
              </h3>
              <p className="text-sm text-[color:var(--muted-foreground)]">
                {selectedRequest.user.email}
              </p>
            </div>
            <div className="ml-auto">
              <StatusBadge status={selectedRequest.status} />
            </div>
          </div>
        </div>

        {/* Document details */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-[color:var(--primary)] uppercase tracking-wider">
            Document Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedRequest.type === "passport" ? (
              <>
                <div className="alert-info flex items-center gap-3">
                  {" "}
                  {/* Using alert-info class */}
                  <CreditCard className="h-4 w-4 text-[color:var(--primary)]" />
                  <div>
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      CNIC
                    </p>
                    <p className="font-medium text-[color:var(--foreground)]">
                      {selectedRequest.passwordCnic}
                    </p>
                  </div>
                </div>

                <div className="alert-info flex items-center gap-3">
                  {" "}
                  {/* Using alert-info class */}
                  <User className="h-4 w-4 text-[color:var(--primary)]" />
                  <div>
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      Full Name
                    </p>
                    <p className="font-medium text-[color:var(--foreground)]">
                      {selectedRequest.fullName}
                    </p>
                  </div>
                </div>

                <div className="alert-info flex items-center gap-3">
                  {" "}
                  {/* Using alert-info class */}
                  <Calendar className="h-4 w-4 text-[color:var(--primary)]" />
                  <div>
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      Date of Birth
                    </p>
                    <p className="font-medium text-[color:var(--foreground)]">
                      {new Date(selectedRequest.dob).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="alert-info flex items-center gap-3">
                  {" "}
                  {/* Using alert-info class */}
                  <FileText className="h-4 w-4 text-[color:var(--primary)]" />
                  <div>
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      License Number
                    </p>
                    <p className="font-medium text-[color:var(--foreground)] break-all">
                      {selectedRequest.licenseNumber}
                    </p>
                  </div>
                </div>

                <div className="alert-info flex items-center gap-3">
                  {" "}
                  {/* Using alert-info class */}
                  <CreditCard className="h-4 w-4 text-[color:var(--primary)]" />
                  <div>
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      CNIC
                    </p>
                    <p className="font-medium text-[color:var(--foreground)] break-all">
                      {selectedRequest.cnic}
                    </p>
                  </div>
                </div>

                <div className="alert-info flex items-center gap-3">
                  {" "}
                  {/* Using alert-info class */}
                  <Calendar className="h-4 w-4 text-[color:var(--primary)]" />
                  <div>
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      Issue Date
                    </p>
                    <p className="font-medium text-[color:var(--foreground)]">
                      {new Date(selectedRequest.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="alert-info flex items-center gap-3">
                  {" "}
                  {/* Using alert-info class */}
                  <Calendar className="h-4 w-4 text-[color:var(--primary)]" />
                  <div>
                    <p className="text-xs text-[color:var(--muted-foreground)]">
                      Expiry Date
                    </p>
                    <p className="font-medium text-[color:var(--foreground)]">
                      {new Date(
                        selectedRequest.expiryDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Document image */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-[color:var(--primary)] uppercase tracking-wider">
            Document Image
          </h3>

          <div className="alert-info relative flex justify-center">
            {" "}
            {/* Using alert-info class */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-[color:var(--border)] border-t-[color:var(--primary)] rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={
                selectedRequest.type === "passport"
                  ? selectedRequest.passportImage
                  : selectedRequest.gunImage
              }
              alt={
                selectedRequest.type === "passport" ? "Passport" : "Gun License"
              }
              className={`w-full rounded-md h-auto max-h-60 object-contain transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
      </div>

      <DialogFooter className="px-6 pb-6 pt-2 bg-[color:var(--background)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 cursor-pointer font-medium bg-[color:var(--accent)] text-[color:var(--accent-foreground)] hover:bg-[color:var(--accent)]/90"
              disabled={selectedRequest.status === "verified"}
              onClick={() => {
                updateVerificationStatus(
                  selectedRequest._id,
                  selectedRequest.type,
                  "verified"
                );
                setViewDialogOpen(false);
              }}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button
              variant="destructive" // Leverage shadcn's destructive variant
              size="sm"
              className="flex-1 cursor-pointer font-medium" // Tailwind classes from variant should apply
              disabled={selectedRequest.status === "rejected"}
              onClick={() => {
                updateVerificationStatus(
                  selectedRequest._id,
                  selectedRequest.type,
                  "rejected"
                );
                setViewDialogOpen(false);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
          <DialogClose asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-[color:var(--card)] text-[color:var(--muted-foreground)] border-[color:var(--border)] hover:bg-[color:var(--muted)] hover:text-[color:var(--foreground)] cursor-pointer"
            >
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
