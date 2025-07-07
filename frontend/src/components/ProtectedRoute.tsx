import React from 'react';
import { Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  userType?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, userType }) => {
  // Always allow access
  if (children) {
    return <>{children}</>;
  }
  return <Outlet />;
};

export default ProtectedRoute; 