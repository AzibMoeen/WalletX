import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm, FormProvider } from "react-hook-form"
import BankDetailsForm from "./BankDetailsForm"
import CardDetailsForm from "./CardDetailsForm"
import AmountForm from "./AmountForm"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { CheckCircle, AlertCircle, Coins, CreditCard, Building } from "lucide-react"

const WithdrawForm = ({
  handleSubmit: onSubmitHandler,
  getCurrencySymbol,
  isLoading,
  success,
  error,
  wallet,
  currencies
}) => {
  const [withdrawalMethod, setWithdrawalMethod] = useState("card")
  
  const methods = useForm({
    defaultValues: {
      amount: "",
      currency: "USD",
      description: "",
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      // Bank transfer fields
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      routingNumber: ""
    },
    mode: "onChange"
  });
  
  const { handleSubmit, formState: { errors, isValid } } = methods;

  const handleMethodChange = (value) => {
    setWithdrawalMethod(value)
  }

  const onSubmit = (data) => {
    const submissionData = {
      ...data,
      withdrawalMethod,
      amount: parseFloat(data.amount)
    }
    onSubmitHandler(submissionData)
  }

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
        
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Withdrawal Methods Tabs */}
            <Tabs
              value={withdrawalMethod}
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
              
              <div className="mb-6">
                <AmountForm
                  currencies={currencies}
                  getCurrencySymbol={getCurrencySymbol}
                  wallet={wallet}
                />
              </div>
              
              {/* Card Withdrawal Form */}
              <TabsContent value="card">
                <CardDetailsForm
                  getCurrencySymbol={getCurrencySymbol}
                />
              </TabsContent>
              
              {/* Bank Transfer Form */}
              <TabsContent value="bank">
                <BankDetailsForm
                  getCurrencySymbol={getCurrencySymbol}
                />
              </TabsContent>
            </Tabs>
            
            <Button 
              type="submit" 
              className="w-full mt-6" 
              disabled={isLoading || (!isValid && Object.keys(errors).length > 0)}
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" /> Request Withdrawal
                </>
              )}
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

export default WithdrawForm