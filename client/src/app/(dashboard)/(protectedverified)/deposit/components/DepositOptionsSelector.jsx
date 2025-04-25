import { CreditCard, Landmark } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const DepositOptionsSelector = ({ selectedMethod, handleMethodChange }) => {
  return (
    <RadioGroup
      defaultValue="card"
      value={selectedMethod}
      onValueChange={handleMethodChange}
      className="grid grid-cols-2 gap-4 mb-6"
    >
      <div>
        <RadioGroupItem
          value="card"
          id="card-deposit"
          className="peer sr-only"
        />
        <Label
          htmlFor="card-deposit"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <CreditCard className="mb-3 h-6 w-6" />
          Credit/Debit Card
        </Label>
      </div>

      <div>
        <RadioGroupItem
          value="bank"
          id="bank-deposit"
          className="peer sr-only"
        />
        <Label
          htmlFor="bank-deposit"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        >
          <Landmark className="mb-3 h-6 w-6" />
          Bank Transfer
        </Label>
      </div>
    </RadioGroup>
  )
}

export default DepositOptionsSelector