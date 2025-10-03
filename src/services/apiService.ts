import type { 
  Student, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ApiResponse 
} from '../types';
import { mockApi } from './api';

// Usar API real por defecto, fallback a mock solo si falla
const USE_MOCK = false;

// API Base URL para el backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Función auxiliar para hacer peticiones con fallback a mock
async function apiRequestWithFallback(endpoint: string, options: RequestInit = {}) {
  if (USE_MOCK) {
    // Si está configurado para usar mock, usar directamente
    throw new Error('Using mock API');
  }

  const token = localStorage.getItem('authToken');
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.warn(`API request failed for ${endpoint}, falling back to mock:`, error);
    throw error; // Propagar error para que se use el fallback
  }
}

// API de autenticación
export const authApi = {
  // Login de usuario
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const data = await apiRequestWithFallback('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      // Fallback a mock API
      return await mockApi.auth.login(credentials.email, credentials.password);
    }
  },

  // Registro de nuevo administrador
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
      return await mockApi.auth.register(userData.email, userData.password);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
    } catch (error) {
      // Error no crítico en logout
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Verificar token
  async verifyToken(): Promise<AuthResponse> {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        return {
          success: false,
          message: 'No hay token de autenticación'
        };
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Error verificando token'
      };
    }
  }
};

// API de estudiantes
export const studentsApi = {
  // Obtener todos los estudiantes
  async getAll(): Promise<ApiResponse<Student[]>> {
    try {
      const data = await apiRequestWithFallback('/students');
      return data;
    } catch (error) {
      // Fallback a mock API (que ahora devuelve array vacío)
      return await mockApi.students.getAll();
    }
  },

  // Obtener estudiante por ID
  async getById(id: string): Promise<ApiResponse<Student>> {
    if (USE_MOCK) {
      // Para el mock, devolver el primer estudiante con el ID solicitado
      const mockData = await mockApi.students.getAll();
      const student = mockData.data.find((s: any) => s.id === id);
      return student ? { success: true, data: student } : { success: false, error: 'Estudiante no encontrado' };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (_error) {
      return {
        success: false,
        error: 'Error obteniendo estudiante'
      };
    }
  },

  // Crear nuevo estudiante
  async create(student: Omit<Student, 'id'>): Promise<ApiResponse<Student>> {
    if (USE_MOCK) {
      return await mockApi.students.create(student);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(student),
      });

      const data = await response.json();
      return data;
    } catch (_error) {
      return {
        success: false,
        error: 'Error creando estudiante'
      };
    }
  },

  // Actualizar estudiante
  async update(id: string, student: Partial<Student>): Promise<ApiResponse<Student>> {
    if (USE_MOCK) {
      return await mockApi.students.update(id, student);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(student),
      });

      const data = await response.json();
      return data;
    } catch (_error) {
      return {
        success: false,
        error: 'Error actualizando estudiante'
      };
    }
  },

  // Eliminar estudiante
  async delete(id: string): Promise<ApiResponse<void>> {
    if (USE_MOCK) {
      return await mockApi.students.delete(id);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (_error) {
      return {
        success: false,
        error: 'Error eliminando estudiante'
      };
    }
  }
};