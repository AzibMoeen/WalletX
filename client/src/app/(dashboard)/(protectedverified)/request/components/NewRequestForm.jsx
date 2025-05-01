import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function NewRequestForm({
  formData,
  handleChange,
  handleSelectChange,
  handleSubmit,
  isLoading,
  error,
  success,
  getCurrencySymbol
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Request Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>Money request sent successfully!</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <label htmlFor="targetEmail" className="text-sm font-medium">
              Recipient Email
            </label>
            <Input
              id="targetEmail"
              name="targetEmail"
              value={formData.targetEmail}
              onChange={handleChange}
              placeholder="Enter recipient's email"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <Input
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium">
                Currency
              </label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleSelectChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="PKR">PKR (₨)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes (Optional)
            </label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add a note for the recipient"
              rows={3}
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Requesting...
              </>
            ) : (
              "Request Money"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}