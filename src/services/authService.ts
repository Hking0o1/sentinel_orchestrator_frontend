import apiClient from './apiClient';
import type { LoginCredentials, User, AuthResponse } from '@/types/auth'; // We will define these types next

/**
 * ---------------------------------------------------------------------------
 * Authentication Service
 * ---------------------------------------------------------------------------
 * This service handles all API calls related to user authentication,
 * such as logging in, registering, and logging out.
 *
 * It uses the pre-configured `apiClient` which automatically handles
 * JWT token attachment and 401 error responses.
 */

/**
 * Logs in a user with the provided credentials.
 *
 * @param credentials An object containing the user's username and password.
 * @returns A Promise that resolves with an AuthResponse (user data and token).
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Note: Our backend's /token endpoint expects 'x-www-form-urlencoded' data.
    // We create URLSearchParams to format the data correctly.
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);

    // We send the request using our apiClient.
    const response = await apiClient.post<AuthResponse>('/auth/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // The response.data will contain our AuthResponse object (user and access_token)
    return response.data;

  } catch (error: any) {
    // apiClient's response interceptor will handle 401s (like wrong password).
    // This will catch other errors (like server down) and re-throw them.
    console.error('Login Error:', error.response?.data?.detail || error.message);
    throw new Error(error.response?.data?.detail || 'Login failed. Please try again.');
  }
};

/**
 * Fetches the profile for the currently authenticated user.
 * (Example for a future "get my profile" endpoint)
 *
 * @returns A Promise that resolves with the User object.
 */
export const getMyProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/users/me'); // Example endpoint
    return response.data;
  } catch (error: any) {
    console.error('Get Profile Error:', error.response?.data?.detail || error.message);
    throw new Error(error.response?.data?.detail || 'Failed to fetch profile.');
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
   try {
     // This endpoint would be implemented in the backend's auth router
     await apiClient.post('/auth/forgot-password', { email });
   } catch (error: any) {
     console.error('Forgot Password Error:', error.response?.data?.detail || error.message);
     throw new Error(error.response?.data?.detail || 'Failed to send password reset email.');
   }
};


