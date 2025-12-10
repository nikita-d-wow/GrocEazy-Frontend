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

//import Login from './views/auth/Login';

function App() {
  return (
    <Routes>
      {/* ✅ AUTH */}

      {/* ✅ CUSTOMER */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/contact" element={<ContactSupport />} />
      </Route>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/customer/dashboard" element={<Dashboard />} />
      {/* ✅ MANAGER (CRUD) */}
      <Route path="/manager/products" element={<ProductManagement />} />
      <Route path="/manager/categories" element={<CategoryManagement />} />
    </Routes>
  );
}

export default App;
