// src/routes/CustomerRoutes.tsx
import { Route } from 'react-router-dom';

import CustomerLayout from '../layouts/CustomerLayout';
import Dashboard from '../views/customer/Dashboard';
import ContactSupport from '../views/customer/ContactSupport';
import OrdersPage from '../views/customer/OrderPage';
import CartPage from '../views/customer/CartPage';
import Checkout from '../views/customer/Checkout';
import ProductsPage from '../views/customer/products/ProductsPage';
import ProductDetailsPage from '../views/customer/products/ProductDetailsPage';
import CategoriesPage from '../views/customer/categories/CategoriesPage';

export const CustomerRoutes = (
  <>
    <Route element={<CustomerLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="/contact" element={<ContactSupport />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />

      {/* SHOP ROUTES */}
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
    </Route>
  </>
);
