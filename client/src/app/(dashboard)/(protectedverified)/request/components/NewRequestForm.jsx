import { useState } from "react"
import { AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const NewRequestForm = ({ 
  formData, 
  handleChange, 
  handleSelectChange, 
  handleSubmit, 
  isLoading, 
  error, 
  success, 
  getCurrencySymbol 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Money</CardTitle>
        <CardDescription>
          Request money from another user by entering their email address
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-600">Success</AlertTitle>
            <AlertDescription className="text-green-600">
              Money request sent successfully!
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="targetEmail">Recipient Email</Label>
            <Input
              id="targetEmail"
              name="targetEmail"
              placeholder="Enter recipient's email"
              value={formData.targetEmail}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  className="pl-8"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleSelectChange("currency", value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="PKR">PKR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Description (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="What is this request for?"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
        
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending Request..." : "Request Money"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default NewRequestForm