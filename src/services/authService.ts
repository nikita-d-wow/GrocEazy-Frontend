import api from './api';
import type { ILoginResponse } from '../redux/types/authTypes';

export const verifyOtp = async (payload: { email: string; otp: string }) => {
  const response = await api.post<ILoginResponse>('/auth/verify-otp', payload);
  return response.data;
};

export const resendOtp = async (email: string) => {
  const response = await api.post('/auth/resend-otp', { email });
  return response.data;
};
