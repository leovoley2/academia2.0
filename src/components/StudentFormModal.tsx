
import React, { useState, useEffect } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import type { Student } from '../types';
import { PlanId } from '../types';
import { PLANS } from '../constants';

interface StudentFormModalProps {
  student: Student | null;
  onSave: (student: Student) => void;
  onClose: () => void;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({ student, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Student, 'id' | 'avatarUrl' | 'nextBillingDate'>>({
    name: '',
    planId: PlanId.ONCE_A_WEEK as PlanId,
    paymentDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        planId: student.planId,
        paymentDate: student.paymentDate,
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'planId' ? value as PlanId : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextBillingDate = new Date(formData.paymentDate + 'T00:00:00');
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

    const studentToSave: Student = {
      id: student?.id || new Date().getTime().toString(),
      ...formData,
      nextBillingDate: nextBillingDate.toISOString().split('T')[0],
      avatarUrl: student?.avatarUrl || `https://picsum.photos/seed/${formData.name.split(' ').join('')}/100/100`,
    };
    onSave(studentToSave);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold">{student ? 'Editar Participante' : 'Agregar Participante'}</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="planId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Plan de Entrenamiento</label>
              <select
                name="planId"
                id="planId"
                value={formData.planId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              >
                {Object.values(PLANS).map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name} - S/ {plan.price}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de Pago</label>
              <input
                type="date"
                name="paymentDate"
                id="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFormModal;
