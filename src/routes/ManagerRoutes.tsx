import { Route } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import ManagerLayout from '../layouts/ManagerLayout';

import Analytics from '../views/manager/Analytics';
import ProductManagement from '../views/manager/ProductManagement';
import CategoryManagement from '../views/manager/CategoryManagement';
import SupportTickets from '../views/manager/SupportTickets';
import TicketDetails from '../views/manager/TicketDetails';
import OrdersManagement from '../views/manager/OrdersManagement';
import ManagerOrderDetails from '../views/manager/ManagerOrderDetails';
import Inventory from '../views/manager/Inventory';

export const ManagerRoutes = (
  <>
    <Route
      path="/manager"
      element={
        <ProtectedRoute allowedRoles={['manager']}>
          <ManagerLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Analytics />} />

      <Route path="analytics" element={<Analytics />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="orders" element={<OrdersManagement />} />
      <Route path="orders/:id" element={<ManagerOrderDetails />} />
      <Route path="products" element={<ProductManagement />} />
      <Route path="categories" element={<CategoryManagement />} />
      <Route path="support" element={<SupportTickets />} />
      <Route path="support/:id" element={<TicketDetails />} />
    </Route>
  </>
);
