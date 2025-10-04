import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { Student } from '../types';
import { PLANS } from '../constants';
import { studentsApi } from '../services/apiService';
import StudentTable from './StudentTable';
import StudentFormModal from './StudentFormModal';
import IncomeChart from './IncomeChart';
import { PlusIcon } from './icons/PlusIcon';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ username, onLogout }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      const response = await studentsApi.getAll();
      if (response.success && response.data) {
        setStudents(response.data);
      }
      setIsLoading(false);
    };
    fetchStudents();
  }, []);
  
  const handleAddStudent = useCallback(() => {
    setEditingStudent(null);
    setIsModalOpen(true);
  }, []);

  const handleEditStudent = useCallback((student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  }, []);

  const handleDeleteStudent = useCallback(async (studentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar a este participante?')) {
      const response = await studentsApi.delete(studentId);
      if (response.success) {
        setStudents(prev => prev.filter(s => s.id !== studentId));
      }
    }
  }, []);

  const handleSaveStudent = useCallback(async (student: Student) => {
    try {
      console.log('🔄 Guardando estudiante:', student);
      
      const response = student.id 
        ? await studentsApi.update(student.id, student)
        : await studentsApi.create(student);
      
      console.log('📊 Respuesta de guardado:', response);
      
      if (response.success && response.data) {
        const savedStudent = response.data;
        console.log('✅ Estudiante guardado:', savedStudent);
        
        setStudents(prev => {
          const existing = prev.find(s => s.id === savedStudent.id);
          if (existing) {
            return prev.map(s => s.id === savedStudent.id ? savedStudent : s);
          }
          return [...prev, savedStudent];
        });
        
        setIsModalOpen(false);
      } else {
        console.error('❌ Error guardando estudiante:', response);
        alert(`Error: ${response.error || 'No se pudo guardar el estudiante'}`);
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      alert('Error inesperado al guardar el estudiante');
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };
  
  const totalStudents = students.length;
  const monthlyIncome = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    return students.reduce((acc, student) => {
        const paymentDate = new Date(student.paymentDate + 'T00:00:00');
        if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
            return acc + (student.planId ? PLANS[student.planId].price : 0);
        }
        return acc;
    }, 0);
  }, [students]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="bg-white dark:bg-gray-800 shadow-md print:hidden">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Academia Manager</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {username}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
       {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
        <div id="print-area">
          <div className="mb-8 print:hidden">
            <h2 className="text-3xl font-semibold mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
                  <UserGroupIcon className="h-12 w-12 text-blue-500 mr-4"/>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total de Alumnos</p>
                    <p className="text-3xl font-bold">{totalStudents}</p>
                  </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex items-center">
                  <CurrencyDollarIcon className="h-12 w-12 text-green-500 mr-4"/>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos de este Mes</p>
                    <p className="text-3xl font-bold">S/ {monthlyIncome.toFixed(2)}</p>
                  </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center"><ChartBarIcon className="h-6 w-6 mr-2 text-indigo-500" />Rendimiento Mensual</h3>
                 <button 
                  onClick={handlePrint}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 print:hidden"
                >
                  Imprimir Gráficos
                </button>
            </div>
            <IncomeChart students={students} />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4 print:hidden">
              <h3 className="text-xl font-semibold">Lista de Participantes</h3>
              <button
                onClick={handleAddStudent}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Agregar Participante
              </button>
            </div>
            <StudentTable
              students={students}
              onEdit={handleEditStudent}
              onDelete={handleDeleteStudent}
            />
          </div>
        </div>
        )}
      </main>

      {isModalOpen && (
        <StudentFormModal
          student={editingStudent}
          onSave={handleSaveStudent}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;