// src/routes/AdminRoutes.tsx
import { Route } from 'react-router-dom';

import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../views/admin/Admindashboard';

export const AdminRoutes = (
  <>
    <Route element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Route>
  </>
);
