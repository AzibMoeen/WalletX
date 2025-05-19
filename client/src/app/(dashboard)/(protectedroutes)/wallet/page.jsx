"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BalanceCard from "./components/BalanceCard";
import RecentRecipients from "./components/RecentRecipients";
import SendMoneyForm from "./components/SendMoneyForm";
import ReceiveMoneyCard from "./components/ReceiveMoneyCard";
import useWalletStore from "@/lib/store/useWalletStore";
import {
  BalanceCardSkeleton,
  RecentRecipientsSkeleton,
  SendMoneyFormSkeleton,
  ReceiveMoneyCardSkeleton,
} from "./components/SkeletonComponents";

export default function WalletPage() {
  const router = useRouter();
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const {
    wallet,
    isWalletLoaded,
    userProfile,
    users,
    formData,
    isLoading,
    success,
    error,
    verificationStatus,
    isUsersFetched,

    setFormData,
    resetForm,
    setSuccess,

    transferFunds,
    fetchUsers,
    searchUsers,
    initializeWallet,

    getBalanceDisplay,
    getCurrencySymbol,
  } = useWalletStore();

  useEffect(() => {
    const loadData = async () => {
      if (!isWalletLoaded) {
        await initializeWallet();
      }
      setIsDataLoaded(true);
    };
    loadData();
  }, [initializeWallet, isWalletLoaded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("transfer", false);

    try {
      // Validate form
      if (!formData.recipientId && !formData.recipientEmail) {
        throw new Error("Please select a recipient");
      }

      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }

      // Check if user has sufficient balance
      const balance =
        wallet.balances?.find((b) => b.currency === formData.currency)
          ?.amount || 0;
      if (parseFloat(formData.amount) > balance) {
        throw new Error("Insufficient funds");
      }

      // Send money using Zustand action
      await transferFunds({
        recipientId: formData.recipientId,
        recipientEmail: formData.recipientEmail,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        notes: formData.note || "Transfer",
      });

      // Reset form data
      resetForm();

      // Redirect to wallet page after success
      setTimeout(() => {
        router.push("/wallet");
      }, 2000);
    } catch (error) {
      console.error("Send money error:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 md:py-6 max-w-4xl">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Send & Receive Money
      </h1>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-6">
          <TabsTrigger value="send">Send Money</TabsTrigger>
          <TabsTrigger value="receive">Receive Money</TabsTrigger>
        </TabsList>{" "}
        <TabsContent value="send">
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-4 space-y-4">
              {!isDataLoaded ? (
                <>
                  <BalanceCardSkeleton />
                  <RecentRecipientsSkeleton />
                </>
              ) : (
                <>
                  <BalanceCard
                    wallet={wallet}
                    getBalanceDisplay={getBalanceDisplay}
                    buttonAction="deposit"
                  />
                  <RecentRecipients />
                </>
              )}
            </div>

            {/* Send Money Form */}
            <div className="md:col-span-8">
              {!isDataLoaded ? (
                <SendMoneyFormSkeleton />
              ) : (
                <SendMoneyForm
                  formData={formData}
                  handleChange={handleChange}
                  handleSelectChange={handleSelectChange}
                  handleSubmit={handleSubmit}
                  getCurrencySymbol={getCurrencySymbol}
                  isLoading={isLoading}
                  success={success}
                  error={error}
                  users={users}
                  isUsersFetched={isUsersFetched}
                  fetchUsers={fetchUsers}
                  searchUsers={searchUsers}
                  user={userProfile}
                  verificationStatus={verificationStatus}
                />
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="receive">
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-12">
            {/* Balance Cards */}
            <div className="md:col-span-4 space-y-4">
              {!isDataLoaded ? (
                <BalanceCardSkeleton />
              ) : (
                <BalanceCard
                  wallet={wallet}
                  getBalanceDisplay={getBalanceDisplay}
                  buttonAction="transactions"
                />
              )}
            </div>

            {/* Receive Money */}
            <div className="md:col-span-8">
              {!isDataLoaded ? (
                <ReceiveMoneyCardSkeleton />
              ) : (
                <ReceiveMoneyCard wallet={wallet} user={userProfile} />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
