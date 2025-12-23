// src/App.tsx
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { PublicRoutes } from './routes/PublicRoutes';
import { CustomerRoutes } from './routes/CustomerRoutes';
import { ManagerRoutes } from './routes/ManagerRoutes';
import { AdminRoutes } from './routes/AdminRoutes';

import Unauthorized from './views/auth/Unauthorized';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
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
