import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage     from '../pages/SignupPage';
import SigninPage     from '../pages/SigninPage';
import DashboardPage  from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default: redirect root to signup */}
        <Route path="/" element={<Navigate to="/signup" replace />} />

        {/* Public routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />

        {/* Protected routes — ProtectedRoute checks access token */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Catch-all 404 → back to signup */}
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
