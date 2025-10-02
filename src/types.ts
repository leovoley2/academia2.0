export enum PlanId {
  ONCE_A_WEEK = "once_a_week",
  TWICE_A_WEEK = "twice_a_week",
  THRICE_A_WEEK = "thrice_a_week",
  FOUR_TIMES_A_WEEK = "four_times_a_week",
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  frequency: number;
}

export interface Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  planId: PlanId;
  paymentDate: string;
  nextBillingDate: string;
  avatarUrl: string;
  isActive?: boolean;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'super_admin';
  isActive?: boolean;
  isVerified: boolean;
  lastLogin?: string;
  createdAt?: string;
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
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
