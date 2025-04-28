"use client"

import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, XCircle } from "lucide-react"
import { StatusBadge } from "./StatusBadge"

export function RequestsTable({ 
  requests, 
  loading, 
  type, 
  formatDate, 
  updateVerificationStatus,
  setSelectedRequest,
  setViewDialogOpen 
}) {
  return (
    <>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">User</th>
                <th className="text-left py-3 px-4 font-medium">
                  {type === 'passport' ? 'CNIC' : 'License Number'}
                </th>
                <th className="text-left py-3 px-4 font-medium">Submitted</th>
                <th className="text-left py-3 px-4 font-medium w-[100px]">Status</th>
                <th className="text-left py-3 px-4 font-medium w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">
                    No {type} verification requests found.
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request._id} className="border-b">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{request.user.fullname}</p>
                        <p className="text-xs text-muted-foreground">{request.user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {type === 'passport' ? request.passwordCnic : request.licenseNumber}
                    </td>
                    <td className="py-3 px-4">{formatDate(request.createdAt)}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => {
                            setSelectedRequest({...request, type})
                            setViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-green-600"
                          disabled={request.status === 'verified'}
                          onClick={() => updateVerificationStatus(request._id, type, 'verified')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-red-600"
                          disabled={request.status === 'rejected'}
                          onClick={() => updateVerificationStatus(request._id, type, 'rejected')}
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
      )}
    </>
  )
}