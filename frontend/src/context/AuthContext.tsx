import React, { createContext, useContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userType: 'admin' | 'driver';
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'driver';
  };
}

const DEFAULT_ADMIN = {
  _id: '67f8aeb64eae41bd3cbd31a5',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin' as const
};

const DEFAULT_DRIVER = {
  _id: '67f8aeb84eae41bd3cbd31b6',
  name: 'Driver User',
  email: 'driver@example.com',
  role: 'driver' as const
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always return authenticated state with default admin
  const value = {
    isAuthenticated: true,
    userType: 'admin' as const,
    token: 'dummy-token',
    user: DEFAULT_ADMIN
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 