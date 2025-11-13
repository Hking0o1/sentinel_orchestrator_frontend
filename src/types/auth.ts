/**
 * ---------------------------------------------------------------------------
 * Authentication Type Definitions
 * ---------------------------------------------------------------------------
 * This file defines the TypeScript interfaces for all data structures
 * related to user authentication, ensuring type safety across our app.
 */

/**
 * Defines the shape of the data required for the login API call.
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Defines the shape of the User object returned from the API.
 * This matches the Pydantic model in our FastAPI backend.
 */
export interface User {
  username: string; // Typically the email
  full_name: string | null;
  role: 'admin' | 'user'; // Enforce specific roles
  disabled: boolean;
}

/**
 * Defines the complete response object from the /auth/token endpoint.
 * This includes the user's details and their access token.
 */
export interface AuthResponse {
  access_token: string;
  token_type: 'bearer';
  user: User; // Embed the user object in the auth response
}
