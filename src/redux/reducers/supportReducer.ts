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

import type { SupportState, SupportActionTypes } from '../types/support.types';

/* ================= INITIAL STATE ================= */

const initialState: SupportState = {
  loading: false,
  myTickets: [], // ✅ customer tickets
  tickets: [], // ✅ admin / manager tickets
  error: null,
};

/* ================= REDUCER ================= */

export function supportReducer(
  state = initialState,
  action: SupportActionTypes
): SupportState {
  switch (action.type) {
    /* ========= REQUESTS ========= */
    case SUPPORT_CREATE_REQUEST:
    case SUPPORT_FETCH_MY_REQUEST:
    case SUPPORT_FETCH_ALL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    /* ========= CREATE ========= */
    case SUPPORT_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        myTickets: [action.payload, ...state.myTickets], // user sees instantly
        tickets: [action.payload, ...state.tickets], // admin sees instantly
      };

    /* ========= FETCH ========= */
    case SUPPORT_FETCH_MY_SUCCESS:
      return {
        ...state,
        loading: false,
        myTickets: action.payload,
      };

    case SUPPORT_FETCH_ALL_SUCCESS:
      return {
        ...state,
        loading: false,
        tickets: action.payload,
      };

    /* ========= FAILURES ========= */
    case SUPPORT_CREATE_FAILURE:
    case SUPPORT_FETCH_MY_FAILURE:
    case SUPPORT_FETCH_ALL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    /* ========= BACKGROUND REQUESTS ========= */
    case SUPPORT_UPDATE_STATUS_REQUEST:
    case SUPPORT_ASSIGN_MANAGER_REQUEST:
    case SUPPORT_DELETE_REQUEST:
      return state;

    /* ========= BACKGROUND FAILURES ========= */
    case SUPPORT_UPDATE_STATUS_FAILURE:
    case SUPPORT_ASSIGN_MANAGER_FAILURE:
    case SUPPORT_DELETE_FAILURE:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}
