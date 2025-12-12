import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/rootReducer';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    allowedRoles: string[];
    children?: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
    const { user, loading } = useSelector((state: RootState) => state.auth);

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

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
