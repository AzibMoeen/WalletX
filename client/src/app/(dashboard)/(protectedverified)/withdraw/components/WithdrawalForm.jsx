import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useForm, FormProvider } from "react-hook-form"
import WithdrawalMethodSelector from "./WithdrawalMethodSelector"
import AmountForm from "./AmountForm"
import CardDetailsForm from "./CardDetailsForm"
import BankDetailsForm from "./BankDetailsForm"

const WithdrawalForm = ({
  wallet,
  currencies,
  getCurrencySymbol,
  handleSubmit: onSubmitHandler,
  isLoading
}) => {
  const [withdrawalMethod, setWithdrawalMethod] = useState("card")
  
  const methods = useForm({
    defaultValues: {
      amount: "",
      currency: "USD",
      description: "",
      // Card withdrawal fields
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
        <CardDescription>Request a withdrawal from your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <WithdrawalMethodSelector 
              withdrawalMethod={withdrawalMethod}
              handleMethodChange={handleMethodChange}
            />
            
            <div className="space-y-6">
              <AmountForm 
                currencies={currencies}
                getCurrencySymbol={getCurrencySymbol}
                wallet={wallet}
              />
              
              {withdrawalMethod === "card" ? (
                <CardDetailsForm 
                  getCurrencySymbol={getCurrencySymbol}
                />
              ) : (
                <BankDetailsForm
                  getCurrencySymbol={getCurrencySymbol}
                />
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || (!isValid && Object.keys(errors).length > 0)}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <ArrowRight className="mr-2 h-4 w-4" /> Request Withdrawal
                  </>
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

export default WithdrawalForm