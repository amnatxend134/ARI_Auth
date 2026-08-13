import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../hooks/reduxHooks';

export default function ProtectedRoute() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
