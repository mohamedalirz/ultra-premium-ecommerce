import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && isAuthenticated && user) {
      socket.emit('join-user', user.id);

      socket.on('new-notification', (notification) => {
        toast.custom((t) => (
          <div className="bg-gradient-to-r from-primary to-secondary p-4 rounded-xl shadow-lg max-w-md">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-neon rounded-full animate-pulse" />
              <div>
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-white/80">{notification.message}</p>
                <p className="text-xs text-white/60 mt-1">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ));
      });

      socket.on('order-status-update', (data) => {
        toast.success(`Order ${data.orderId}: ${data.status}`, {
          duration: 5000,
        });
      });
    }

    return () => {
      if (socket) {
        socket.off('new-notification');
        socket.off('order-status-update');
      }
    };
  }, [socket, isAuthenticated, user]);

  const emit = (event, data) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socket) {
      socket.off(event, callback);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, emit, on, off }}>
      {children}
    </SocketContext.Provider>
  );
};