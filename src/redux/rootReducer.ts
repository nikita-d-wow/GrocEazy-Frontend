import { combineReducers } from '@reduxjs/toolkit';
import categoryReducer from './reducers/categoryReducer';
import productReducer from './reducers/productReducer';

const rootReducer = combineReducers({
  category: categoryReducer,
  product: productReducer,
});

export default rootReducer;
