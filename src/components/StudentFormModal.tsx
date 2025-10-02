import React, { useState, useEffect } from 'react';
import { PLANS, calculateNextBillingDate } from '../constants';
import { PlanId } from '../types';

interface StudentFormModalProps {
  student: any;
  onSave: (student: any) => void;
  onClose: () => void;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({ student, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    estado: 'activo',
    planId: PlanId.ONCE_A_WEEK,
    paymentDate: new Date().toISOString().split('T')[0],
    nextBillingDate: (() => {
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 1);
      return nextDate.toISOString().split('T')[0];
    })(),
  });

  useEffect(() => {
    if (student) {
      setFormData({
        nombre: student.nombre || '',
        email: student.email || '',
        telefono: student.telefono || '',
        fechaIngreso: student.fechaIngreso || new Date().toISOString().split('T')[0],
        estado: student.estado || 'activo',
        planId: student.planId || PlanId.ONCE_A_WEEK,
        paymentDate: student.paymentDate || new Date().toISOString().split('T')[0],
        nextBillingDate: student.nextBillingDate || (() => {
          const nextDate = new Date();
          nextDate.setMonth(nextDate.getMonth() + 1);
          return nextDate.toISOString().split('T')[0];
        })(),
      });
    }
  }, [student]);

  // Efecto para recalcular automáticamente la fecha de próximo cobro
  useEffect(() => {
    if (formData.paymentDate && formData.planId) {
      const calculatedNextBilling = calculateNextBillingDate(formData.paymentDate, formData.planId);
      setFormData(prev => ({
        ...prev,
        nextBillingDate: calculatedNextBilling
      }));
    }
  }, [formData.paymentDate, formData.planId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'paymentDate' || name === 'planId') {
      // Recalcular cuando cambia la fecha de pago o el plan
      const paymentDate = name === 'paymentDate' ? value : formData.paymentDate;
      const planId = name === 'planId' ? value as PlanId : formData.planId;
      
      if (paymentDate && planId) {
        const calculatedNextBilling = calculateNextBillingDate(paymentDate, planId);
        setFormData(prev => ({
          ...prev,
          [name]: value,
          nextBillingDate: calculatedNextBilling
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentData = {
      ...student,
      ...formData,
    };
    onSave(studentData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {student ? 'Editar Estudiante' : 'Agregar Estudiante'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Pago
            </label>
            <input
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Próximo Cobro
              <span className="text-xs text-gray-500 ml-2">(calculado automáticamente)</span>
            </label>
            <input
              type="date"
              name="nextBillingDate"
              value={formData.nextBillingDate}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Se calcula al completar todas las clases del plan. Próximo cobro el día siguiente a la última clase o el siguiente día de entrenamiento.
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Plan de Entrenamiento
            </label>
            <select
              name="planId"
              value={formData.planId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.values(PLANS).map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - S/ {plan.price}/mes
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {student ? 'Actualizar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;