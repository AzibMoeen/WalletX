"use client";

import { useState, useEffect } from "react";
import useWalletStore from "@/lib/store/useWalletStore";
import { toast } from "sonner";
import TransactionFilters from "./components/TransactionFilters";
import TransactionStatsCards from "./components/TransactionStatsCards";
import TransactionsList from "./components/TransactionsList";
import {
  TransactionFiltersSkeleton,
  TransactionStatsCardsSkeleton,
  TransactionsListSkeleton,
} from "./components/SkeletonComponents";

export default function TransactionsPage() {
  const {
    fetchTransactions,
    transactions,
    stats,
    isLoading,
    error,
    pagination,
  } = useWalletStore();

  const [period, setPeriod] = useState("all");
  const [activeCurrency, setActiveCurrency] = useState("all");
  const [activeTransactionType, setActiveTransactionType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  // Fetch transactions when filters change
  useEffect(() => {
    // Keep track of whether this component is still mounted
    let isMounted = true;

    // Use debounce pattern to prevent multiple rapid calls
    const timeoutId = setTimeout(async () => {
      if (isMounted) {
        await fetchTransactions(
          period !== "all" ? period : null,
          currentPage,
          20,
          activeCurrency !== "all" ? activeCurrency : null,
          activeTransactionType !== "all"
            ? activeTransactionType === "incoming"
              ? "receive"
              : "send"
            : null
        );
        if (isMounted) setIsDataLoaded(true);
      }
    }, 300); // Small delay to batch changes

    // Cleanup function
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [
    fetchTransactions,
    period,
    currentPage,
    activeCurrency,
    activeTransactionType,
  ]);

  // Format currency amounts
  const formatCurrency = (amount, currency) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  };

  // Get currency symbol
  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "PKR":
        return "₨";
      default:
        return "$";
    }
  };

  // Helper to determine if transaction is outgoing
  const isOutgoingTransaction = (type) => {
    return ["send", "withdraw", "payment"].includes(type);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;

    setCurrentPage(newPage);
  };

  // Calculate totals for the stats section
  const getTotalSpent = () => {
    if (!stats?.spent) return { USD: 0, EUR: 0, PKR: 0 };

    const result = { USD: 0, EUR: 0, PKR: 0 };
    stats.spent.forEach((item) => {
      result[item._id] = item.total;
    });
    return result;
  };

  const getTotalReceived = () => {
    if (!stats?.received) return { USD: 0, EUR: 0, PKR: 0 };

    const result = { USD: 0, EUR: 0, PKR: 0 };
    stats.received.forEach((item) => {
      result[item._id] = item.total;
    });
    return result;
  };

  // Export transactions to CSV
  const exportTransactionsToCSV = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    try {
      // Define CSV headers
      const headers = [
        "Date",
        "Type",
        "Description",
        "Amount",
        "Currency",
        "Status",
        "Reference",
      ];

      // Format transaction data for CSV
      const csvRows = transactions.map((tx) => {
        const sign = isOutgoingTransaction(tx.type) ? "-" : "+";

        // Generate description based on transaction type
        let description = "";
        if (tx.type === "send")
          description = `Sent to ${
            tx.recipient?.fullname || tx.recipient?.email || "User"
          }`;
        else if (tx.type === "receive")
          description = `Received from ${
            tx.sender?.fullname || tx.sender?.email || "User"
          }`;
        else if (tx.type === "deposit") description = "Deposit";
        else if (tx.type === "withdraw") description = "Withdrawal";
        else if (tx.type === "exchange")
          description = `Exchanged ${tx.currencyFrom} to ${tx.currencyTo}`;
        else if (tx.type === "request")
          description = `Requested from ${
            tx.recipient?.fullname || tx.recipient?.email || "User"
          }`;
        else if (tx.type === "payment")
          description = `Paid to ${
            tx.recipient?.fullname || tx.recipient?.email || "User"
          }`;

        return [
          new Date(tx.createdAt).toISOString().split("T")[0], // Date in YYYY-MM-DD format
          tx.type.charAt(0).toUpperCase() + tx.type.slice(1), // Capitalized type
          description,
          `${sign}${tx.amount.toFixed(2)}`,
          tx.currencyFrom,
          tx.status.charAt(0).toUpperCase() + tx.status.slice(1), // Capitalized status
          tx.reference,
        ];
      });

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      // Create a Blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Set filename with current date
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const filename = `transaction_history_${today}.csv`;

      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.display = "none";

      // Append to document, trigger download, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Transaction history exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export transactions");
    }
  };

  // Prepare stats data for display
  const spentTotals = getTotalSpent();
  const receivedTotals = getTotalReceived();
  return (
    <div className="container mx-auto px-4 py-6 md:py-10 space-y-6 md:space-y-8">
      {!isDataLoaded ? (
        <>
          <TransactionFiltersSkeleton />
          <TransactionStatsCardsSkeleton />
          <TransactionsListSkeleton />
        </>
      ) : (
        <>
          <TransactionFilters
            period={period}
            setPeriod={setPeriod}
            exportTransactionsToCSV={exportTransactionsToCSV}
          />

          <TransactionStatsCards
            spentTotals={spentTotals}
            receivedTotals={receivedTotals}
            getCurrencySymbol={getCurrencySymbol}
          />

          <TransactionsList
            period={period}
            activeCurrency={activeCurrency}
            setActiveCurrency={setActiveCurrency}
            activeTransactionType={activeTransactionType}
            setActiveTransactionType={setActiveTransactionType}
            filteredTransactions={transactions}
            isLoading={isLoading}
            isOutgoingTransaction={isOutgoingTransaction}
            formatDate={formatDate}
            getCurrencySymbol={getCurrencySymbol}
            exportTransactionsToCSV={exportTransactionsToCSV}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
