// src/routes/ManagerRoutes.tsx
import { Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import ManagerLayout from '../layouts/ManagerLayout';
import ManagerDashboard from '../views/manager/ManagerDashboard';
import ProductManagement from '../views/manager/ProductManagement';
import CategoryManagement from '../views/manager/CategoryManagement';

export const ManagerRoutes = (
  <>
    <Route
      path="/manager"
      element={
        <ProtectedRoute allowedRoles={['manager', 'admin']}>
          <ManagerLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<ManagerDashboard />} />
      <Route path="products" element={<ProductManagement />} />
      <Route path="categories" element={<CategoryManagement />} />
    </Route>
  </>
);
