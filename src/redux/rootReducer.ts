// src/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import categoryReducer from './reducers/categoryReducer';
import productReducer from './reducers/productReducer';
import { authReducer } from './reducers/authReducers';
import { cartReducer } from './reducers/cartReducer';
import { wishlistReducer } from './reducers/wishlistReducer';
import { supportReducer } from './reducers/supportReducer';
import { orderReducer } from './reducers/orderReducer';
import { userReducer } from './reducers/userReducer';
import { chatReducer } from './reducers/chatReducer';

const rootReducer = combineReducers({
  category: categoryReducer,
  product: productReducer,
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  support: supportReducer,
  order: orderReducer,
  user: userReducer,
  chat: chatReducer,
});

export default rootReducer;

// Required for useSelector typing
export type RootState = ReturnType<typeof rootReducer>;
