import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/reduxHooks';
import SignupPage     from '../pages/SignupPage';
import SigninPage     from '../pages/SigninPage';
import DashboardPage  from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            accessToken
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/signin" replace />
          }
        />

        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}