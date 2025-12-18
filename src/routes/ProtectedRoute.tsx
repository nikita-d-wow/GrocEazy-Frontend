import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/rootReducer';
import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface Props {
  children?: ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const location = useLocation();
  // eslint-disable-next-line no-console
  console.log('ProtectedRoute Check:', {
    hasPassword: user?.hasPassword,
    path: location.pathname,
    role: user?.role,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-green-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Force password set flow
  if (user.hasPassword === false && location.pathname !== '/set-password') {
    return <Navigate to="/set-password" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
