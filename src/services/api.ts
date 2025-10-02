import type { PlanId } from '../types';

export const mockApi = {
  students: {
    getAll: () => Promise.resolve({ success: true, data: [] }), // Datos vacíos por defecto
    create: (student: Record<string, unknown>) => {
      const newStudent = { 
        id: Date.now().toString(),
        nombre: (student.nombre as string) || 'Nuevo Estudiante',
        email: (student.email as string) || 'email@ejemplo.com',
        fechaIngreso: (student.fechaIngreso as string) || new Date().toISOString().split('T')[0],
        estado: (student.estado as 'activo' | 'inactivo') || 'activo',
        telefono: (student.telefono as string) || '',
        planId: student.planId as PlanId | undefined,
        paymentDate: student.paymentDate as string,
        nextBillingDate: student.nextBillingDate as string,
        avatarUrl: student.avatarUrl as string
      };
      return Promise.resolve({ success: true, data: newStudent });
    },
    update: (_id: string, student: Record<string, unknown>) => {
      const updatedStudent = { 
        id: _id,
        nombre: (student.nombre as string) || 'Estudiante Actualizado',
        email: (student.email as string) || 'email@ejemplo.com',
        fechaIngreso: (student.fechaIngreso as string) || new Date().toISOString().split('T')[0],
        estado: (student.estado as 'activo' | 'inactivo') || 'activo',
        telefono: (student.telefono as string) || '',
        planId: student.planId as PlanId | undefined,
        paymentDate: student.paymentDate as string,
        nextBillingDate: student.nextBillingDate as string,
        avatarUrl: student.avatarUrl as string
      };
      return Promise.resolve({ success: true, data: updatedStudent });
    },
    delete: (_id: string) => Promise.resolve({ success: true, message: 'Estudiante eliminado' })
  },
  auth: {
    login: (email: string, _password: string) => 
      Promise.resolve({ 
        success: true, 
        user: { id: '1', email, role: 'admin' as const, isVerified: true }, 
        token: 'mock-token-' + Date.now() 
      }),
    register: (email: string, _password: string) => 
      Promise.resolve({ 
        success: true, 
        user: { id: '1', email, role: 'admin' as const, isVerified: true }, 
        token: 'mock-token-' + Date.now() 
      })
  }
};

export default mockApi;