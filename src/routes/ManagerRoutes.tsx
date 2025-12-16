import { Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import ManagerLayout from '../layouts/ManagerLayout';

import ManagerDashboard from '../views/manager/ManagerDashboard';
import ProductManagement from '../views/manager/ProductManagement';
import CategoryManagement from '../views/manager/CategoryManagement';
import SupportTickets from '../views/manager/SupportTickets';
import UsersPage from '../views/admin/users/UsersPage';

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
      <Route path="users" element={<UsersPage />} />

      {/* ✅ SUPPORT MANAGEMENT */}
      <Route path="support" element={<SupportTickets />} />
    </Route>
  </>
);
