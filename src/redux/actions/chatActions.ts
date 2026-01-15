import type { Dispatch } from 'redux';
import api from '../../services/api';
import type { ChatActionTypes, IChatNotification } from '../types/chat.types';
import {
  FETCH_UNREAD_COUNT_REQUEST,
  FETCH_UNREAD_COUNT_SUCCESS,
  FETCH_UNREAD_COUNT_FAILURE,
  ADD_NOTIFICATION,
  MARK_ROOM_READ,
  CLEAR_NOTIFICATIONS,
} from '../types/chat.types';

export const getUnreadCount =
  () => async (dispatch: Dispatch<ChatActionTypes>) => {
    dispatch({ type: FETCH_UNREAD_COUNT_REQUEST });
    try {
      const { data } = await api.get('/chat/unread-count');
      dispatch({ type: FETCH_UNREAD_COUNT_SUCCESS, payload: data.count });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as any)?.response?.data?.message ||
            'Error fetching unread count';
      dispatch({
        type: FETCH_UNREAD_COUNT_FAILURE,
        payload: errorMessage,
      });
    }
  };

export const addNotification =
  (notification: IChatNotification) =>
  (dispatch: Dispatch<ChatActionTypes>) => {
    dispatch({ type: ADD_NOTIFICATION, payload: notification });
  };

export const markMessagesRead =
  (room: string) => async (dispatch: Dispatch<ChatActionTypes>) => {
    try {
      await api.post(`/chat/mark-read/${room}`);
      dispatch({ type: MARK_ROOM_READ, payload: room });
      // Refresh the total unread count
      const { data } = await api.get('/chat/unread-count');
      dispatch({ type: FETCH_UNREAD_COUNT_SUCCESS, payload: data.count });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error marking messages as read:', error);
    }
  };

export const clearNotifications =
  () => (dispatch: Dispatch<ChatActionTypes>) => {
    dispatch({ type: CLEAR_NOTIFICATIONS });
  };
