// src/routes/AdminRoutes.tsx
import { Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../views/admin/AdminDashboard';
import AdminSupportTickets from '../views/admin/TicketsPage';

export const AdminRoutes = (
  <>
    <Route
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/support-tickets" element={<AdminSupportTickets />} />
    </Route>
  </>
);
