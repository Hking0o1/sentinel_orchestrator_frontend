import apiClient from './apiClient';

export interface UpdateProfileData {
  full_name?: string;
  email?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export const updateProfile = async (data: UpdateProfileData) => {
  const response = await apiClient.patch('/auth/me', data);
  return response.data;
};

export const changePassword = async (data: ChangePasswordData) => {
  const response = await apiClient.post('/auth/me/password', data);
  return response.data;
};