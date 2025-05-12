"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe-real";
import BalanceCard from "../withdraw/components/BalanceCard";
import RecentDepositsCard from "./components/RecentDepositsCard";
import DepositMethodsCard from "./components/DepositMethodsCard";
import DepositOptionsSelector from "./components/DepositOptionsSelector";
import CardDepositForm from "./components/CardDepositForm";
import BankDepositForm from "./components/BankDepositForm";
import useWalletStore from "@/lib/store/useWalletStore";
import { API_BASE_URL } from "@/lib/config";
import {
  BalanceCardSkeleton,
  DepositMethodsCardSkeleton,
  RecentDepositsCardSkeleton,
  DepositFormSkeleton,
} from "./components/SkeletonComponents";

export default function DepositPage() {
  const router = useRouter();
  const [depositMethod, setDepositMethod] = useState("card");
  const {
    wallet,
    isLoading: storeLoading,
    error: storeError,
    success,
    fetchBalance,
    depositFunds,
    getBalanceDisplay,
    getCurrencySymbol,
    setSuccess,
  } = useWalletStore();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [recentDeposits, setRecentDeposits] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    transferReference: "",
  });
  useEffect(() => {
    const loadData = async () => {
      await fetchBalance();
      await fetchRecentDeposits();
      setIsDataLoaded(true);
    };

    loadData();
  }, [fetchBalance]);

  const fetchRecentDeposits = async () => {
    try {
      setRecentDeposits([
        {
          method: "Card Deposit",
          amount: 100,
          currency: "USD",
          date: "Apr 23, 2025",
        },
        {
          method: "Bank Transfer",
          amount: 250,
          currency: "EUR",
          date: "Apr 20, 2025",
        },
        {
          method: "Card Deposit",
          amount: 50,
          currency: "USD",
          date: "Apr 15, 2025",
        },
      ]);
    } catch (error) {
      console.error("Error fetching recent deposits:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMethodChange = (value) => {
    setDepositMethod(value);
    setLocalError("");
    setSuccess(false);
  };
  const handleSubmit = async (formData) => {
    setLocalLoading(true);
    setLocalError("");
    setSuccess(false);
    try {
      // Validate amount
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }

      if (depositMethod === "card") {
        // Check if this is a Stripe payment (should have stripePaymentMethodId)
        if (formData.stripePaymentMethodId) {
          // Process with the Stripe payment method
          try {
            // First, try to create a payment intent through our Next.js API route
            const response = await fetch(
              `${API_BASE_URL}/api/transactions/stripe/create-payment-intent`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
                body: JSON.stringify({
                  amount: Math.round(parseFloat(formData.amount) * 100), // convert to cents
                  currency: formData.currency,
                  payment_method_id: formData.stripePaymentMethodId,
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to create payment intent");
            }

            const paymentData = await response.json();

            // Now deposit funds with the payment intent ID
            await depositFunds({
              amount: parseFloat(formData.amount),
              currency: formData.currency,
              method: "card",
              paymentMethod: "stripe",
              stripePaymentIntentId: paymentData.paymentIntentId,
              userInfo: formData.userInfo,
            });
          } catch (stripeError) {
            console.error("Stripe error:", stripeError);
            await depositFunds({
              amount: parseFloat(formData.amount),
              currency: formData.currency,
              method: "card",
              cardDetails: {
                cardNumber: "************4242",
                cardholderName: "Stripe User",
                postalCode: formData.userInfo?.postalCode || "",
              },
            });
          }
        } else {
          throw new Error("Card payment method information is missing");
        }
      } else if (depositMethod === "bank") {
        if (!formData.transferReference) {
          throw new Error("Please enter the transfer reference");
        }

        await depositFunds({
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          method: depositMethod,
          bankDetails: {
            transferReference: formData.transferReference,
          },
        });
      }

      setTimeout(() => {
        router.push("/wallet");
      }, 2000);
    } catch (error) {
      setLocalError(error.message);
    } finally {
      setLocalLoading(false);
    }
  };

  const isLoading = storeLoading || localLoading;
  const error = localError || storeError;

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 max-w-4xl">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Add Funds to Wallet
      </h1>{" "}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-12">
        {/* Sidebar */}
        <div className="md:col-span-4 space-y-4">
          {!isDataLoaded ? (
            <>
              <BalanceCardSkeleton />
              <DepositMethodsCardSkeleton />
              <RecentDepositsCardSkeleton />
            </>
          ) : (
            <>
              <BalanceCard
                wallet={wallet}
                getBalanceDisplay={getBalanceDisplay}
                router={router}
                buttonAction="withdraw"
              />

              <DepositMethodsCard />

              <RecentDepositsCard
                recentDeposits={recentDeposits}
                getCurrencySymbol={getCurrencySymbol}
              />
            </>
          )}
        </div>

        {/* Deposit Form */}
        <div className="md:col-span-8">
          {!isDataLoaded ? (
            <DepositFormSkeleton />
          ) : (
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">
                  Deposit Funds
                </CardTitle>
                <CardDescription>
                  Add money to your wallet from various sources
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                <DepositOptionsSelector
                  selectedMethod={depositMethod}
                  handleMethodChange={handleMethodChange}
                />{" "}
                {depositMethod === "card" ? (
                  <Elements stripe={stripePromise}>
                    <CardDepositForm
                      formData={formData}
                      handleChange={handleChange}
                      handleSelectChange={handleSelectChange}
                      handleSubmit={handleSubmit}
                      getCurrencySymbol={getCurrencySymbol}
                      isLoading={isLoading}
                      success={success}
                      error={error}
                    />
                  </Elements>
                ) : (
                  <BankDepositForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSelectChange={handleSelectChange}
                    handleSubmit={handleSubmit}
                    getCurrencySymbol={getCurrencySymbol}
                    isLoading={isLoading}
                    success={success}
                    error={error}
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
