import { combineReducers } from '@reduxjs/toolkit';

// Define dummy reducer BEFORE using it
const dummyReducer = (state = {}) => {
  return state;
};

const rootReducer = combineReducers({
  // add reducers later
  dummy: dummyReducer,
});

export default rootReducer;
