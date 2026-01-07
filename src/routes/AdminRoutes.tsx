// src/routes/AdminRoutes.tsx
import { Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminSupportTickets from '../views/admin/TicketsPage';
import AdminTicketDetailsPage from '../views/admin/TicketDetailsPage';
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
      <Route index element={<Navigate to="/admin/users" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
      <Route path="/admin/users" element={<UsersPage />} />
      <Route path="/admin/inventory" element={<Inventory />} />
      <Route path="/admin/tickets" element={<AdminSupportTickets />} />
      <Route path="/admin/support/:id" element={<AdminTicketDetailsPage />} />
    </Route>
  </>
);
