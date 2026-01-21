import api from './api';
import type { Coupon } from '../redux/types/couponTypes';

export const getCoupons = async (): Promise<Coupon[]> => {
  const response = await api.get<Coupon[]>('/coupons');
  return response.data;
};

export const createCoupon = async (data: any): Promise<Coupon> => {
  const response = await api.post<Coupon>('/coupons', data);
  return response.data;
};

export const updateCoupon = async (id: string, data: any): Promise<Coupon> => {
  const response = await api.put<Coupon>(`/coupons/${id}`, data);
  return response.data;
};

export const deleteCoupon = async (id: string): Promise<void> => {
  await api.delete(`/coupons/${id}`);
};

export const validateCoupon = async (params: {
  code: string;
  cartTotal: number;
  items?: any[];
  platform?: string;
}): Promise<any> => {
  const response = await api.post('/coupons/validate', params);
  return response.data;
};
