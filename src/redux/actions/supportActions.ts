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
  SUPPORT_UPDATE_STATUS_REQUEST,
  SUPPORT_UPDATE_STATUS_SUCCESS,
  SUPPORT_UPDATE_STATUS_FAILURE,
  SUPPORT_ASSIGN_MANAGER_REQUEST,
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
      const { data } = await api.post('/api/support', {
        subject,
        description,
      });

      dispatch({
        type: SUPPORT_CREATE_SUCCESS,
        payload: data.ticket as SupportTicket,
      });
    } catch {
      dispatch({
        type: SUPPORT_CREATE_FAILURE,
        payload: 'Failed to create support ticket',
      });
    }
  };

export const fetchMySupportTickets =
  (page = 1, limit = DEFAULT_LIMIT) =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: SUPPORT_FETCH_MY_REQUEST });

    try {
      const { data } = await api.get(
        `/api/support/my?page=${page}&limit=${limit}`
      );

      dispatch({
        type: SUPPORT_FETCH_MY_SUCCESS,
        payload: {
          tickets: data.tickets,
          pagination: data.pagination,
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
  (page = 1, limit = DEFAULT_LIMIT, managerId?: string) =>
  async (dispatch: AppDispatch) => {
    dispatch({ type: SUPPORT_FETCH_ALL_REQUEST });

    try {
      let url = `/api/support?page=${page}&limit=${limit}`;
      if (managerId) {
        url += `&assignedManager=${managerId}`;
      }
      const { data } = await api.get(url);

      const payload: SupportFetchAllPayload = {
        tickets: data.tickets,
        pagination: data.pagination,
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
    dispatch({ type: SUPPORT_UPDATE_STATUS_REQUEST });

    try {
      const { data } = await api.patch(`/api/support/${ticketId}/status`, {
        status,
      });
      dispatch({
        type: SUPPORT_UPDATE_STATUS_SUCCESS,
        payload: data.ticket,
      });
      dispatch(fetchAllSupportTickets());
      dispatch(fetchSupportStats());
    } catch {
      dispatch({
        type: SUPPORT_UPDATE_STATUS_FAILURE,
        payload: 'Failed to update ticket status',
      });
    }
  };

export const deleteSupportTicket =
  (ticketId: string) => async (dispatch: AppDispatch) => {
    dispatch({ type: SUPPORT_DELETE_REQUEST });

    try {
      await api.delete(`/api/support/${ticketId}`);
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
    dispatch({ type: SUPPORT_ASSIGN_MANAGER_REQUEST });

    try {
      const { data } = await api.patch(`/api/support/${ticketId}/assign`, {
        managerId,
      });
      dispatch({
        type: SUPPORT_ASSIGN_MANAGER_SUCCESS,
        payload: data.ticket,
      });
      dispatch(fetchAllSupportTickets());
      dispatch(fetchSupportStats());
    } catch (err: any) {
      dispatch({
        type: SUPPORT_ASSIGN_MANAGER_FAILURE,
        payload: err.response?.data?.message || 'Failed to assign manager',
      });
    }
  };

export const fetchManagersForSupport = () => async (dispatch: AppDispatch) => {
  dispatch({ type: SUPPORT_FETCH_MANAGERS_REQUEST });
  try {
    const { data } = await api.get('/api/users?role=manager');
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
    const { data } = await api.get('/api/support?limit=1000');
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
