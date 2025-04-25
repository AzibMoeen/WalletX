import { CreditCard, Landmark } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const WithdrawalMethodSelector = ({ withdrawalMethod, handleMethodChange }) => {
  return (
    <Tabs
      value={withdrawalMethod}
      onValueChange={handleMethodChange}
      className="w-full mb-6"
    >
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="card" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span>Card</span>
        </TabsTrigger>
        <TabsTrigger value="bank" className="flex items-center gap-2">
          <Landmark className="h-4 w-4" />
          <span>Bank</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default WithdrawalMethodSelector