import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  _id: string;
  studentId: mongoose.Types.ObjectId;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description?: string;
  receiptNumber?: string;
  processedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'ID del estudiante es requerido']
  },
  amount: {
    type: Number,
    required: [true, 'Monto es requerido'],
    min: [0, 'El monto debe ser positivo']
  },
  paymentDate: {
    type: Date,
    required: [true, 'Fecha de pago es requerida'],
    default: Date.now
  },
  paymentMethod: {
    type: String,
    required: [true, 'Método de pago es requerido'],
    enum: ['cash', 'card', 'transfer', 'other'],
    default: 'cash'
  },
  status: {
    type: String,
    required: [true, 'Estado es requerido'],
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  description: {
    type: String,
    maxlength: [200, 'La descripción no puede exceder 200 caracteres']
  },
  receiptNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índices para optimizar consultas
PaymentSchema.index({ studentId: 1 });
PaymentSchema.index({ paymentDate: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ processedBy: 1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);