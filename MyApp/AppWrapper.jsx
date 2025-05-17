import React from 'react';
import { AuthProvider } from './src/Context/AuthContext';
import App from './App';

const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;
