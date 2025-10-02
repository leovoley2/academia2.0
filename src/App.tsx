import React, { useState, useCallback, useEffect } from 'react';
import Login from './components/Login';
import AdminRegister from './components/AdminRegister';
import Dashboard from './components/Dashboard';
import { authApi } from './services/apiService';
import type { RegisterRequest } from './types';

type AuthView = 'login' | 'register';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [authView, setAuthView] = useState<AuthView>('login');
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await authApi.verifyToken();
      if (result.success && result.user) {
        setIsAuthenticated(true);
        setCurrentUser(result.user.email);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = useCallback(async (email: string, password: string): Promise<string | undefined> => {
    const response = await authApi.login({ email, password });
    if (response.success && response.user) {
      setIsAuthenticated(true);
      setCurrentUser(response.user.email);
      return undefined;
    } else {
      return response.message || 'Error de inicio de sesión';
    }
  }, []);

  const handleRegister = useCallback(async (userData: RegisterRequest): Promise<string | undefined> => {
    const response = await authApi.register(userData);
    if (response.success) {
      setRegistrationSuccess(true);
      setAuthView('login');
      return undefined;
    } else {
      return response.message || 'Error de registro';
    }
  }, []);

  const handleLogout = useCallback(async () => {
    await authApi.logout();
    setIsAuthenticated(false);
    setCurrentUser('');
    setAuthView('login');
  }, []);

  const renderAuthView = () => {
    switch (authView) {
      case 'register':
        return (
          <AdminRegister
            onRegister={handleRegister}
            onSwitchToLogin={() => setAuthView('login')}
          />
        );
      case 'login':
      default:
        return (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => {
              setRegistrationSuccess(false);
              setAuthView('register');
            }}
            onForgotPassword={() => {
              alert('Funcionalidad pendiente');
            }}
            successMessage={registrationSuccess ? '¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.' : undefined}
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
