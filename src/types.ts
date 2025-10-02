// Tipos básicos para planes
export const PlanId = {
  ONCE_A_WEEK: "once_a_week",
  TWICE_A_WEEK: "twice_a_week",
  THRICE_A_WEEK: "thrice_a_week",
  FOUR_TIMES_A_WEEK: "four_times_a_week",
} as const;

export type PlanId = typeof PlanId[keyof typeof PlanId];

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  frequency: number;
}

export interface Student {
  _id?: string;
  id?: string;
  nombre: string;
  email: string;
  telefono?: string;
  curso: string;
  fechaIngreso: string;
  estado: 'activo' | 'inactivo';
  createdAt?: string;
  updatedAt?: string;
  // Campos adicionales opcionales
  planId?: PlanId;
  paymentDate?: string;
  nextBillingDate?: string;
  avatarUrl?: string;
  isActive?: boolean;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface User {
  _id?: string;
  id?: string;
  email: string;
  password?: string;
  passwordHash?: string;
  role: 'admin' | 'user' | 'super_admin';
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Tipos para autenticación
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'super_admin';
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

// Tipos para pagos
export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description?: string;
  receiptNumber?: string;
}

// Tipos para respuestas de API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
