import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
export default function ReceivedRequestsCard({
  receivedRequests,
  formatDate,
  getCurrencySymbol,
  handlePayRequest,
}) {
  const [payingRequestId, setPayingRequestId] = useState(null);

  const onPayRequest = async (requestId) => {
    try {
      setPayingRequestId(requestId);
      await handlePayRequest(requestId);
    } finally {
      setPayingRequestId(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Requests Received</CardTitle>
      </CardHeader>
      <CardContent>
        {receivedRequests && receivedRequests.length > 0 ? (
          <div className="space-y-4">
            {receivedRequests.map((request) => (
              <Card key={request._id} className="p-4 border shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      From:{" "}
                      {request.user?.fullname ||
                        request.user?.email ||
                        "Unknown user"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <Badge
                    className={
                      request.status === "completed"
                        ? "bg-emerald-100 text-emerald-800" // Using Emerald for completed to match new accent color
                        : request.status === "pending"
                        ? "bg-amber-100 text-amber-800" // Using Amber for pending for a warmer neutral
                        : "bg-red-100 text-red-800" // Keeping Red for rejected/default as it aligns with destructive color
                    }
                  >
                    {request.status === "completed"
                      ? "Paid"
                      : request.status === "pending"
                      ? "Pending"
                      : "Rejected"}
                  </Badge>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold">
                      {getCurrencySymbol(request.currencyFrom)}
                      {request.amount.toFixed(2)} {request.currencyFrom}
                    </p>
                    {request.notes && (
                      <p className="text-sm text-gray-600 mt-1">
                        {request.notes}
                      </p>
                    )}
                  </div>

                  {request.status === "pending" && (
                    <Button
                      onClick={() => onPayRequest(request._id)}
                      disabled={payingRequestId === request._id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {payingRequestId === request._id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Paying...
                        </>
                      ) : (
                        "Pay Now"
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>You have no money requests from others</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
