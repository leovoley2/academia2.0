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
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
          const response = await fetch(`${API_URL}/auth/verify`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setCurrentUser(data.user?.email || 'user@example.com');
          } else {
            // Token inválido, limpiar localStorage
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      }
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = useCallback((token: string, userData?: any) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setCurrentUser(userData?.email || 'user@example.com');
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
