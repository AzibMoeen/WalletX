import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ReceivedRequestsCard = ({ 
  receivedRequests, 
  formatDate, 
  getCurrencySymbol, 
  handlePayRequest 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Money Requests Received</CardTitle>
        <CardDescription>
          Manage money requests you've received from other users
        </CardDescription>
      </CardHeader>
      <CardContent>
        {receivedRequests.length === 0 ? (
          <p className="text-center py-10 text-gray-500">
            No money requests received
          </p>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((request) => (
              <Card key={request._id} className={`border ${request.status === 'pending' ? 'border-blue-200' : 'border-green-200'}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">
                        Request from: {request.user?.fullname || request.user?.email}
                      </h3>
                      <p className="text-sm text-gray-500">{formatDate(request.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {getCurrencySymbol(request.currencyFrom)} {request.amount.toFixed(2)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        request.status === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {request.notes && (
                    <p className="text-sm mb-4 bg-gray-50 p-3 rounded">
                      "{request.notes}"
                    </p>
                  )}
                  
                  {request.status === 'pending' && (
                    <div className="flex justify-end mt-2">
                      <Button 
                        onClick={() => handlePayRequest(request._id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Pay Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ReceivedRequestsCard