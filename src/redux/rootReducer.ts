import { combineReducers } from '@reduxjs/toolkit';
import categoryReducer from './reducers/categoryReducer';
import productReducer from './reducers/productReducer';

// Define dummy reducer BEFORE using it
const dummyReducer = (state = {}) => {
  return state;
};

const rootReducer = combineReducers({
  category: categoryReducer,
  product: productReducer,
});

export default rootReducer;
