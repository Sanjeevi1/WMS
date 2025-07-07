import React, { createContext, useContext, useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface WebSocketContextType {
  socket: Socket | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Get backend URL from environment variable or use default
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

    // Connect to the backend server
    const newSocket = io(BACKEND_URL, {
      path: '/socket.io',
      auth: {
        token: 'dummy-token'
      },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true
    });

    // Log connection events
    newSocket.on('connect', () => {
      console.log('Socket connected successfully');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketProvider; 