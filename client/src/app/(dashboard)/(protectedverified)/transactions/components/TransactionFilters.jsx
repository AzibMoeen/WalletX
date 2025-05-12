import { Calendar, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const TransactionFilters = ({ period, setPeriod, exportTransactionsToCSV }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <h1 className="text-xl md:text-2xl font-bold">Transactions History</h1>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select
          value={period}
          onValueChange={setPeriod}
          className="flex-1 sm:flex-none"
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {period === "all" && "All Time"}
                {period === "daily" && "Today"}
                {period === "weekly" && "This Week"}
                {period === "monthly" && "This Month"}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="daily">Today</SelectItem>
            <SelectItem value="weekly">This Week</SelectItem>
            <SelectItem value="monthly">This Month</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" onClick={exportTransactionsToCSV}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilters;
