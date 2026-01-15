export const FETCH_UNREAD_COUNT_REQUEST = 'FETCH_UNREAD_COUNT_REQUEST';
export const FETCH_UNREAD_COUNT_SUCCESS = 'FETCH_UNREAD_COUNT_SUCCESS';
export const FETCH_UNREAD_COUNT_FAILURE = 'FETCH_UNREAD_COUNT_FAILURE';

export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
export const MARK_ROOM_READ = 'MARK_ROOM_READ';

export interface IChatMessage {
  _id: string;
  sender: string;
  message: string;
  room: string;
  isAdmin: boolean;
  isBot?: boolean;
  createdAt: Date | string;
}

export interface ChatRoom {
  _id: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  userName?: string;
  userEmail?: string;
}

export interface IChatNotification {
  room: string;
  message: string;
  senderName: string;
  createdAt: string;
  isRead?: boolean;
}

export interface ChatState {
  unreadCount: number;
  notifications: IChatNotification[];
  loading: boolean;
  error: string | null;
}

interface FetchUnreadCountRequestAction {
  type: typeof FETCH_UNREAD_COUNT_REQUEST;
}

interface FetchUnreadCountSuccessAction {
  type: typeof FETCH_UNREAD_COUNT_SUCCESS;
  payload: number;
}

interface FetchUnreadCountFailureAction {
  type: typeof FETCH_UNREAD_COUNT_FAILURE;
  payload: string;
}

interface AddNotificationAction {
  type: typeof ADD_NOTIFICATION;
  payload: IChatNotification;
}

interface MarkRoomReadAction {
  type: typeof MARK_ROOM_READ;
  payload: string;
}

interface ClearNotificationsAction {
  type: typeof CLEAR_NOTIFICATIONS;
}

export type ChatActionTypes =
  | FetchUnreadCountRequestAction
  | FetchUnreadCountSuccessAction
  | FetchUnreadCountFailureAction
  | AddNotificationAction
  | MarkRoomReadAction
  | ClearNotificationsAction;
