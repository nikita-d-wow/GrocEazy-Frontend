// src/routes/ManagerRoutes.tsx
import { Route } from 'react-router-dom';

import ManagerLayout from '../layouts/ManagerLayout';
import Analytics from '../views/manager/Analytics';
import ProductManagement from '../views/manager/ProductManagement';
import CategoryManagement from '../views/manager/CategoryManagement';

export const ManagerRoutes = (
  <>
    <Route path="/manager" element={<ManagerLayout />}>
      <Route index element={<Analytics />} />
      <Route path="products" element={<ProductManagement />} />
      <Route path="categories" element={<CategoryManagement />} />
    </Route>
  </>
);
