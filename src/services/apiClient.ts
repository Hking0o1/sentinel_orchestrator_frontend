import axios from 'axios';

// Get the backend API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/api/v1';

/**
 * Creates a pre-configured instance of axios.
 * This instance will be used for all API calls in the application.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * ---------------------------------------------------------------------------
 * Axios Request Interceptor
 * ---------------------------------------------------------------------------
 * This interceptor automatically attaches the JWT (auth token) to the
 * 'Authorization' header of every outgoing request if the token exists
 * in localStorage.
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (this is set by AuthContext)
    const token = localStorage.getItem('authToken');

    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle any request errors
    return Promise.reject(error);
  }
);

/**
 * ---------------------------------------------------------------------------
 * Axios Response Interceptor
 * ---------------------------------------------------------------------------
 * This interceptor checks for 401 (Unauthorized) responses.
 * This is the standard "Your token is invalid or has expired" error.
 * If this happens, it automatically logs the user out and redirects
 * them to the login page.
 */
apiClient.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Check if the error is a 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Clear the invalid token and user data from storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');

      // Redirect the user to the login page
      // We use window.location.href to force a full page reload,
      // which clears all application state.
      window.location.href = '/login';

      // You could also dispatch a custom event here to notify the app
      // window.dispatchEvent(new Event('auth-error'));
    }

    // Return the error so that the calling function (e.g., in React Query)
    // can still handle it (e.g., show a toast notification).
    return Promise.reject(error);
  }
);

export default apiClient;

