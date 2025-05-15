"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  User,
  AlertTriangle,
} from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function RequestsTable({
  requests,
  loading,
  type,
  formatDate,
  updateVerificationStatus,
  setSelectedRequest,
  setViewDialogOpen,
}) {
  // State for rejection confirmation dialog
  const [isConfirmRejectOpen, setIsConfirmRejectOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState(null);

  // Function to open the rejection confirmation dialog
  const handleOpenRejectConfirmation = (requestId, requestType) => {
    setRequestToReject({ id: requestId, type: requestType });
    setIsConfirmRejectOpen(true);
  };

  // Function to handle rejection confirmation
  const handleConfirmRejection = () => {
    if (requestToReject) {
      updateVerificationStatus(
        requestToReject.id,
        requestToReject.type,
        "rejected"
      );
      setIsConfirmRejectOpen(false);
      setRequestToReject(null);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Desktop view - table */}
          <div className="hidden md:block overflow-x-auto w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-left py-3 px-4 font-medium">
                    {type === "passport" ? "CNIC" : "License Number"}
                  </th>
                  <th className="text-left py-3 px-4 font-medium">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium w-[100px]">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-medium w-[150px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No {type} verification requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((request) => (
                    <tr key={request._id} className="border-b">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">
                            {request.user?.fullname || "Unknown User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {request.user?.email || "No email"}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {type === "passport"
                          ? request.passwordCnic
                          : request.licenseNumber}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedRequest({ ...request, type });
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-green-600"
                            disabled={request.status === "verified"}
                            onClick={() =>
                              updateVerificationStatus(
                                request._id,
                                type,
                                "verified"
                              )
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600"
                            disabled={request.status === "rejected"}
                            onClick={() =>
                              handleOpenRejectConfirmation(request._id, type)
                            }
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
            

          {/* Mobile view - cards */}
          <div className="md:hidden space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No {type} verification requests found.
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request._id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-2">
                      <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {request.user?.fullname || "Unknown User"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {request.user?.email || "No email"}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>

                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {type === "passport"
                        ? request.passwordCnic
                        : request.licenseNumber}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDate(request.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedRequest({ ...request, type });
                        setViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-green-600"
                        disabled={request.status === "verified"}
                        onClick={() =>
                          updateVerificationStatus(
                            request._id,
                            type,
                            "verified"
                          )
                        }
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-600"
                        disabled={request.status === "rejected"}
                        onClick={() =>
                          handleOpenRejectConfirmation(request._id, type)
                        }
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Confirmation Dialog for Rejection */}
          <Dialog
            open={isConfirmRejectOpen}
            onOpenChange={setIsConfirmRejectOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Confirm Rejection
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to reject this verification request?
                  This action cannot be undone and the user will need to submit
                  a new request.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmRejectOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmRejection}>
                  Reject Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
