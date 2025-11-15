import { Route, Routes } from 'react-router-dom';

// Import pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUpPage';
import { ForgotPassword } from './pages/ForgotPasswordPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { EventDetail } from './pages/EventDetail';
import { Ranking } from './pages/Ranking';

// Import layouts
import { DefaultLayout } from './layouts/DefaultLayout';
import { AuthLayout } from './layouts/AuthLayout';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Home />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="event/:id" element={<EventDetail />} />
      </Route>

      {/* Auth routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<DefaultLayout />}>
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* 404 - Not Found */}
      <Route path="*" element={<div>404 - Not Found</div>} />
    </Routes>
  );
}
