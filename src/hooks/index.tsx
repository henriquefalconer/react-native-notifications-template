import React from 'react';
import { NotificationProvider } from 'react-native-internal-notification';
import { AuthProvider } from './useAuth';

const AppProvider: React.FC = ({ children }) => {
  return (
    <NotificationProvider>
      <AuthProvider>{children}</AuthProvider>
    </NotificationProvider>
  );
};

export default AppProvider;
