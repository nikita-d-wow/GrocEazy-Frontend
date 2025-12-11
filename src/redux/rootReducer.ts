// src/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import categoryReducer from './reducers/categoryReducer';
import productReducer from './reducers/productReducer';
import { authReducer } from './reducers/authReducers';
// import other reducers as needed (cart, ui, etc.)

const rootReducer = combineReducers({
  category: categoryReducer,
  product: productReducer,
  auth: authReducer,
  // add other reducers here
});

export default rootReducer;

// Required for useSelector typing
export type RootState = ReturnType<typeof rootReducer>;
