import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  userType?: 'admin' | 'driver';
}

const Layout: React.FC<LayoutProps> = ({ children, userType = 'admin' }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/requests', label: 'Requests' },
    { path: '/admin/drivers', label: 'Drivers' }
  ];

  const driverLinks = [
    { path: '/driver/my-route', label: 'My Route' },
    { path: '/driver/history', label: 'History' }
  ];

  const links = userType === 'admin' ? adminLinks : driverLinks;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-800">
                  Waste Management System
                </span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`${
                      isActive(link.path)
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <Link
                to={userType === 'admin' ? '/driver/my-route' : '/admin/dashboard'}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Switch to {userType === 'admin' ? 'Driver' : 'Admin'}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout; 