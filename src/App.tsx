import React, { useState, useCallback, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import EmailVerification from './components/EmailVerification';
import Dashboard from './components/Dashboard';

type AuthView = 'login' | 'register' | 'forgot-password' | 'reset-password' | 'email-verification';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        // TODO: Verify token with backend
        setIsAuthenticated(true);
        // TODO: Get user info from token or API
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = useCallback((token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setCurrentUser('user@example.com'); // TODO: Get actual user info
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setCurrentUser('');
    setAuthView('login');
    setSuccessMessage('');
  }, []);

  const renderAuthView = () => {
    switch (authView) {
      case 'register':
        return (
          <Register
            onSwitchToLogin={() => {
              setAuthView('login');
              setSuccessMessage('¡Usuario registrado exitosamente! Revisa tu correo para verificar tu cuenta.');
            }}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPassword
            onSwitchToLogin={() => setAuthView('login')}
          />
        );
      case 'reset-password':
        return (
          <ResetPassword
            onSwitchToLogin={() => {
              setAuthView('login');
              setSuccessMessage('Contraseña restablecida exitosamente. Puedes iniciar sesión con tu nueva contraseña.');
            }}
          />
        );
      case 'email-verification':
        return (
          <EmailVerification
            onBackToLogin={() => {
              setAuthView('login');
              setSuccessMessage('Email verificado exitosamente. Ahora puedes iniciar sesión.');
            }}
          />
        );
      case 'login':
      default:
        return (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => {
              setSuccessMessage('');
              setAuthView('register');
            }}
            onForgotPassword={() => setAuthView('forgot-password')}
            successMessage={successMessage || undefined}
          />
        );
    }
  };

  if (isAuthenticated) {
    return <Dashboard username={currentUser} onLogout={handleLogout} />;
  }

  return renderAuthView();
};

export default App;
