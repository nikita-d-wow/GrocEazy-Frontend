import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import { PublicRoutes } from './routes/PublicRoutes';
import { CustomerRoutes } from './routes/CustomerRoutes';
import { ManagerRoutes } from './routes/ManagerRoutes';
import { AdminRoutes } from './routes/AdminRoutes';
import Unauthorized from './views/auth/Unauthorized';

function App() {
  return (
    <Routes>
      {PublicRoutes}
      {CustomerRoutes}
      {ManagerRoutes}
      {AdminRoutes}

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
