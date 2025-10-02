import mongoose, { Schema, Document } from 'mongoose';
import { PlanId } from '../types';

export interface IStudent extends Document {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  planId: PlanId;
  paymentDate: Date;
  nextBillingDate: Date;
  avatarUrl: string;
  isActive: boolean;
  notes?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Nombre del estudiante es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Teléfono inválido']
  },
  planId: {
    type: String,
    required: [true, 'Plan es requerido'],
    enum: Object.values(PlanId)
  },
  paymentDate: {
    type: Date,
    required: [true, 'Fecha de pago es requerida']
  },
  nextBillingDate: {
    type: Date,
    required: [true, 'Próxima fecha de facturación es requerida']
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Las notas no pueden exceder 500 caracteres']
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'El nombre del contacto no puede exceder 100 caracteres']
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[0-9+\-\s()]+$/, 'Teléfono inválido']
    },
    relationship: {
      type: String,
      trim: true,
      maxlength: [50, 'La relación no puede exceder 50 caracteres']
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
StudentSchema.index({ name: 1 });
StudentSchema.index({ email: 1 });
StudentSchema.index({ planId: 1 });
StudentSchema.index({ isActive: 1 });
StudentSchema.index({ createdBy: 1 });
StudentSchema.index({ paymentDate: 1 });
StudentSchema.index({ nextBillingDate: 1 });

export default mongoose.model<IStudent>('Student', StudentSchema);
export const Student = mongoose.model<IStudent>('Student', StudentSchema);