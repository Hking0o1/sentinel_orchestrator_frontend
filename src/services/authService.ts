import apiClient from './apiClient';
import type { LoginCredentials, User, AuthResponse } from '@/types/auth';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);

    const response = await apiClient.post<AuthResponse>('/auth/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (error: any) {
    const detail = error?.response?.data?.detail;
    const message =
      typeof detail === 'string'
        ? detail
        : detail?.message || 'Login failed. Please try again.';
    throw new Error(message);
  }
};

export const getMyProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  } catch (error: any) {
    const detail = error?.response?.data?.detail;
    const message =
      typeof detail === 'string'
        ? detail
        : detail?.message || 'Failed to fetch profile.';
    throw new Error(message);
  }
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await apiClient.post('/auth/forgot-password', { email });
  } catch (error: any) {
    const detail = error?.response?.data?.detail;
    const message =
      typeof detail === 'string'
        ? detail
        : detail?.message || 'Failed to send password reset email.';
    throw new Error(message);
  }
};
