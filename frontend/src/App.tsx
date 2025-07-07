import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import WebSocketProvider from './context/WebSocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import AdminLogin from './pages/auth/AdminLogin';
import DriverLogin from './pages/auth/DriverLogin';
import Dashboard from './pages/admin/Dashboard';
import Requests from './pages/admin/Requests';
import Drivers from './pages/admin/Drivers';
import MyRoute from './pages/driver/MyRoute';
import History from './pages/driver/History';

// Admin Pages
import AdminLiveMap from './pages/admin/LiveMap';

function App() {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Admin Routes */}
              <Route element={<ProtectedRoute userType="admin" />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/requests" element={<Requests />} />
                <Route path="/admin/drivers" element={<Drivers />} />
              </Route>

              {/* Driver Routes */}
              <Route element={<ProtectedRoute userType="driver" />}>
                <Route path="/driver/my-route" element={<MyRoute />} />
                <Route path="/driver/history" element={<History />} />
              </Route>

              {/* Auth Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/driver/login" element={<DriverLogin />} />
              
              {/* Default Routes */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/driver" element={<Navigate to="/driver/my-route" />} />
              <Route path="/" element={<Navigate to="/admin/login" />} />

              {/* Protected Admin Routes */}
              <Route
                path="/admin/live-map"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLiveMap />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
}

export default App;
