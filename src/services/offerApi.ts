import api from './api';
import type { Offer } from '../redux/types/offerTypes';

export const getOffers = async (): Promise<Offer[]> => {
  const response = await api.get<Offer[]>('/offers');
  return response.data;
};

export const getActiveOffers = async (): Promise<Offer[]> => {
  const response = await api.get<Offer[]>('/offers/active');
  return response.data;
};

export const createOffer = async (data: any): Promise<Offer> => {
  const response = await api.post<Offer>('/offers', data);
  return response.data;
};

export const updateOffer = async (id: string, data: any): Promise<Offer> => {
  const response = await api.put<Offer>(`/offers/${id}`, data);
  return response.data;
};

export const deleteOffer = async (id: string): Promise<void> => {
  await api.delete(`/offers/${id}`);
};
