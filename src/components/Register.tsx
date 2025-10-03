import React, { useState } from 'react';

interface RegisterProps {
    onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);

    const validatePassword = (password: string): boolean => {
      // Requisito: Al menos 8 caracteres, una mayúscula, una minúscula y un número.
      const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
      return re.test(password);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (!validatePassword(password)) {
          setError('La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número.');
          return;
        }

        setIsLoading(true);
        
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al registrar usuario');
            }

            setRegistrationSuccess(true);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrar usuario';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                {registrationSuccess ? (
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                            ¡Registro Exitoso!
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            Te hemos enviado un correo de verificación a <strong>{email}</strong>. 
                            Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                        </p>
                        <div className="mt-6">
                            <button 
                                onClick={onSwitchToLogin}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Ir al Inicio de Sesión
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                                Crear una cuenta
                            </h2>
                        </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address-register" className="sr-only">Correo electrónico</label>
                            <input
                                id="email-address-register"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password-register" className="sr-only">Contraseña</label>
                            <input
                                id="password-register"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                         <div>
                            <label htmlFor="confirm-password-register" className="sr-only">Confirmar Contraseña</label>
                            <input
                                id="confirm-password-register"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirmar Contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                        >
                           {isLoading ? 'Registrando...' : 'Registrarse'}
                        </button>
                    </div>
                     <div className="text-center">
                        <button 
                            type="button" 
                            onClick={onSwitchToLogin}
                            className="font-medium text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            ¿Ya tienes una cuenta? Inicia Sesión
                        </button>
                    </div>
                </form>
                </>
                )}
            </div>
        </div>
    );
};

export default Register;
