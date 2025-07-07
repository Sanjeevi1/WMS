import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isDriver = location.pathname.startsWith('/driver');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-800">Waste Management</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
                  <Link to="/admin/requests" className="text-gray-700 hover:text-gray-900">Requests</Link>
                    <Link to="/admin/drivers" className="text-gray-700 hover:text-gray-900">Drivers</Link>
                  <Link to="/admin/live-map" className="text-gray-700 hover:text-gray-900">Live Map</Link>
                </>
              )}
              {isDriver && (
                <>
                  <Link to="/driver/my-route" className="text-gray-700 hover:text-gray-900">My Route</Link>
                  <Link to="/driver/history" className="text-gray-700 hover:text-gray-900">History</Link>
                </>
              )}
              {!isAdmin && !isDriver && (
                <>
                  <Link to="/admin/login" className="text-gray-700 hover:text-gray-900">Admin Login</Link>
                  <Link to="/driver/login" className="text-gray-700 hover:text-gray-900">Driver Login</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout; 