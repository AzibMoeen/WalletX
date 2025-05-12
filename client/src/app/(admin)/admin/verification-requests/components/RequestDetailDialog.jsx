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
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-t-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {selectedRequest.type === "passport"
              ? "Passport Verification"
              : "Gun License Verification"}
          </DialogTitle>
          <DialogDescription className="text-blue-100 mt-1">
            Review verification request details submitted on{" "}
            {new Date(
              selectedRequest.createdAt || Date.now()
            ).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="p-6 space-y-6 bg-white">
        {/* User information card */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="bg-blue-200 rounded-full p-2 mt-1">
              <User className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">
                {selectedRequest.user.fullname}
              </h3>
              <p className="text-sm text-blue-500">
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
          <h3 className="font-medium text-sm text-blue-500 uppercase tracking-wider">
            Document Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedRequest.type === "passport" ? (
              <>
                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-blue-500">CNIC</p>
                    <p className="font-medium text-blue-900">
                      {selectedRequest.passwordCnic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <User className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-blue-500">Full Name</p>
                    <p className="font-medium text-blue-900">
                      {selectedRequest.fullName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-blue-500">Date of Birth</p>
                    <p className="font-medium text-blue-900">
                      {new Date(selectedRequest.dob).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-blue-500">License Number</p>
                    <p className="font-medium text-blue-900 break-all">
                      {selectedRequest.licenseNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <CreditCard className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-blue-500">CNIC</p>
                    <p className="font-medium text-blue-900 break-all">
                      {selectedRequest.cnic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-blue-500">Issue Date</p>
                    <p className="font-medium text-blue-900">
                      {new Date(selectedRequest.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-blue-500">Expiry Date</p>
                    <p className="font-medium text-blue-900">
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
          <h3 className="font-medium text-sm text-blue-500 uppercase tracking-wider">
            Document Image
          </h3>

          <div className="relative bg-blue-50 rounded-lg p-2 border border-blue-200 flex justify-center">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
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

      <DialogFooter className="px-6 pb-6 pt-2 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 cursor-pointer border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium"
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
              variant="outline"
              size="sm"
              className="flex-1 cursor-pointer border-red-200 bg-red-50  text-red-700 font-medium"
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
              className="bg-white cursor-pointer hover:bg-blue-300 border-blue-200 text-blue-700"
            >
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
