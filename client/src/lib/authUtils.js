/**
 * Utility to make authenticated API requests that include credentials (cookies)
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise} - Fetch promise with parsed JSON response or error
 */
import { API_BASE_URL } from "./config";
export const fetchWithAuth = async (url, options = {}) => {
  // Add credentials to include cookies in the request
  const fetchOptions = {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "Content-Type": options.headers?.["Content-Type"] || "application/json",
    },
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Attempt to parse JSON response (even for error responses)
    const data = await response.json().catch(() => ({}));

    // If unauthorized and we have a refresh token, try to refresh
    if (response.status === 401) {
      const refreshed = await refreshAccessToken();

      // If token refresh was successful, retry the original request
      if (refreshed) {
        return fetchWithAuth(url, options);
      }

      // If refresh failed, throw an error with the original response data
      throw new Error(data.message || "Authentication failed");
    }

    // For other non-OK responses, throw an error with the response data
    if (!response.ok) {
      throw new Error(
        data.message || `Request failed with status ${response.status}`
      );
    }

    return { data, response };
  } catch (error) {
    // Rethrow with a clean error message
    if (
      error.name === "TypeError" &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
};

/**
 * Utility to refresh access token using refresh token in cookie
 * @returns {Promise<boolean>} - Success status
 */
export const refreshAccessToken = async () => {
  try {
    // Check if user has explicitly logged out, if using browser
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("loggedOut") === "true"
    ) {
      console.log("Not refreshing token - user has explicitly logged out");
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      return true;
    }

    // If refresh token is invalid or expired, clear any stored auth state
    if (response.status === 401) {
      // Clear any stored auth state
      if (typeof window !== "undefined") {
        // Clear any stored auth state in localStorage if needed
        localStorage.removeItem("auth-storage");
        // Mark as logged out to prevent auto-login attempts
        localStorage.setItem("loggedOut", "true");
      }
    }

    return false;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

/**
 * Utility to check if a token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} - Whether the token is expired
 */
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
};

/**
 * Utility to handle token refresh and retry logic
 * @param {Function} apiCall - The API call function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise} - The API call result
 */
export const withTokenRefresh = async (apiCall, maxRetries = 1) => {
  // Check if user has explicitly logged out, if using browser
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("loggedOut") === "true"
  ) {
    console.log(
      "Not making authenticated call - user has explicitly logged out"
    );
    throw new Error("Authentication failed - user is logged out");
  }

  let retries = 0;

  while (retries <= maxRetries) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.message === "Authentication failed" && retries < maxRetries) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          retries++;
          continue;
        }
      }
      throw error;
    }
  }
};
