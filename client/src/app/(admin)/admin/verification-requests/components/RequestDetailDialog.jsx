"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { StatusBadge } from "./StatusBadge"

export function RequestDetailDialog({ 
  selectedRequest, 
  updateVerificationStatus, 
  setViewDialogOpen 
}) {
  if (!selectedRequest) return null

  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>
          {selectedRequest.type === 'passport' ? 'Passport Verification Details' : 'Gun License Verification Details'}
        </DialogTitle>
        <DialogDescription>
          Review the details of this verification request.
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <p className="text-right text-sm font-medium col-span-1">User:</p>
          <div className="col-span-3">
            <p className="text-sm">{selectedRequest.user.fullname}</p>
            <p className="text-xs text-muted-foreground">{selectedRequest.user.email}</p>
          </div>
        </div>
        
        {selectedRequest.type === 'passport' ? (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-right text-sm font-medium col-span-1">CNIC:</p>
              <p className="text-sm col-span-3">{selectedRequest.passwordCnic}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-right text-sm font-medium col-span-1">Full Name:</p>
              <p className="text-sm col-span-3">{selectedRequest.fullName}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-right text-sm font-medium col-span-1">Date of Birth:</p>
              <p className="text-sm col-span-3">{new Date(selectedRequest.dob).toLocaleDateString()}</p>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-right text-sm font-medium col-span-1">License #:</p>
              <p className="text-sm col-span-3">{selectedRequest.licenseNumber}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-right text-sm font-medium col-span-1">CNIC:</p>
              <p className="text-sm col-span-3">{selectedRequest.cnic}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-right text-sm font-medium col-span-1">Issue Date:</p>
              <p className="text-sm col-span-3">{new Date(selectedRequest.issueDate).toLocaleDateString()}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-right text-sm font-medium col-span-1">Expiry Date:</p>
              <p className="text-sm col-span-3">{new Date(selectedRequest.expiryDate).toLocaleDateString()}</p>
            </div>
          </>
        )}
        
        <div className="grid grid-cols-4 items-center gap-4">
          <p className="text-right text-sm font-medium col-span-1">Status:</p>
          <div className="col-span-3">
            <StatusBadge status={selectedRequest.status} />
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <p className="text-right text-sm font-medium col-span-1">Document:</p>
          <div className="col-span-3">
            <img 
              src={selectedRequest.type === 'passport' ? selectedRequest.passportImage : selectedRequest.gunImage} 
              alt={selectedRequest.type === 'passport' ? "Passport" : "Gun License"}
              className="w-full rounded-md border h-40 object-cover"
            />
          </div>
        </div>
      </div>
      
      <DialogFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-green-600"
            disabled={selectedRequest.status === 'verified'}
            onClick={() => {
              updateVerificationStatus(
                selectedRequest._id, 
                selectedRequest.type, 
                'verified'
              )
              setViewDialogOpen(false)
            }}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-red-600"
            disabled={selectedRequest.status === 'rejected'}
            onClick={() => {
              updateVerificationStatus(
                selectedRequest._id, 
                selectedRequest.type, 
                'rejected'
              )
              setViewDialogOpen(false)
            }}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
        <DialogClose asChild>
          <Button variant="outline" size="sm">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}