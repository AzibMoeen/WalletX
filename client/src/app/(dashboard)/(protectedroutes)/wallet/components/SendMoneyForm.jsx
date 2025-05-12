import { useState, useEffect, useCallback } from "react";
import { SendHorizontal, Check, AlertCircle, Search, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

const CURRENCIES = [
  { value: "USD", label: "USD ($)", symbol: "$" },
  { value: "EUR", label: "EUR (€)", symbol: "€" },
  { value: "PKR", label: "PKR (₨)", symbol: "₨" },
];

const SendMoneyForm = ({
  formData,
  handleChange,
  handleSelectChange,
  handleSubmit,
  getCurrencySymbol,
  isLoading,
  success,
  error,
  users,
  isUsersFetched,
  fetchUsers,
  searchUsers,
  user,
  verificationStatus,
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Debounce search function
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }, []);

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (term.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchUsers(term);
          setSearchResults(results || []);
        } catch (err) {
          console.error("Search error:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    [searchUsers]
  );

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Handle user selection
  const handleUserSelection = (selectedUser) => {
    handleSelectChange("recipientId", selectedUser._id);
    handleSelectChange("recipientEmail", selectedUser.email);
    setSearchTerm(`${selectedUser.fullname} (${selectedUser.email})`);
    setShowUserDropdown(false);
  };

  useEffect(() => {
    if (searchTerm.length === 0) {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Send Money</CardTitle>
        <CardDescription>Transfer funds to another wallet</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
        {error && (
          <Alert className="mb-4 md:mb-6 bg-red-50 text-red-800 border-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!verificationStatus.loading && !verificationStatus.isVerified && (
          <Alert className="mb-4 md:mb-6 bg-amber-50 text-amber-800 border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Verification Required</AlertTitle>
            <AlertDescription>
              Your account needs to be verified before sending money. Please
              complete the verification process.
              {verificationStatus.pendingRequests.length > 0 ? (
                <div className="mt-2">
                  <p className="font-medium">Verification Status:</p>
                  <ul className="list-disc ml-5 mt-1 text-sm">
                    {verificationStatus.pendingRequests.map((req, index) => (
                      <li key={index}>
                        {req.type === "passport" ? "Passport" : "Gun License"}{" "}
                        verification:
                        <span
                          className={`ml-1 ${
                            req.status === "pending"
                              ? "text-amber-600"
                              : req.status === "verified"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {req.status.charAt(0).toUpperCase() +
                            req.status.slice(1)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Button
                  variant="link"
                  className="text-amber-800 hover:text-amber-900 p-0 h-auto font-normal"
                  onClick={() => router.push("/verification")}
                >
                  Verify your account now →
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipientSearch" className="text-sm md:text-base">
              Search Recipient by Email
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="recipientSearch"
                type="text"
                placeholder="Search by email address"
                className="pl-10 h-10"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onFocus={() => setShowUserDropdown(true)}
              />

              {showUserDropdown &&
                (searchResults.length > 0 || isSearching) && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="flex items-center justify-center p-4 text-sm text-gray-500">
                        Searching...
                      </div>
                    ) : (
                      <ul className="py-1">
                        {searchResults.map((user) => (
                          <li
                            key={user._id}
                            className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                            onClick={() => handleUserSelection(user)}
                          >
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{user.fullname}</span>
                            <span className="text-gray-500 text-xs">
                              ({user.email})
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
            </div>
            <p className="text-xs text-muted-foreground">
              Start typing to search for users by email address
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm md:text-base">
              Amount
            </Label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">
                    {getCurrencySymbol(formData.currency)}
                  </span>
                </div>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8 h-10"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleSelectChange("currency", value)}
              >
                <SelectTrigger className="w-full sm:w-[110px] sm:ml-2 h-10">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm md:text-base">
              Note (optional)
            </Label>
            <Input
              id="note"
              name="note"
              placeholder="What's this for?"
              value={formData.note}
              onChange={handleChange}
              className="h-10"
            />
          </div>

          <div className="bg-muted p-3 md:p-4 rounded-lg">
            <div className="text-sm font-medium mb-2">Transaction Details</div>
            <div className="space-y-1 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">From</span>
                <span className="truncate max-w-[60%] text-right">
                  {user.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recipient</span>
                <span className="truncate max-w-[60%] text-right">
                  {formData.recipientEmail || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span>
                  {formData.amount
                    ? `${getCurrencySymbol(formData.currency)}${parseFloat(
                        formData.amount
                      ).toFixed(2)} ${formData.currency}`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fee</span>
                <span>No Fee (Demo)</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !verificationStatus.isVerified}
          >
            <>
              <SendHorizontal className="mr-2 h-4 w-4" /> Send Money
            </>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SendMoneyForm;
