import {
  type UserState,
  type UserActionTypes,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_USER_DETAILS_REQUEST,
  FETCH_USER_DETAILS_SUCCESS,
  FETCH_USER_DETAILS_FAILURE,
  UPDATE_USER_STATUS_REQUEST,
  UPDATE_USER_STATUS_SUCCESS,
  UPDATE_USER_STATUS_FAILURE,
} from '../types/userTypes';

const initialState: UserState = {
  users: [],
  pagination: null,
  currentUser: null,
  loading: false,
  error: null,
};

export const userReducer = (
  state = initialState,
  action: UserActionTypes
): UserState => {
  switch (action.type) {
    // FETCH USERS
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload.users,
        pagination: action.payload.pagination,
      };
    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // FETCH DETAILS
    case FETCH_USER_DETAILS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_USER_DETAILS_SUCCESS:
      return { ...state, loading: false, currentUser: action.payload };
    case FETCH_USER_DETAILS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // UPDATE STATUS
    case UPDATE_USER_STATUS_REQUEST:
      return { ...state, loading: true, error: null };
    case UPDATE_USER_STATUS_SUCCESS: {
      // Backend might return { user: ... } or just the user object.
      // We normalize this here.
      const updatedUser = (action.payload as any).user || action.payload;

      return {
        ...state,
        loading: false,
        // Update user in the list
        users: state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        ),
        // Update currentUser if it matches
        currentUser:
          state.currentUser && state.currentUser._id === updatedUser._id
            ? updatedUser
            : state.currentUser,
      };
    }
    case UPDATE_USER_STATUS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
