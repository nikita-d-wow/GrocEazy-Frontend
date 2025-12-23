import type { RootState } from '../store';

export const selectSupportMyTickets = (state: RootState) =>
  state.support.myTickets;

export const selectSupportTickets = (state: RootState) => state.support.tickets;

export const selectSupportManagers = (state: RootState) =>
  state.support.managers;

export const selectSupportLoading = (state: RootState) => state.support.loading;

export const selectSupportError = (state: RootState) => state.support.error;

export const selectSupportRefreshing = (state: RootState) =>
  state.support.refreshing;

export const selectSupportStatsTickets = (state: RootState) =>
  state.support.statsTickets;

export const selectSupportPagination = (state: RootState) =>
  state.support.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 };
