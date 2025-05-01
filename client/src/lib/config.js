/**
 * Base URL for API requests
 */
export const API_BASE_URL = "https://monkfish-adapted-properly.ngrok-free.app";

/**
 * Helper function to generate API URLs
 * @param {string} path - The API endpoint path
 * @returns {string} The complete API URL
 */
export function getApiUrl(path) {
  // Remove leading slash if present for consistency
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}