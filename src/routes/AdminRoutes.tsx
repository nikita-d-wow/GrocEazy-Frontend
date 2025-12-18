// src/routes/AdminRoutes.tsx
import { Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminSupportTickets from '../views/admin/TicketsPage';
import UsersPage from '../views/admin/users/UsersPage';
import Inventory from '../views/manager/Inventory'; // Using same dummy inventory

export const AdminRoutes = (
  <>
    <Route
      element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<UsersPage />} />
      <Route path="/admin" element={<UsersPage />} />
      <Route path="/admin/users" element={<UsersPage />} />
      <Route path="/admin/inventory" element={<Inventory />} />
      <Route path="/admin/tickets" element={<AdminSupportTickets />} />
    </Route>
  </>
);
