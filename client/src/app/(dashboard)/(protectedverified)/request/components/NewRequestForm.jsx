import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  User,
  Search,
  UserCheck,
} from "lucide-react";

export default function NewRequestForm({
  formData,
  handleChange,
  handleSelectChange,
  handleSubmit,
  isLoading,
  error,
  success,
  getCurrencySymbol,
  searchUsers,
  findUserByEmail,
}) {
  const [lookupInProgress, setLookupInProgress] = useState(false);
  const [userLookupResult, setUserLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState(null);

  // Debounce function for email lookups
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }, []);

  // Handle looking up a user by email with debouncing
  const debouncedLookupUser = useCallback(
    debounce(async (email) => {
      if (!email || email.trim().length < 3) {
        setUserLookupResult(null);
        return;
      }

      setLookupInProgress(true);
      setLookupError(null);

      try {
        const user = await findUserByEmail(email);
        setUserLookupResult(user);
        if (!user) {
          setLookupError("No user found with this email address");
        }
      } catch (err) {
        console.error("Error looking up user:", err);
        setLookupError("Error looking up user");
        setUserLookupResult(null);
      } finally {
        setLookupInProgress(false);
      }
    }, 500),
    [findUserByEmail]
  );

  // Effect to trigger user lookup when email changes
  useEffect(() => {
    if (formData.targetEmail) {
      debouncedLookupUser(formData.targetEmail);
    } else {
      setUserLookupResult(null);
      setLookupError(null);
    }
  }, [formData.targetEmail, debouncedLookupUser]);

  // Custom handler for email changes
  const handleEmailChange = (e) => {
    handleChange(e);
    setUserLookupResult(null); // Clear previous lookup when typing
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Request Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>
                Money request sent successfully!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="targetEmail" className="text-sm font-medium">
              Recipient Email
            </label>{" "}
            <div className="relative">
              <Input
                id="targetEmail"
                name="targetEmail"
                value={formData.targetEmail}
                onChange={handleEmailChange}
                placeholder="Enter recipient's email"
                required
                className={lookupError ? "border-red-300 pr-10" : ""}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                {lookupInProgress && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {userLookupResult && (
                  <UserCheck className="h-4 w-4 text-green-500" />
                )}
                {lookupError && !lookupInProgress && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            {lookupInProgress && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Looking up user...</span>
              </div>
            )}
            {lookupError && (
              <div className="text-sm text-red-500">{lookupError}</div>
            )}
            {userLookupResult && (
              <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-md">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">{userLookupResult.fullname}</p>
                    <p className="text-xs text-muted-foreground">
                      {userLookupResult.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <Input
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="currency" className="text-sm font-medium">
                Currency
              </label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleSelectChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="PKR">PKR (₨)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes (Optional)
            </label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add a note for the recipient"
              rows={3}
            />
          </div>
          <Button
            type="submit"
            disabled={
              isLoading ||
              (formData.targetEmail &&
                formData.targetEmail.length > 0 &&
                lookupError)
            }
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Requesting...
              </>
            ) : (
              "Request Money"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
    
  );
}
