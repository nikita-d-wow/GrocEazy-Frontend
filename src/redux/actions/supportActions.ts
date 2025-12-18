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
  SUPPORT_UPDATE_STATUS_FAILURE,
  SUPPORT_ASSIGN_MANAGER_REQUEST,
  SUPPORT_ASSIGN_MANAGER_FAILURE,
  SUPPORT_DELETE_REQUEST,
  SUPPORT_DELETE_FAILURE,
} from '../types/support.types';

import type { SupportTicket, TicketStatus } from '../types/support.types';

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

export const fetchMySupportTickets = () => async (dispatch: AppDispatch) => {
  dispatch({ type: SUPPORT_FETCH_MY_REQUEST });

  try {
    const { data } = await api.get('/api/support/my');

    dispatch({
      type: SUPPORT_FETCH_MY_SUCCESS,
      payload: data.tickets as SupportTicket[],
    });
  } catch {
    dispatch({
      type: SUPPORT_FETCH_MY_FAILURE,
      payload: 'Failed to fetch support tickets',
    });
  }
};

/* ================= ADMIN / MANAGER ================= */

export const fetchAllSupportTickets = () => async (dispatch: AppDispatch) => {
  dispatch({ type: SUPPORT_FETCH_ALL_REQUEST });

  try {
    const { data } = await api.get('/api/support');

    dispatch({
      type: SUPPORT_FETCH_ALL_SUCCESS,
      payload: {
        tickets: data.tickets,
        managers: data.managers ?? [],
      },
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
      await api.patch(`/api/support/${ticketId}/status`, { status });
      dispatch(fetchAllSupportTickets());
    } catch {
      dispatch({
        type: SUPPORT_UPDATE_STATUS_FAILURE,
        payload: 'Failed to update ticket status',
      });
    }
  };

/* ===== ASSIGN MANAGER (ADMIN) ===== */

export const assignSupportTicketManager =
  (ticketId: string, managerId: string) => async (dispatch: AppDispatch) => {
    dispatch({ type: SUPPORT_ASSIGN_MANAGER_REQUEST });

    try {
      await api.patch(`/api/support/${ticketId}/assign`, { managerId });
      dispatch(fetchAllSupportTickets());
    } catch {
      dispatch({
        type: SUPPORT_ASSIGN_MANAGER_FAILURE,
        payload: 'Failed to assign manager',
      });
    }
  };

/* ===== UNASSIGN ===== */

export const unassignTicket =
  (ticketId: string) => async (dispatch: AppDispatch) => {
    dispatch({ type: SUPPORT_ASSIGN_MANAGER_REQUEST });

    try {
      await api.patch(`/api/support/${ticketId}/assign`, {
        managerId: null,
      });
      dispatch(fetchAllSupportTickets());
    } catch {
      dispatch({
        type: SUPPORT_ASSIGN_MANAGER_FAILURE,
        payload: 'Failed to unassign ticket',
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
