import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const SentRequestsCard = ({ 
  sentRequests, 
  formatDate, 
  getCurrencySymbol 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Money Requests Sent</CardTitle>
        <CardDescription>
          Track the status of money requests you've sent to others
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sentRequests.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No money requests sent
          </p>
        ) : (
          <div className="space-y-4">
            {sentRequests.map((request) => (
              <Card key={request._id} className={`border ${request.status === 'pending' ? 'border-amber-200' : 'border-green-200'}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">
                        Requested from: {request.recipient?.fullname || request.recipient?.email}
                      </h3>
                      <p className="text-sm text-gray-500">{formatDate(request.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {getCurrencySymbol(request.currencyFrom)} {request.amount.toFixed(2)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        request.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {request.notes && (
                    <p className="text-sm mb-2 bg-gray-50 p-3 rounded">
                      "{request.notes}"
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Reference: {request.reference}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SentRequestsCard