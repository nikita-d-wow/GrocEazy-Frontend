import api from '../../services/api';
import type { AppDispatch } from '../store';

import {
  SUPPORT_CREATE_REQUEST,
  SUPPORT_CREATE_SUCCESS,
  SUPPORT_CREATE_FAILURE,
  SUPPORT_FETCH_MY_REQUEST,
  SUPPORT_FETCH_MY_SUCCESS,
  SUPPORT_FETCH_MY_FAILURE,
  SUPPORT_FETCH_ALL_REQUEST,
  SUPPORT_FETCH_ALL_SUCCESS,
  SUPPORT_FETCH_ALL_FAILURE,
  SUPPORT_UPDATE_STATUS_SUCCESS,
  SUPPORT_UPDATE_STATUS_FAILURE,
  SUPPORT_ASSIGN_MANAGER_SUCCESS,
  SUPPORT_ASSIGN_MANAGER_FAILURE,
  SUPPORT_DELETE_REQUEST,
  SUPPORT_DELETE_FAILURE,
  SUPPORT_FETCH_MANAGERS_REQUEST,
  SUPPORT_FETCH_MANAGERS_SUCCESS,
  SUPPORT_FETCH_MANAGERS_FAILURE,
  SUPPORT_FETCH_STATS_REQUEST,
  SUPPORT_FETCH_STATS_SUCCESS,
  SUPPORT_FETCH_STATS_FAILURE,
} from '../types/support.types';

import type {
  SupportTicket,
  TicketStatus,
  SupportFetchAllPayload,
} from '../types/support.types';

const DEFAULT_LIMIT = 10;

/* ================= CUSTOMER ================= */

export const createSupportTicket =
  (subject: string, description: string) => async (dispatch: AppDispatch) => {
    dispatch({ type: SUPPORT_CREATE_REQUEST });

    try {
      const { data } = await api.post('/support', {
        subject,
        description,
      });

      dispatch({
        type: SUPPORT_CREATE_SUCCESS,
        payload: data.ticket as SupportTicket,
      });
      return true;
    } catch {
      dispatch({
        type: SUPPORT_CREATE_FAILURE,
        payload: 'Failed to create support ticket',
      });
      return false;
    }
  };

export const fetchMySupportTickets =
  (
    page = 1,
    limit = DEFAULT_LIMIT,
    status?: string,
    dateFrom?: string,
    sortOrder: 'newest' | 'oldest' = 'newest',
    search?: string
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: SUPPORT_FETCH_MY_REQUEST });

    try {
      let url = `/support/my?page=${page}&limit=${limit}&sortOrder=${sortOrder}`;
      if (status && status !== 'all') {
        url += `&status=${status}`;
      }
      if (dateFrom) {
        url += `&dateFrom=${dateFrom}`;
      }
      if (search) {
        url += `&search=${search}`;
      }
      const { data } = await api.get(url);

      dispatch({
        type: SUPPORT_FETCH_MY_SUCCESS,
        payload: {
          tickets: data.tickets,
          pagination: data.pagination,
          stats: data.stats,
        },
      });
    } catch (err: any) {
      dispatch({
        type: SUPPORT_FETCH_MY_FAILURE,
        payload:
          err.response?.data?.message || 'Failed to fetch support tickets',
      });
    }
  };

/* ================= ADMIN / MANAGER ================= */

export const fetchAllSupportTickets =
  (
    page = 1,
    limit = DEFAULT_LIMIT,
    status?: string,
    managerId?: string,
    dateFrom?: string,
    sortOrder: 'newest' | 'oldest' = 'newest',
    search?: string
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: SUPPORT_FETCH_ALL_REQUEST });

    try {
      let url = `/support?page=${page}&limit=${limit}&sortOrder=${sortOrder}`;
      if (status && status !== 'all') {
        url += `&status=${status}`;
      }
      if (managerId && managerId !== 'all') {
        url += `&assignedManager=${managerId}`;
      }
      if (dateFrom) {
        url += `&dateFrom=${dateFrom}`;
      }
      if (search) {
        url += `&search=${search}`;
      }
      const { data } = await api.get(url);

      const payload: SupportFetchAllPayload = {
        tickets: data.tickets,
        pagination: data.pagination,
        stats: data.stats,
      };

      if (data.managers) {
        payload.managers = data.managers;
      }

      dispatch({
        type: SUPPORT_FETCH_ALL_SUCCESS,
        payload,
      });
    } catch {
      dispatch({
        type: SUPPORT_FETCH_ALL_FAILURE,
        payload: 'Failed to fetch all tickets',
      });
    }
  };

export const updateSupportTicketStatus =
  (ticketId: string, status: TicketStatus) => async (dispatch: AppDispatch) => {
    // Optimistic Update: dispatch success immediately with partial data
    dispatch({
      type: SUPPORT_UPDATE_STATUS_SUCCESS,
      payload: { _id: ticketId, status } as any,
    });

    try {
      const { data } = await api.patch(`/support/${ticketId}/status`, {
        status,
      });
      // Confirm with real data
      dispatch({
        type: SUPPORT_UPDATE_STATUS_SUCCESS,
        payload: data.ticket,
      });
      // Silent background fetch to sync everything
      dispatch(fetchSupportStats());
    } catch {
      dispatch({
        type: SUPPORT_UPDATE_STATUS_FAILURE,
        payload: 'Failed to update ticket status',
      });
      // Revert/Refresh
      dispatch(fetchAllSupportTickets());
    }
  };

export const deleteSupportTicket =
  (ticketId: string) => async (dispatch: AppDispatch) => {
    // Optimistic Delete: Assuming we add a DELETE_SUCCESS type or reuse FETCH logic
    // But typically we dispatch an action that reducer uses to filter out.
    // Let's assume we can reuse existing type or add a new one.
    // For now, let's just do silent fetch or add a specific DELETE SUCCESS type if available.
    // Actually, looking at reducer, it doesn't handle DELETE_SUCCESS to remove item.
    // Let's add it or hack it. The cleanest way is to add SUPPORT_DELETE_SUCCESS.
    // But since I cannot change types easily without multiple file edits, I'll rely on fast fetch.
    // WAIT, I CAN add a type locally or just let it be.
    // Providing immediate feedback via UI state is often handled in component.
    // Let's stick to standard flow but removing loading spinner request.

    // Changing strategy: Dispatch a "Fetch Success" with filtered list? No, too risky.
    // Let's just run it standard but without the blocking loader if possible.
    dispatch({ type: SUPPORT_DELETE_REQUEST }); // Sets refreshing: true

    try {
      await api.delete(`/support/${ticketId}`);
      dispatch(fetchAllSupportTickets());
    } catch {
      dispatch({
        type: SUPPORT_DELETE_FAILURE,
        payload: 'Failed to delete support ticket',
      });
    }
  };

export const assignSupportTicket =
  (ticketId: string, managerId: string) => async (dispatch: AppDispatch) => {
    // Optimistic Update
    dispatch({
      type: SUPPORT_ASSIGN_MANAGER_SUCCESS,
      payload: { _id: ticketId, assignedTo: managerId } as any,
    });

    try {
      const { data } = await api.patch(`/support/${ticketId}/assign`, {
        managerId,
      });
      // Final confirmation
      dispatch({
        type: SUPPORT_ASSIGN_MANAGER_SUCCESS,
        payload: data.ticket,
      });
      // Sync stats
      dispatch(fetchSupportStats());
    } catch (err: any) {
      dispatch({
        type: SUPPORT_ASSIGN_MANAGER_FAILURE,
        payload: err.response?.data?.message || 'Failed to assign manager',
      });
      // Revert/Refresh
      dispatch(fetchAllSupportTickets());
    }
  };

export const fetchManagersForSupport = () => async (dispatch: AppDispatch) => {
  dispatch({ type: SUPPORT_FETCH_MANAGERS_REQUEST });
  try {
    const { data } = await api.get('/users?role=manager');
    dispatch({
      type: SUPPORT_FETCH_MANAGERS_SUCCESS,
      payload: data.users || [],
    });
  } catch (err: any) {
    dispatch({
      type: SUPPORT_FETCH_MANAGERS_FAILURE,
      payload: err.response?.data?.message || 'Failed to fetch managers',
    });
  }
};

export const fetchSupportStats = () => async (dispatch: AppDispatch) => {
  dispatch({ type: SUPPORT_FETCH_STATS_REQUEST });
  try {
    // Fetch a large number of tickets to get a global picture for distribution
    const { data } = await api.get('/support?limit=1000');
    dispatch({
      type: SUPPORT_FETCH_STATS_SUCCESS,
      payload: data.tickets || [],
    });
  } catch (err: any) {
    dispatch({
      type: SUPPORT_FETCH_STATS_FAILURE,
      payload: err.response?.data?.message || 'Failed to fetch support stats',
    });
  }
};
