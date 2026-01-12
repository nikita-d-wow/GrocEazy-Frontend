// src/App.tsx
import { useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { PublicRoutes } from './routes/PublicRoutes';
import { CustomerRoutes } from './routes/CustomerRoutes';
import { ManagerRoutes } from './routes/ManagerRoutes';
import { AdminRoutes } from './routes/AdminRoutes';

import Unauthorized from './views/auth/Unauthorized';
import ScrollToTop from './components/common/ScrollToTop';

import { AUTH_KEYS } from './constants/auth';
import api from './services/api';
import { AUTH_LOGIN_SUCCESS, AUTH_LOGOUT } from './redux/types/authTypes';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(AUTH_KEYS.REFRESH_TOKEN);

    // Scenario: User has Refresh Token but Access Token is missing (or expired/flush)
    if (!token && refreshToken) {
      // Attempt to restore session
      api
        .post('/auth/refresh', { refreshToken })
        .then((res) => {
          const { accessToken, refreshToken: newRefresh, user } = res.data;

          localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, accessToken);
          if (newRefresh) {
            localStorage.setItem(AUTH_KEYS.REFRESH_TOKEN, newRefresh);
          }
          if (user) {
            localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(user));
          }

          dispatch({
            type: AUTH_LOGIN_SUCCESS,
            payload: { accessToken, user },
          });
        })
        .catch((_err) => {
          // Session restoration failed
          // If restore fails, clear everything to be safe
          localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
          localStorage.removeItem(AUTH_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(AUTH_KEYS.USER);
          dispatch({ type: AUTH_LOGOUT });
        });
    }
  }, [dispatch]);

  return (
    <div>
      <Toaster />
      <ScrollToTop />
      <Routes>
        {PublicRoutes}

        {/* PROTECTED ROUTES */}
        {CustomerRoutes}
        {ManagerRoutes}
        {AdminRoutes}

        {/* COMMON ROUTES */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* FALLBACK */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </div>
  );
}

export default App;
