// src/routes/CustomerRoutes.tsx
import { Route } from 'react-router-dom';
import CheckoutAddress from '../views/customer/CheckoutAddress';
import CustomerLayout from '../layouts/CustomerLayout';
import Dashboard from '../views/customer/Dashboard';
import ContactSupport from '../views/customer/ContactSupport';
import OrdersPage from '../views/customer/OrderPage';
import CartPage from '../views/customer/CartPage';
import Checkout from '../views/customer/Checkout';
import ProductsPage from '../views/customer/products/ProductsPage';
import ProductDetailsPage from '../views/customer/products/ProductDetailsPage';
import CategoriesPage from '../views/customer/categories/CategoriesPage';
import WishlistPage from '../views/customer/WishlistPage';
import OrderDetails from '../views/customer/OrderDetails';
import MyTickets from '../views/customer/MyTickets';
export const CustomerRoutes = (
  <>
    <Route element={<CustomerLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="/contact" element={<ContactSupport />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/address" element={<CheckoutAddress />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/customer/tickets" element={<MyTickets />} />
    </Route>
  </>
);
