
import type { Plan, Student } from './types';
import { PlanId } from './types';

export const PLANS: Record<PlanId, Plan> = {
  [PlanId.ONCE_A_WEEK]: { id: PlanId.ONCE_A_WEEK, name: '1 vez por semana', price: 130, frequency: 1 },
  [PlanId.TWICE_A_WEEK]: { id: PlanId.TWICE_A_WEEK, name: '2 veces por semana', price: 170, frequency: 2 },
  [PlanId.THRICE_A_WEEK]: { id: PlanId.THRICE_A_WEEK, name: '3 veces por semana', price: 200, frequency: 3 },
  [PlanId.FOUR_TIMES_A_WEEK]: { id: PlanId.FOUR_TIMES_A_WEEK, name: '4 veces por semana', price: 230, frequency: 4 },
};

export const TRAINING_DAYS = ['Lunes', 'Miércoles', 'Viernes', 'Sábado'];

// Días de entrenamiento en formato número (0=domingo, 1=lunes, etc.)
const TRAINING_WEEKDAYS = [1, 3, 5, 6]; // Lunes, Miércoles, Viernes, Sábado

const getNextBillingDate = (paymentDate: string): string => {
  const date = new Date(paymentDate + 'T00:00:00');
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split('T')[0];
};

// Función para calcular próximo cobro basado en clases completadas según el plan
export const calculateNextBillingDate = (paymentDate: string, planId: PlanId): string => {
  const startDate = new Date(paymentDate + 'T00:00:00');
  const plan = PLANS[planId];
  
  // Calcular cuántas clases son según el plan (mensual)
  let totalClasses: number;
  let classesPerWeek: number;
  
  switch (plan.frequency) {
    case 4: // 4 veces por semana = 16 clases mensuales
      totalClasses = 16;
      classesPerWeek = 4;
      break;
    case 3: // 3 veces por semana = 12 clases mensuales
      totalClasses = 12;
      classesPerWeek = 3;
      break;
    case 2: // 2 veces por semana = 8 clases mensuales
      totalClasses = 8;
      classesPerWeek = 2;
      break;
    case 1: // 1 vez por semana = 4 clases mensuales
      totalClasses = 4;
      classesPerWeek = 1;
      break;
    default:
      totalClasses = 4;
      classesPerWeek = 1;
  }
  
  // Calcular cuántas semanas necesitamos para completar las clases
  const weeksNeeded = Math.ceil(totalClasses / classesPerWeek);
  
  // El próximo cobro será después de esas semanas
  const nextBillingDate = new Date(startDate);
  nextBillingDate.setDate(nextBillingDate.getDate() + (weeksNeeded * 7));
  
  // Ajustar al siguiente día de entrenamiento si no cae en uno
  let dayOfWeek = nextBillingDate.getDay();
  while (!TRAINING_WEEKDAYS.includes(dayOfWeek)) {
    nextBillingDate.setDate(nextBillingDate.getDate() + 1);
    dayOfWeek = nextBillingDate.getDay();
  }
  
  return nextBillingDate.toISOString().split('T')[0];
};

const today = new Date();
const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString().split('T')[0];
const thisMonth = new Date(today.getFullYear(), today.getMonth(), 5).toISOString().split('T')[0];
const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 20).toISOString().split('T')[0];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    fechaIngreso: thisMonth,
    estado: 'activo' as const,
    planId: PlanId.FOUR_TIMES_A_WEEK,
    paymentDate: thisMonth,
    nextBillingDate: getNextBillingDate(thisMonth),
    avatarUrl: 'https://picsum.photos/seed/juan/100/100',
  },
  {
    id: '2',
    nombre: 'Maria García',
    email: 'maria@example.com',
    fechaIngreso: thisMonth,
    estado: 'activo' as const,
    planId: PlanId.THRICE_A_WEEK,
    paymentDate: lastMonth,
    nextBillingDate: getNextBillingDate(lastMonth),
    avatarUrl: 'https://picsum.photos/seed/maria/100/100',
  },
  {
    id: '3',
    nombre: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    fechaIngreso: thisMonth,
    estado: 'activo' as const,
    planId: PlanId.TWICE_A_WEEK,
    paymentDate: thisMonth,
    nextBillingDate: getNextBillingDate(thisMonth),
    avatarUrl: 'https://picsum.photos/seed/carlos/100/100',
  },
  {
    id: '4',
    nombre: 'Ana López',
    email: 'ana@example.com',
    fechaIngreso: twoMonthsAgo,
    estado: 'activo' as const,
    planId: PlanId.ONCE_A_WEEK,
    paymentDate: twoMonthsAgo,
    nextBillingDate: getNextBillingDate(twoMonthsAgo),
    avatarUrl: 'https://picsum.photos/seed/ana/100/100',
  },
  {
    id: '5',
    nombre: 'Luis Martinez',
    email: 'luis@example.com',
    fechaIngreso: lastMonth,
    estado: 'activo' as const,
    planId: PlanId.FOUR_TIMES_A_WEEK,
    paymentDate: lastMonth,
    nextBillingDate: getNextBillingDate(lastMonth),
    avatarUrl: 'https://picsum.photos/seed/luis/100/100',
  },
];
