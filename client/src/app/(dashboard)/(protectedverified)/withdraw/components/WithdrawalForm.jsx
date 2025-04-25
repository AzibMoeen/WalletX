import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import WithdrawalMethodSelector from "./WithdrawalMethodSelector"
import AmountForm from "./AmountForm"
import CardDetailsForm from "./CardDetailsForm"
import BankDetailsForm from "./BankDetailsForm"

const WithdrawalForm = ({
  wallet,
  currencies,
  getCurrencySymbol,
  handleSubmit,
  isLoading
}) => {
  const [withdrawalMethod, setWithdrawalMethod] = useState("card")
  const [formData, setFormData] = useState({
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
  })

  const handleMethodChange = (value) => {
    setWithdrawalMethod(value)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCurrencyChange = (value) => {
    setFormData(prev => ({ ...prev, currency: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const submissionData = {
      ...formData,
      withdrawalMethod,
      amount: parseFloat(formData.amount)
    }
    handleSubmit(submissionData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>Request a withdrawal from your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <WithdrawalMethodSelector 
            withdrawalMethod={withdrawalMethod}
            handleMethodChange={handleMethodChange}
          />
          
          <div className="space-y-6">
            <AmountForm 
              formData={formData}
              handleChange={handleChange}
              handleCurrencyChange={handleCurrencyChange}
              currencies={currencies}
              getCurrencySymbol={getCurrencySymbol}
              wallet={wallet}
            />
            
            {withdrawalMethod === "card" ? (
              <CardDetailsForm 
                formData={formData}
                handleChange={handleChange}
                isWithdrawalMethod={withdrawalMethod === "card"}
                getCurrencySymbol={getCurrencySymbol}
              />
            ) : (
              <BankDetailsForm
                formData={formData}
                handleChange={handleChange}
                isWithdrawalMethod={withdrawalMethod === "bank"}
                getCurrencySymbol={getCurrencySymbol}
              />
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" /> Request Withdrawal
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default WithdrawalForm