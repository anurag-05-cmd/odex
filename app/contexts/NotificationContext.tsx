"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration: number;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: NotificationType = 'info', duration: number = 5000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = { id, type, message, duration };

    setNotifications(prev => [...prev, notification]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getColorClasses = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-br from-[#70ff00]/20 via-[#70ff00]/10 to-transparent border-2 border-[#70ff00]/40 text-[#70ff00] shadow-[0_8px_32px_rgba(112,255,0,0.3)]';
      case 'error':
        return 'bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent border-2 border-red-500/40 text-red-400 shadow-[0_8px_32px_rgba(239,68,68,0.3)]';
      case 'warning':
        return 'bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-transparent border-2 border-yellow-500/40 text-yellow-400 shadow-[0_8px_32px_rgba(234,179,8,0.3)]';
      case 'info':
      default:
        return 'bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent border-2 border-blue-500/40 text-blue-400 shadow-[0_8px_32px_rgba(59,130,246,0.3)]';
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-3 max-w-md">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              ${getColorClasses(notification.type)}
              backdrop-blur-xl rounded-2xl p-5 
              animate-[slideIn_0.4s_cubic-bezier(0.16,1,0.3,1)]
              flex items-start gap-4 min-w-[320px]
              hover:scale-[1.02] transition-transform duration-300
            `}
            style={{
              animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <div className="flex-shrink-0 mt-0.5 bg-current/10 p-2 rounded-lg">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 text-sm leading-relaxed font-medium">
              {notification.message}
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 bg-current/10 p-1.5 rounded-lg hover:bg-current/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </NotificationContext.Provider>
  );
};
