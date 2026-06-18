
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';

import LandingPage         from './pages/LandingPage';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import ForgotPasswordPage  from './pages/ForgotPasswordPage';
import ResetPasswordPage   from './pages/ResetPasswordPage';
import DashboardPage       from './pages/DashboardPage';
import CoursesPage         from './pages/CoursesPage';
import CourseDetailPage    from './pages/CourseDetailPage';
import ExercisesPage       from './pages/ExercisesPage';
import AdminPage           from './pages/AdminPage';

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const { token, fetchMe } = useAuthStore();
  useEffect(() => { if (token) fetchMe(); }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1a2235', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem' }
      }} />
      <Routes>
        <Route path="/"                element={<LandingPage />} />
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />
        <Route path="/dashboard"       element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/courses"         element={<PrivateRoute><CoursesPage /></PrivateRoute>} />
        <Route path="/courses/:id"     element={<PrivateRoute><CourseDetailPage /></PrivateRoute>} />
        <Route path="/exercises"       element={<PrivateRoute><ExercisesPage /></PrivateRoute>} />
        <Route path="/admin"           element={<PrivateRoute><AdminPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
