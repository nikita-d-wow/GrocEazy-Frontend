// src/routes/PublicRoutes.tsx
import { Route } from 'react-router-dom';
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';
import ForgotPassword from '../views/auth/ForgotPassword';
import ResetPassword from '../views/auth/ResetPassword';

export const PublicRoutes = (
  <>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
  </>
);
