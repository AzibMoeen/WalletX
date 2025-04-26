import { CreditCard, Landmark } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const DepositOptionsSelector = ({ selectedMethod, handleMethodChange }) => {
  return (
    <RadioGroup
      defaultValue="card"
      value={selectedMethod}
      onValueChange={handleMethodChange}
      className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 md:mb-6"
    >
      <div>
        <RadioGroupItem
          value="card"
          id="card-deposit"
          className="peer sr-only"
        />
        <Label
          htmlFor="card-deposit"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-colors text-center"
        >
          <CreditCard className="mb-2 sm:mb-3 h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-xs sm:text-sm">Credit/Debit Card</span>
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
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary transition-colors text-center"
        >
          <Landmark className="mb-2 sm:mb-3 h-5 w-5 sm:h-6 sm:w-6" />
          <span className="text-xs sm:text-sm">Bank Transfer</span>
        </Label>
      </div>
    </RadioGroup>
  )
}

export default DepositOptionsSelector