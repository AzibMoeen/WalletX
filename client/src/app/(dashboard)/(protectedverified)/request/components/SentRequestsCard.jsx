import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SentRequestsCard({
  sentRequests,
  formatDate,
  getCurrencySymbol,
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Requests Sent</CardTitle>
      </CardHeader>
      <CardContent>
        {sentRequests && sentRequests.length > 0 ? (
          <div className="space-y-4">
            {sentRequests.map((request) => (
              <Card key={request._id} className="p-4 border shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      To:{" "}
                      {request.recipient?.fullname ||
                        request.recipient?.email ||
                        "Unknown user"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <Badge
                    className={
                      request.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {request.status === "completed"
                      ? "Paid"
                      : request.status === "pending"
                      ? "Pending"
                      : "Rejected"}
                  </Badge>
                </div>

                <div className="mt-4">
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
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>You haven't sent any money requests yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
