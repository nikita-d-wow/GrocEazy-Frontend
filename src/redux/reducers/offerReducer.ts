import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Offer, OfferState } from '../types/offerTypes';

const initialState: OfferState = {
  offers: [],
  activeOffers: [],
  loading: false,
  error: null,
};

const offerSlice = createSlice({
  name: 'offer',
  initialState,
  reducers: {
    setOffers(state, action: PayloadAction<Offer[]>) {
      state.offers = action.payload;
    },
    setActiveOffers(state, action: PayloadAction<Offer[]>) {
      state.activeOffers = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    addOffer(state, action: PayloadAction<Offer>) {
      state.offers.unshift(action.payload);
    },
    updateOfferInState(state, action: PayloadAction<Offer>) {
      const index = state.offers.findIndex((o) => o._id === action.payload._id);
      if (index !== -1) {
        state.offers[index] = action.payload;
      }
    },
    removeOfferFromState(state, action: PayloadAction<string>) {
      state.offers = state.offers.filter((o) => o._id !== action.payload);
    },
  },
});

export const {
  setOffers,
  setActiveOffers,
  setLoading,
  setError,
  addOffer,
  updateOfferInState,
  removeOfferFromState,
} = offerSlice.actions;

export default offerSlice.reducer;
