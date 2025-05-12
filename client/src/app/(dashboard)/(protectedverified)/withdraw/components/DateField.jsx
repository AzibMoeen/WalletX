import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

const DateField = () => {
  const { control } = useFormContext();

  // Get current date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <FormField
      control={control}
      name="withdrawalDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Withdrawal Date</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="date"
                className="input-date-right pl-10"
                placeholder="Select date"
                min={today}
                {...field}
              />
              <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DateField;
