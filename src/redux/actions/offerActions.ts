import type { AxiosError } from 'axios';
import type { AppDispatch } from '../store';
import * as offerApi from '../../services/offerApi';
import {
  setOffers,
  setActiveOffers,
  setLoading,
  setError,
  addOffer,
  updateOfferInState,
  removeOfferFromState,
} from '../reducers/offerReducer';

export const fetchOffers = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const data = await offerApi.getOffers();
    dispatch(setOffers(data));
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    dispatch(setError(err.response?.data?.message || 'Failed to fetch offers'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchActiveOffers = () => async (dispatch: AppDispatch) => {
  try {
    const data = await offerApi.getActiveOffers();
    dispatch(setActiveOffers(data));
  } catch (error) {
    // Silently fail or log
  }
};

export const createOffer = (data: any) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const offer = await offerApi.createOffer(data);
    dispatch(addOffer(offer));
    return offer;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    dispatch(setError(err.response?.data?.message || 'Failed to create offer'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateOffer =
  (id: string, data: any) => async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const offer = await offerApi.updateOffer(id, data);
      dispatch(updateOfferInState(offer));
      return offer;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      dispatch(
        setError(err.response?.data?.message || 'Failed to update offer')
      );
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteOffer = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await offerApi.deleteOffer(id);
    dispatch(removeOfferFromState(id));
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    dispatch(setError(err.response?.data?.message || 'Failed to delete offer'));
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};
