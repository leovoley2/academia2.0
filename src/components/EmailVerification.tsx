import React, { useState, useEffect } from 'react';

interface EmailVerificationProps {
    onBackToLogin: () => void;
    token?: string; // Token passed as prop if not using router
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ onBackToLogin, token }) => {
    const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        const verifyEmail = async () => {
            // Get token from props or URL parameters
            const verificationToken = token || new URLSearchParams(window.location.search).get('token');
            
            if (!verificationToken) {
                setVerificationStatus('error');
                setMessage('Token de verificación no encontrado.');
                return;
            }

            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
                const response = await fetch(`${API_URL}/auth/verify-email?token=${verificationToken}`, {
                    method: 'GET',
                });

                const data = await response.json();

                if (response.ok) {
                    setVerificationStatus('success');
                    setMessage('¡Tu correo electrónico ha sido verificado exitosamente!');
                } else {
                    setVerificationStatus('error');
                    setMessage(data.message || 'Error al verificar el correo electrónico.');
                }
            } catch (error: unknown) {
                setVerificationStatus('error');
                setMessage('Error de conexión al verificar el correo electrónico.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="text-center">
                    {verificationStatus === 'verifying' && (
                        <>
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900">
                                <svg className="animate-spin h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                                Verificando...
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                Estamos verificando tu correo electrónico, por favor espera.
                            </p>
                        </>
                    )}

                    {verificationStatus === 'success' && (
                        <>
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                                ¡Verificación Exitosa!
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                {message}
                            </p>
                            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                Ahora puedes iniciar sesión con tu cuenta.
                            </p>
                        </>
                    )}

                    {verificationStatus === 'error' && (
                        <>
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                                Error de Verificación
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                                {message}
                            </p>
                        </>
                    )}

                    <div className="mt-6">
                        <button 
                            onClick={onBackToLogin}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Ir al Inicio de Sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;