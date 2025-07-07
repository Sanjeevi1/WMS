import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import AdminDashboard from './pages/admin/Dashboard';
import AdminRequests from './pages/admin/Requests';
import AdminDrivers from './pages/admin/Drivers';
import DriverMyRoute from './pages/driver/MyRoute';
import DriverHistory from './pages/driver/History';

const App = () => {
  // Always allow access
  const ProtectedRoute = ({ children, userType }) => {
    return children;
  };

  return (
    <Router>
      <AuthProvider>
        <WebSocketProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute userType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/requests" element={
              <ProtectedRoute userType="admin">
                <AdminRequests />
              </ProtectedRoute>
            } />
            <Route path="/admin/drivers" element={
              <ProtectedRoute userType="admin">
                <AdminDrivers />
              </ProtectedRoute>
            } />

            {/* Driver Routes */}
            <Route path="/driver/my-route" element={
              <ProtectedRoute userType="driver">
                <DriverMyRoute />
              </ProtectedRoute>
            } />
            <Route path="/driver/history" element={
              <ProtectedRoute userType="driver">
                <DriverHistory />
              </ProtectedRoute>
            } />

            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/driver" element={<Navigate to="/driver/my-route" />} />
          </Routes>
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 