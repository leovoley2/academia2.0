
import React from 'react';
import type { Student } from '../types';
import { PLANS } from '../constants';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
}

const StudentRow: React.FC<{ student: Student; onEdit: (student: Student) => void; onDelete: (studentId: string) => void; }> = ({ student, onEdit, onDelete }) => {
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = student.nextBillingDate && student.nextBillingDate < today;

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="py-3 px-4">
        <div className="flex items-center">
          <img className="h-10 w-10 rounded-full object-cover mr-4" src={student.avatarUrl} alt={student.nombre} />
          <span className="font-medium">{student.nombre}</span>
        </div>
      </td>
      <td className="py-3 px-4">{student.planId ? PLANS[student.planId].name : 'Sin plan'}</td>
      <td className="py-3 px-4">S/ {student.planId ? PLANS[student.planId].price.toFixed(2) : '0.00'}</td>
      <td className="py-3 px-4">{student.paymentDate || 'No registrado'}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
          isOverdue 
            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {student.nextBillingDate}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          <button onClick={() => onEdit(student)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">
            <PencilIcon className="h-5 w-5" />
          </button>
          <button onClick={() => onDelete(student.id || student._id || '')} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const StudentTable: React.FC<StudentTableProps> = ({ students, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">Nombre</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">Plan</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">Monto</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">Fecha de Pago</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">Próximo Cobro</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300 print:hidden">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {students.map(student => (
            <StudentRow key={student.id} student={student} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
