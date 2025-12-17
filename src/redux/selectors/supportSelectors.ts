import type { RootState } from '../store';

export const selectSupportMyTickets = (state: RootState) =>
  state.support.myTickets;

export const selectSupportTickets = (state: RootState) => state.support.tickets;

export const selectSupportManagers = (state: RootState) =>
  state.support.managers;

export const selectSupportLoading = (state: RootState) => state.support.loading;

export const selectSupportError = (state: RootState) => state.support.error;
