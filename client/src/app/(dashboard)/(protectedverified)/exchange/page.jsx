"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, AlertCircle } from "lucide-react";
import BalanceCard from "../withdraw/components/BalanceCard";
import ExchangeForm from "./components/ExchangeForm";
import ExchangeRatesCard from "./components/ExchangeRatesCard";
import ExchangeHistoryCard from "./components/ExchangeHistoryCard";
import useWalletStore from "@/lib/store/useWalletStore";


// Demo exchange rates
const EXCHANGE_RATES = {
  USD: { EUR: 0.91, PKR: 278.5 },
  EUR: { USD: 1.1, PKR: 306.3 },
  PKR: { USD: 0.0036, EUR: 0.0033 },
};

export default function ExchangePage() {
  const router = useRouter();
  const {
    wallet,
    isLoading: storeLoading,
    error: storeError,
    success: storeSuccess,
    fetchWallet,
    getBalanceDisplay,
    getCurrencySymbol,
    setSuccess: setStoreSuccess,
    exchangeCurrency,
    fetchExchangeHistory,
  } = useWalletStore();

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [conversionRate, setConversionRate] = useState(0);
  const [localLoading, setLocalLoading] = useState(false);
  const [localSuccess, setLocalSuccess] = useState(false);
  const [localError, setLocalError] = useState("");
  const [exchangeHistory, setExchangeHistory] = useState([]);
  const [exchangeRates, setExchangeRates] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const loadData = async () => {
      await fetchWallet();      const response = await fetchExchangeHistory();
      setExchangeHistory(response.data || []);
      generateExchangeRates();
      setLastUpdated(new Date().toLocaleTimeString());
    };
    loadData();
  }, [fetchWallet, fetchExchangeHistory]);

  useEffect(() => {
    // Update conversion rate when currencies change
    if (fromCurrency && toCurrency) {
      const rate = EXCHANGE_RATES[fromCurrency]?.[toCurrency] || 0;
      setConversionRate(rate);

      // Update toAmount based on fromAmount and new rate
      if (fromAmount) {
        setToAmount((parseFloat(fromAmount) * rate).toFixed(2));
      }
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  const generateExchangeRates = () => {
    const rates = [];
    Object.keys(EXCHANGE_RATES).forEach((from) => {
      Object.keys(EXCHANGE_RATES[from]).forEach((to) => {
        rates.push({
          from,
          to,
          rate: EXCHANGE_RATES[from][to],
        });
      });
    });
    setExchangeRates(rates);
  };

  const handleFromCurrencyChange = (value) => {
    setFromCurrency(value);
  };

  const handleToCurrencyChange = (value) => {
    setToCurrency(value);
  };

  const handleFromAmountChange = (e) => {
    const value = e.target.value;
    setFromAmount(value);
    if (value && conversionRate) {
      setToAmount((parseFloat(value) * conversionRate).toFixed(2));
    } else {
      setToAmount("");
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setLocalError("");
    setLocalSuccess(false);
    setStoreSuccess("exchange", false);

    try {
      // Validate form
      if (!fromAmount || parseFloat(fromAmount) <= 0) {
        throw new Error("Please enter a valid amount to exchange");
      }

      // Check if user has sufficient balance
      const fromBalance =
        wallet.balances?.find((b) => b.currency === fromCurrency)?.amount || 0;
      if (parseFloat(fromAmount) > fromBalance) {
        throw new Error(`Insufficient ${fromCurrency} balance`);
      }

      await exchangeCurrency(fromCurrency, toCurrency, fromAmount);

      setLocalSuccess(true);
      setStoreSuccess("exchange", true);

      // Reset form
      setFromAmount("");
      setToAmount("");

      // Redirect to wallet page after 2 seconds

    } catch (error) {
      setLocalError(error.message);
    } finally {
      setLocalLoading(false);
    }
  };

  // Combine local and store states
  const isLoading = storeLoading || localLoading;
  const error = localError || storeError;
  const success = localSuccess || storeSuccess;

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 max-w-4xl">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Currency Exchange
      </h1>

      {success && (
        <Alert className="mb-4 md:mb-6 bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            Currency exchanged successfully. Redirecting to your wallet...
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4 md:mb-6 bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-12">
        {/* Sidebar */}
        <div className="md:col-span-4 space-y-4">
          <BalanceCard
            wallet={wallet}
            getBalanceDisplay={getBalanceDisplay}
            router={router}
            buttonAction="deposit"
          />

          <ExchangeRatesCard
            exchangeRates={exchangeRates}
            getCurrencySymbol={getCurrencySymbol}
            lastUpdated={lastUpdated}
          />

          <ExchangeHistoryCard
            exchangeHistory={exchangeHistory}
            getCurrencySymbol={getCurrencySymbol}
          />
        </div>

        {/* Exchange Form */}
        <div className="md:col-span-8">
          <ExchangeForm
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            fromAmount={fromAmount}
            toAmount={toAmount}
            handleFromCurrencyChange={handleFromCurrencyChange}
            handleToCurrencyChange={handleToCurrencyChange}
            handleFromAmountChange={handleFromAmountChange}
            handleSwapCurrencies={handleSwapCurrencies}
            handleSubmit={handleSubmit}
            conversionRate={conversionRate}
            getCurrencySymbol={getCurrencySymbol}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
