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

import type { SupportState, SupportActionTypes } from '../types/support.types';

const initialState: SupportState = {
  loading: false,
  refreshing: false,
  myTickets: [],
  tickets: [],
  statsTickets: [],
  stats: null,
  managers: [],
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
};

export function supportReducer(
  state = initialState,
  action: SupportActionTypes
): SupportState {
  switch (action.type) {
    case SUPPORT_CREATE_REQUEST:
    case SUPPORT_FETCH_MY_REQUEST:
    case SUPPORT_FETCH_ALL_REQUEST:
    case SUPPORT_FETCH_STATS_REQUEST:
    case SUPPORT_FETCH_MANAGERS_REQUEST: {
      const isInitialFetch =
        state.tickets.length === 0 && action.type === SUPPORT_FETCH_ALL_REQUEST;
      return {
        ...state,
        loading: isInitialFetch || action.type !== SUPPORT_FETCH_ALL_REQUEST,
        refreshing:
          !isInitialFetch && action.type === SUPPORT_FETCH_ALL_REQUEST,
        error: null,
      };
    }

    case SUPPORT_FETCH_MANAGERS_SUCCESS:
      return {
        ...state,
        refreshing: false,
        managers: action.payload,
      };

    case SUPPORT_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        refreshing: false,
        myTickets: [action.payload, ...state.myTickets],
      };

    case SUPPORT_FETCH_MY_SUCCESS:
      return {
        ...state,
        loading: false,
        myTickets: action.payload.tickets,
        pagination: action.payload.pagination,
        stats: action.payload.stats || null,
      };

    case SUPPORT_FETCH_ALL_SUCCESS:
      return {
        ...state,
        loading: false,
        refreshing: false,
        tickets: action.payload.tickets,
        pagination: action.payload.pagination,
        ...(action.payload.managers && { managers: action.payload.managers }),
        stats: action.payload.stats || null,
      };

    case SUPPORT_CREATE_FAILURE:
    case SUPPORT_FETCH_MY_FAILURE:
    case SUPPORT_FETCH_ALL_FAILURE:
    case SUPPORT_FETCH_MANAGERS_FAILURE:
      return {
        ...state,
        loading: false,
        refreshing: false,
        error: action.payload,
      };

    case SUPPORT_UPDATE_STATUS_REQUEST:
    case SUPPORT_ASSIGN_MANAGER_REQUEST:
    case SUPPORT_DELETE_REQUEST:
      return { ...state, loading: false, refreshing: true, error: null };

    case SUPPORT_UPDATE_STATUS_SUCCESS:
    case SUPPORT_ASSIGN_MANAGER_SUCCESS:
      return {
        ...state,
        loading: false,
        refreshing: false,
        tickets: state.tickets.map((t) =>
          t._id === action.payload._id ? { ...t, ...action.payload } : t
        ), // Merge payload to keep existing fields if payload is partial
      };

    case SUPPORT_FETCH_STATS_SUCCESS:
      return {
        ...state,
        refreshing: false,
        statsTickets: action.payload,
      };

    case SUPPORT_UPDATE_STATUS_FAILURE:
    case SUPPORT_ASSIGN_MANAGER_FAILURE:
    case SUPPORT_DELETE_FAILURE:
    case SUPPORT_FETCH_STATS_FAILURE:
      return {
        ...state,
        refreshing: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
