import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

interface ProtectedRoutesProps {
  children?: ReactNode;
}

export default function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  // If children are provided, wrap them with ProtectedRoute
  if (children) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
  }
  
  // Otherwise, use Outlet for nested routes
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
