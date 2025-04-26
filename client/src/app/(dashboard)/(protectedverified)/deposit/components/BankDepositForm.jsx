import { Landmark, PlusCircle, Check, AlertCircle, Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" }
]

const BankDepositForm = ({
  formData,
  handleChange,
  handleSelectChange,
  handleSubmit,
  getCurrencySymbol,
  isLoading,
  success,
  error
}) => {
  const [copiedItem, setCopiedItem] = useState(null)
  
  const copyToClipboard = (text, itemType) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(itemType)
      setTimeout(() => setCopiedItem(null), 2000)
    })
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 mt-4">
      {success && (
        <Alert className="mb-4 md:mb-6 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Deposit request submitted successfully. Funds will be added to your wallet once the bank transfer is confirmed.
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
      
      <div className="space-y-4">
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
        
        <div className="bg-muted p-3 sm:p-5 rounded-lg space-y-4 sm:space-y-5">
          <div className="space-y-1">
            <div className="font-medium text-sm md:text-base">Our Bank Details</div>
            <p className="text-xs text-muted-foreground">Please use these details to make your bank transfer</p>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Bank Name</Label>
              <div className="flex items-center justify-between bg-white rounded-md border p-2 sm:p-2.5">
                <span className="text-xs sm:text-sm truncate mr-1">Digital Wallet Bank Ltd.</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 flex-shrink-0" 
                  onClick={() => copyToClipboard("Digital Wallet Bank Ltd.", "bank")}
                >
                  {copiedItem === "bank" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Account Number</Label>
              <div className="flex items-center justify-between bg-white rounded-md border p-2 sm:p-2.5">
                <span className="text-xs sm:text-sm font-mono truncate mr-1">12345678901234</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 flex-shrink-0" 
                  onClick={() => copyToClipboard("12345678901234", "account")}
                >
                  {copiedItem === "account" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Routing Number</Label>
              <div className="flex items-center justify-between bg-white rounded-md border p-2 sm:p-2.5">
                <span className="text-xs sm:text-sm font-mono truncate mr-1">123456789</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 flex-shrink-0" 
                  onClick={() => copyToClipboard("123456789", "routing")}
                >
                  {copiedItem === "routing" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Reference</Label>
              <div className="flex items-center justify-between bg-white rounded-md border p-2 sm:p-2.5">
                <span className="text-xs sm:text-sm font-mono truncate mr-1">DWALLET-{Math.floor(Math.random() * 1000000)}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 flex-shrink-0" 
                  onClick={() => copyToClipboard(`DWALLET-${Math.floor(Math.random() * 1000000)}`, "reference")}
                >
                  {copiedItem === "reference" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="transferReference" className="text-sm md:text-base">Transfer Reference</Label>
          <Input
            id="transferReference"
            name="transferReference"
            placeholder="Enter the reference used in your transfer"
            value={formData.transferReference}
            onChange={handleChange}
            className="h-10"
            required
          />
          <p className="text-xs text-muted-foreground">
            This should match the reference you used when making the bank transfer
          </p>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          "Processing..."
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" /> Confirm Deposit
          </>
        )}
      </Button>
      
      <div className="text-xs text-muted-foreground">
        <p>Note: This is a demo app. No actual bank transfers are needed.</p>
        <p>Bank deposits typically take 1-3 business days to process.</p>
      </div>
    </form>
  )
}

export default BankDepositForm