// src/App.tsx
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './views/customer/Dashboard';
import ProductsPage from './views/customer/products/ProductsPage';
import CategoriesPage from './views/customer/categories/CategoriesPage';
import ProductDetailsPage from './views/customer/products/ProductDetailsPage';

import ProductManagement from './views/manager/ProductManagement';
import CategoryManagement from './views/manager/CategoryManagement';
import CustomerLayout from './layouts/CustomerLayout';
import ContactSupport from './views/customer/ContactSupport';
import OrdersPage from './views/customer/OrderPage';
import CartPage from './views/customer/CartPage';

import Login from './views/auth/Login';
import Register from './views/auth/Register';
import Unauthorized from './views/auth/Unauthorized';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './views/admin/AdminDashboard';
import ManagerDashboard from './views/manager/ManagerDashboard';

function App() {
  return (
    <Routes>
      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* CUSTOMER ROUTES */}
      {/* ✅ AUTH */}

      {/* ✅ CUSTOMER */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/contact" element={<ContactSupport />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/customer/dashboard" element={<Dashboard />} />

      {/* MANAGER ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['manager', 'admin']} />}>
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/products" element={<ProductManagement />} />
        <Route path="/manager/categories" element={<CategoryManagement />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
