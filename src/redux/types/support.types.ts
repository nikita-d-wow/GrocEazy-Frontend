// ================= ACTION TYPES =================
export const SUPPORT_CREATE_REQUEST = 'SUPPORT_CREATE_REQUEST';
export const SUPPORT_CREATE_SUCCESS = 'SUPPORT_CREATE_SUCCESS';
export const SUPPORT_CREATE_FAILURE = 'SUPPORT_CREATE_FAILURE';

export const SUPPORT_FETCH_MY_REQUEST = 'SUPPORT_FETCH_MY_REQUEST';
export const SUPPORT_FETCH_MY_SUCCESS = 'SUPPORT_FETCH_MY_SUCCESS';
export const SUPPORT_FETCH_MY_FAILURE = 'SUPPORT_FETCH_MY_FAILURE';

export const SUPPORT_FETCH_ALL_REQUEST = 'SUPPORT_FETCH_ALL_REQUEST';
export const SUPPORT_FETCH_ALL_SUCCESS = 'SUPPORT_FETCH_ALL_SUCCESS';
export const SUPPORT_FETCH_ALL_FAILURE = 'SUPPORT_FETCH_ALL_FAILURE';

export const SUPPORT_UPDATE_STATUS_REQUEST = 'SUPPORT_UPDATE_STATUS_REQUEST';
export const SUPPORT_UPDATE_STATUS_SUCCESS = 'SUPPORT_UPDATE_STATUS_SUCCESS';
export const SUPPORT_UPDATE_STATUS_FAILURE = 'SUPPORT_UPDATE_STATUS_FAILURE';

export const SUPPORT_ASSIGN_MANAGER_REQUEST = 'SUPPORT_ASSIGN_MANAGER_REQUEST';
export const SUPPORT_ASSIGN_MANAGER_SUCCESS = 'SUPPORT_ASSIGN_MANAGER_SUCCESS';
export const SUPPORT_ASSIGN_MANAGER_FAILURE = 'SUPPORT_ASSIGN_MANAGER_FAILURE';

export const SUPPORT_DELETE_REQUEST = 'SUPPORT_DELETE_REQUEST';
export const SUPPORT_DELETE_SUCCESS = 'SUPPORT_DELETE_SUCCESS';
export const SUPPORT_DELETE_FAILURE = 'SUPPORT_DELETE_FAILURE';

// ================= TYPES =================
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface IUser {
  _id: string;
  email: string;
  name?: string;
}

// ================= TICKET =================
export interface SupportTicket {
  _id: string;
  subject: string;
  description: string;
  status: TicketStatus;
  createdAt: string;

  user?: IUser;
  assignedManager?: IUser;
}

// ================= PAGINATION =================
export interface SupportPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ================= PAYLOADS =================
export interface SupportFetchMyPayload {
  tickets: SupportTicket[];
  pagination: SupportPagination;
}

export interface SupportFetchAllPayload {
  tickets: SupportTicket[];
  managers: IUser[];
  pagination: SupportPagination;
}

// ================= STATE =================
export interface SupportState {
  loading: boolean;
  myTickets: SupportTicket[];
  tickets: SupportTicket[];
  managers: IUser[];
  error: string | null;
  pagination: SupportPagination;
}

// ================= ACTION UNION =================
export type SupportActionTypes =
  | { type: typeof SUPPORT_CREATE_REQUEST }
  | { type: typeof SUPPORT_CREATE_SUCCESS; payload: SupportTicket }
  | { type: typeof SUPPORT_CREATE_FAILURE; payload: string }
  | { type: typeof SUPPORT_FETCH_MY_REQUEST }
  | {
      type: typeof SUPPORT_FETCH_MY_SUCCESS;
      payload: SupportFetchMyPayload;
    }
  | { type: typeof SUPPORT_FETCH_MY_FAILURE; payload: string }
  | { type: typeof SUPPORT_FETCH_ALL_REQUEST }
  | {
      type: typeof SUPPORT_FETCH_ALL_SUCCESS;
      payload: SupportFetchAllPayload;
    }
  | { type: typeof SUPPORT_FETCH_ALL_FAILURE; payload: string }
  | { type: typeof SUPPORT_UPDATE_STATUS_REQUEST }
  | { type: typeof SUPPORT_UPDATE_STATUS_SUCCESS; payload: SupportTicket }
  | { type: typeof SUPPORT_UPDATE_STATUS_FAILURE; payload: string }
  | { type: typeof SUPPORT_ASSIGN_MANAGER_REQUEST }
  | { type: typeof SUPPORT_ASSIGN_MANAGER_SUCCESS; payload: SupportTicket }
  | { type: typeof SUPPORT_ASSIGN_MANAGER_FAILURE; payload: string }
  | { type: typeof SUPPORT_DELETE_REQUEST }
  | { type: typeof SUPPORT_DELETE_SUCCESS; payload: string }
  | { type: typeof SUPPORT_DELETE_FAILURE; payload: string };
