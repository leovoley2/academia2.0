
import type { Plan, Student } from './types';
import { PlanId } from './types';

export const PLANS: Record<PlanId, Plan> = {
  [PlanId.ONCE_A_WEEK]: { id: PlanId.ONCE_A_WEEK, name: '1 vez por semana', price: 130, frequency: 1 },
  [PlanId.TWICE_A_WEEK]: { id: PlanId.TWICE_A_WEEK, name: '2 veces por semana', price: 170, frequency: 2 },
  [PlanId.THRICE_A_WEEK]: { id: PlanId.THRICE_A_WEEK, name: '3 veces por semana', price: 200, frequency: 3 },
  [PlanId.FOUR_TIMES_A_WEEK]: { id: PlanId.FOUR_TIMES_A_WEEK, name: '4 veces por semana', price: 230, frequency: 4 },
};

export const TRAINING_DAYS = ['Lunes', 'Miércoles', 'Viernes', 'Sábado'];

const getNextBillingDate = (paymentDate: string): string => {
  const date = new Date(paymentDate + 'T00:00:00');
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split('T')[0];
};

const today = new Date();
const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString().split('T')[0];
const thisMonth = new Date(today.getFullYear(), today.getMonth(), 5).toISOString().split('T')[0];
const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 20).toISOString().split('T')[0];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    planId: PlanId.FOUR_TIMES_A_WEEK,
    paymentDate: thisMonth,
    nextBillingDate: getNextBillingDate(thisMonth),
    avatarUrl: 'https://picsum.photos/seed/juan/100/100',
  },
  {
    id: '2',
    name: 'Maria García',
    planId: PlanId.THRICE_A_WEEK,
    paymentDate: lastMonth,
    nextBillingDate: getNextBillingDate(lastMonth),
    avatarUrl: 'https://picsum.photos/seed/maria/100/100',
  },
  {
    id: '3',
    name: 'Carlos Rodríguez',
    planId: PlanId.TWICE_A_WEEK,
    paymentDate: thisMonth,
    nextBillingDate: getNextBillingDate(thisMonth),
    avatarUrl: 'https://picsum.photos/seed/carlos/100/100',
  },
  {
    id: '4',
    name: 'Ana López',
    planId: PlanId.ONCE_A_WEEK,
    paymentDate: twoMonthsAgo,
    nextBillingDate: getNextBillingDate(twoMonthsAgo),
    avatarUrl: 'https://picsum.photos/seed/ana/100/100',
  },
  {
    id: '5',
    name: 'Luis Martinez',
    planId: PlanId.FOUR_TIMES_A_WEEK,
    paymentDate: lastMonth,
    nextBillingDate: getNextBillingDate(lastMonth),
    avatarUrl: 'https://picsum.photos/seed/luis/100/100',
  },
];
