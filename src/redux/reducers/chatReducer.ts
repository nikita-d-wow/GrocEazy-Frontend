import type { ChatState, ChatActionTypes } from '../types/chat.types';
import {
  FETCH_UNREAD_COUNT_REQUEST,
  FETCH_UNREAD_COUNT_SUCCESS,
  FETCH_UNREAD_COUNT_FAILURE,
  ADD_NOTIFICATION,
  MARK_ROOM_READ,
  CLEAR_NOTIFICATIONS,
} from '../types/chat.types';

const initialState: ChatState = {
  unreadCount: 0,
  notifications: [],
  loading: false,
  error: null,
};

export const chatReducer = (
  state = initialState,
  action: ChatActionTypes
): ChatState => {
  switch (action.type) {
    case FETCH_UNREAD_COUNT_REQUEST:
      return { ...state, loading: true };
    case FETCH_UNREAD_COUNT_SUCCESS:
      return { ...state, loading: false, unreadCount: action.payload };
    case FETCH_UNREAD_COUNT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_NOTIFICATION: {
      // Add if not already there or update the message
      const existing = state.notifications.findIndex(
        (n) => n.room === action.payload.room
      );
      const newNotifications = [...state.notifications];
      if (existing !== -1) {
        newNotifications[existing] = action.payload;
      } else {
        newNotifications.unshift(action.payload);
      }
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: state.unreadCount + 1,
      };
    }
    case MARK_ROOM_READ:
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.room !== action.payload
        ),
      };
    case CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] };
    default:
      return state;
  }
};
