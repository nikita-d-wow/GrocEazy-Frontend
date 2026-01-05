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

import WishlistPage from '../views/customer/WishlistPage';
import ProfilePage from '../views/customer/ProfilePage';
import OrderDetails from '../views/customer/OrderDetails';
import MyTickets from '../views/customer/MyTickets';
import TicketDetails from '../views/customer/TicketDetails';
import ProtectedRoute from './ProtectedRoute';
import SetPassword from '../views/auth/SetPassword';
import ForgotPassword from '../views/auth/ForgotPassword';
import ResetPassword from '../views/auth/ResetPassword';
import TermsPage from '../views/customer/TermsPage';
import PrivacyPolicy from '../views/customer/PrivacyPolicy';

export const CustomerRoutes = (
  <>
    <Route element={<CustomerLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route
        path="/privacy-policy"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <PrivacyPolicy />
          </ProtectedRoute>
        }
      />
      <Route path="/contact" element={<ContactSupport />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/address" element={<CheckoutAddress />} />

      <Route path="/wishlist" element={<WishlistPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={['customer']}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />

      <Route path="/customer/tickets" element={<MyTickets />} />
      <Route path="/customer/tickets/:id" element={<TicketDetails />} />
    </Route>

    <Route
      path="/set-password"
      element={
        <ProtectedRoute allowedRoles={['customer', 'manager', 'admin']}>
          <SetPassword />
        </ProtectedRoute>
      }
    />

    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />
  </>
);
