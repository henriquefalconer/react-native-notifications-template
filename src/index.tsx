import React from 'react';
import AppProvider from './hooks';
import Routes from './routes';

const RunningApp: React.FC = () => {
  return (
    <AppProvider>
      <Routes />
    </AppProvider>
  );
};

const App: React.FC<{ isHeadless: boolean }> = ({ isHeadless }) => {
  if (isHeadless) {
    // App was opened on iOS in background mode, ignore.
    return null;
  }

  return <RunningApp />;
};

export default App;
