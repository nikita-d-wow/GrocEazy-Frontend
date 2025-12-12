// src/routes/PublicRoutes.tsx
import { Route } from 'react-router-dom';
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';

export const PublicRoutes = (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </>
);
