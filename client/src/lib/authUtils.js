/**
 * Utility to make authenticated API requests that include credentials (cookies)
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options
 * @returns {Promise} - Fetch promise with parsed JSON response or error
 */
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh-token`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (response.ok) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};
