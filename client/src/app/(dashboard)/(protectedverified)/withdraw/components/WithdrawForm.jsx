import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BankDetailsForm from "./BankDetailsForm"
import CardDetailsForm from "./CardDetailsForm"
import { CheckCircle, AlertCircle, Coins, CreditCard, Building } from "lucide-react"

const WithdrawForm = ({
  selectedMethod,
  handleMethodChange,
  formData,
  handleChange,
  handleSelectChange,
  handleSubmit,
  getCurrencySymbol,
  isLoading,
  success,
  error,
  wallet
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>
          Request a withdrawal to your bank account or card
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Success Message */}
        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              Your withdrawal request has been submitted successfully. You can track its status in your transaction history.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Error Message */}
        {error && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        {/* If no balance */}
        {wallet.balances?.every(b => b.amount <= 0) && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <Coins className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-600">
              You don't have any funds to withdraw. Please deposit funds first.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Withdrawal Methods Tabs */}
        <Tabs
          value={selectedMethod}
          onValueChange={handleMethodChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="card" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" /> Card
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex items-center">
              <Building className="h-4 w-4 mr-2" /> Bank Transfer
            </TabsTrigger>
          </TabsList>
          
          {/* Card Withdrawal Form */}
          <TabsContent value="card">
            <CardDetailsForm
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              handleSubmit={handleSubmit}
              getCurrencySymbol={getCurrencySymbol}
              isLoading={isLoading}
              wallet={wallet}
            />
          </TabsContent>
          
          {/* Bank Transfer Form */}
          <TabsContent value="bank">
            <BankDetailsForm
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              handleSubmit={handleSubmit}
              getCurrencySymbol={getCurrencySymbol}
              isLoading={isLoading}
              wallet={wallet}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default WithdrawForm