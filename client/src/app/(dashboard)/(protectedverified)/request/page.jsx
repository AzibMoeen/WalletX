"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewRequestForm from "./components/NewRequestForm";
import ReceivedRequestsCard from "./components/ReceivedRequestsCard";
import SentRequestsCard from "./components/SentRequestsCard";
import useAuthStore from "@/lib/store/useAuthStore";
import useWalletStore from "@/lib/store/useWalletStore";
import {
  NewRequestFormSkeleton,
  ReceivedRequestsCardSkeleton,
  SentRequestsCardSkeleton,
} from "./components/SkeletonComponents";

export default function RequestPage() {
  const router = useRouter();
  const { isAuthenticated, user, fetchUser } = useAuthStore();
  const {
    requests,
    isLoading: storeLoading,
    error: storeError,
    success: storeSuccess,
    fetchMoneyRequests,
    requestMoney,
    payMoneyRequest,
    formatDate,
    getCurrencySymbol,
    setSuccess: setStoreSuccess,
    clearError: clearStoreError,
  } = useWalletStore();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const [formData, setFormData] = useState({
    targetEmail: "",
    amount: "",
    currency: "USD",
    notes: "",
  });

  const [activeTab, setActiveTab] = useState("new-request");
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  // Ensure user is authenticated first
  useEffect(() => {
    if (!isAuthenticated || !user) {
      fetchUser();
    }
  }, [isAuthenticated, user, fetchUser]);
  // Fetch requests when user is authenticated
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated && user) {
        await fetchMoneyRequests();
        setIsDataLoaded(true);
      }
    };
    loadData();
  }, [isAuthenticated, user, fetchMoneyRequests]);

  // Update requests list when requests state changes
  useEffect(() => {
    if (requests && requests.length > 0 && user) {
      const userId = user._id;

      // Filter requests properly - handle string comparison correctly
      const received = requests.filter(
        (req) =>
          req.recipient &&
          (req.recipient._id === userId || String(req.recipient._id) === userId)
      );

      const sent = requests.filter(
        (req) =>
          req.user &&
          (req.user._id === userId || String(req.user._id) === userId)
      );

      setReceivedRequests(received);
      setSentRequests(sent);
    } else {
      // Reset arrays when no requests are available
      setReceivedRequests([]);
      setSentRequests([]);
    }
  }, [requests, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearLocalError();
    setLocalSuccess(false);
    setStoreSuccess(false);

    try {
      // Validate form
      if (!formData.targetEmail) {
        throw new Error("Please enter the recipient's email");
      }

      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error("Please enter a valid amount");
      }

      // Make request using the store method
      await requestMoney({
        targetEmail: formData.targetEmail,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        notes: formData.notes,
      });

      setLocalSuccess(true);

      // Reset form
      setFormData({
        targetEmail: "",
        amount: "",
        currency: "USD",
        notes: "",
      });

      // Switch to sent requests tab after successful request
      setTimeout(() => {
        setActiveTab("sent-requests");
      }, 1500);
    } catch (err) {
      setLocalError(
        err.message || "An error occurred while sending the request"
      );
      console.error(err);
    }
  };

  const clearLocalError = () => {
    setLocalError(null);
    clearStoreError();
  };

  // Handle paying a money request
  const handlePayRequest = async (requestId) => {
    try {
      await payMoneyRequest(requestId);
    } catch (err) {
      console.error(err);
    }
  };

  // Combine local and store states
  const isLoading = storeLoading || localLoading;
  const error = localError || storeError;
  const success = localSuccess || storeSuccess;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Money Requests</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="new-request">New Request</TabsTrigger>
          <TabsTrigger value="received-requests">Requests Received</TabsTrigger>
          <TabsTrigger value="sent-requests">Requests Sent</TabsTrigger>
        </TabsList>{" "}
        <TabsContent value="new-request">
          {!isDataLoaded ? (
            <NewRequestFormSkeleton />
          ) : (
            <NewRequestForm
              formData={formData}
              handleChange={handleChange}
              handleSelectChange={handleSelectChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
              success={success}
              getCurrencySymbol={getCurrencySymbol}
            />
          )}
        </TabsContent>
        <TabsContent value="received-requests">
          {!isDataLoaded ? (
            <ReceivedRequestsCardSkeleton />
          ) : (
            <ReceivedRequestsCard
              receivedRequests={receivedRequests}
              formatDate={formatDate}
              getCurrencySymbol={getCurrencySymbol}
              handlePayRequest={handlePayRequest}
            />
          )}
        </TabsContent>
        <TabsContent value="sent-requests">
          {!isDataLoaded ? (
            <SentRequestsCardSkeleton />
          ) : (
            <SentRequestsCard
              sentRequests={sentRequests}
              formatDate={formatDate}
              getCurrencySymbol={getCurrencySymbol}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
