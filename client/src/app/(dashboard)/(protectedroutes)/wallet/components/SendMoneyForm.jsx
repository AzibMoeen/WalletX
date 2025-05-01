import { useState } from "react"
import { SendHorizontal, Check, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" }
]

const SendMoneyForm = ({ 
  formData, 
  handleChange, 
  handleSelectChange, 
  handleSubmit, 
  getCurrencySymbol,
  isLoading,
  success,
  error,
  users,
  isUsersFetched,
  fetchUsers,
  user,
  verificationStatus
}) => {
  const router = useRouter();
  
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Send Money</CardTitle>
        <CardDescription>Transfer funds to another wallet</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
        {success && (
          <Alert className="mb-4 md:mb-6 bg-green-50 text-green-800 border-green-200">
            <Check className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Money sent successfully. Redirecting to your wallet...
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert className="mb-4 md:mb-6 bg-red-50 text-red-800 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!verificationStatus.loading && !verificationStatus.isVerified && (
          <Alert className="mb-4 md:mb-6 bg-amber-50 text-amber-800 border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Required</AlertTitle>
            <AlertDescription>
              Your account needs to be verified before sending money. Please complete the verification process.
              {verificationStatus.pendingRequests.length > 0 ? (
                <div className="mt-2">
                  <p className="font-medium">Verification Status:</p>
                  <ul className="list-disc ml-5 mt-1 text-sm">
                    {verificationStatus.pendingRequests.map((req, index) => (
                      <li key={index}>
                        {req.type === 'passport' ? 'Passport' : 'Gun License'} verification: 
                        <span className={`ml-1 ${
                          req.status === 'pending' ? 'text-amber-600' :
                          req.status === 'verified' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Button 
                  variant="link" 
                  className="text-amber-800 hover:text-amber-900 p-0 h-auto font-normal"
                  onClick={() => router.push("/verification")}
                >
                  Verify your account now →
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipientId" className="text-sm md:text-base">Select Recipient</Label>
            <Select
              value={formData.recipientId}
              onValueChange={(value) => {
                const selectedUser = users.find(u => u._id === value);
                handleSelectChange("recipientId", value);
                if (selectedUser) {
                  handleSelectChange("recipientEmail", selectedUser.email);
                }
              }}
              onOpenChange={(open) => {
                // Fetch users only when dropdown is opened and users aren't already fetched
                if (open && !isUsersFetched) {
                  fetchUsers();
                }
              }}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user._id} value={user._id}>
                    <div className="truncate max-w-[250px]">
                      {user.fullname} ({user.email})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select a user from the list to send money to
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm md:text-base">Amount</Label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">{getCurrencySymbol(formData.currency)}</span>
                </div>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8 h-10"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleSelectChange("currency", value)}
              >
                <SelectTrigger className="w-full sm:w-[110px] sm:ml-2 h-10">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(currency => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm md:text-base">Note (optional)</Label>
            <Input
              id="note"
              name="note"
              placeholder="What's this for?"
              value={formData.note}
              onChange={handleChange}
              className="h-10"
            />
          </div>
          
          <div className="bg-muted p-3 md:p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">Transaction Details</div>
            <div className="space-y-1 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">From</span>
                <span className="truncate max-w-[60%] text-right">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient</span>
                <span className="truncate max-w-[60%] text-right">{formData.recipientId || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span>
                  {formData.amount ? 
                    `${getCurrencySymbol(formData.currency)}${parseFloat(formData.amount).toFixed(2)} ${formData.currency}` : 
                    "—"
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee</span>
                <span>No Fee (Demo)</span>
              </div>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading || !verificationStatus.isVerified}>
              <>
                <SendHorizontal className="mr-2 h-4 w-4" /> Send Money
              </>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default SendMoneyForm