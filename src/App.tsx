// src/App.tsx
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './views/customer/Dashboard';
import ProductsPage from './views/customer/products/ProductsPage';
import CategoriesPage from './views/customer/categories/CategoriesPage';
import ProductDetailsPage from './views/customer/products/ProductDetailsPage';

import ProductManagement from './views/manager/ProductManagement';
import CategoryManagement from './views/manager/CategoryManagement';

import Login from './views/auth/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* CUSTOMER ROUTES */}
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/customer/dashboard" element={<Dashboard />} />

        {/* MANAGER ROUTES */}
        <Route path="/manager/products" element={<ProductManagement />} />
        <Route path="/manager/categories" element={<CategoryManagement />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
