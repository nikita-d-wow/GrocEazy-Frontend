import type { RootState } from '../store';

export const selectSupportTickets = (state: RootState) =>
  state.support.myTickets;

export const selectSupportLoading = (state: RootState) => state.support.loading;

export const selectSupportError = (state: RootState) => state.support.error;
