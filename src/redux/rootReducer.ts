// src/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import categoryReducer from './reducers/categoryReducer';
import productReducer from './reducers/productReducer';
import { authReducer } from './reducers/authReducers';
import { cartReducer } from './reducers/cartReducer';
import { supportReducer } from './reducers/supportReducer';
import { orderReducer } from './reducers/orderReducer';
// import other reducers as needed (cart, ui, etc.)

const rootReducer = combineReducers({
  category: categoryReducer,
  product: productReducer,
  auth: authReducer,
  cart: cartReducer,
  support: supportReducer,
  order: orderReducer,
  // add other reducers here
});

export default rootReducer;

// Required for useSelector typing
export type RootState = ReturnType<typeof rootReducer>;
