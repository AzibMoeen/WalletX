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
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 rounded-lg border border-border shadow-lg">
      <div className=" p-6 rounded-t-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {selectedRequest.type === "passport"
              ? "Passport Verification"
              : "Gun License Verification"}
          </DialogTitle>
          <DialogDescription className="text-primary/80 text-sm">
            Review verification request details submitted on{" "}
            {new Date(
              selectedRequest.createdAt || Date.now()
            ).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
      </div>{" "}
      <div className="p-6 space-y-6 bg-background">
        {/* User information card */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 rounded-full p-2 mt-1">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">
                {selectedRequest.user.fullname}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedRequest.user.email}
              </p>
            </div>
            <div className="ml-auto">
              <StatusBadge status={selectedRequest.status} />
            </div>
          </div>
        </div>{" "}
        {/* Document details */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-primary uppercase tracking-wider">
            Document Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card border border-border rounded-lg p-4">
            {selectedRequest.type === "passport" ? (
              <>
                {" "}
                <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-md">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">CNIC</p>
                    <p className="font-medium text-foreground">
                      {selectedRequest.passwordCnic}
                    </p>
                  </div>
                </div>{" "}
                <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-md">
                  <User className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="font-medium text-foreground">
                      {selectedRequest.fullName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-md">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Date of Birth
                    </p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedRequest.dob).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {" "}
                <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-md">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      License Number
                    </p>
                    <p className="font-medium text-foreground break-all">
                      {selectedRequest.licenseNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-md">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">CNIC</p>
                    <p className="font-medium text-foreground break-all">
                      {selectedRequest.cnic}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-md">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Issue Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(selectedRequest.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-md">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Expiry Date</p>
                    <p className="font-medium text-foreground">
                      {new Date(
                        selectedRequest.expiryDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>{" "}
        {/* Document image */}
        <div className="space-y-4">
          <h3 className="font-medium text-sm text-primary uppercase tracking-wider">
            Document Image
          </h3>

          <div className="bg-card border border-border rounded-lg p-4 relative flex justify-center">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin"></div>
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
      </div>{" "}
      <DialogFooter className="px-6 pb-6 pt-4 bg-background border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
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
              variant="destructive"
              size="sm"
              className="flex-1"
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
              className="bg-background hover:bg-muted"
            >
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
