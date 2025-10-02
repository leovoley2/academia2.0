
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { Student } from '../types';
import { PLANS } from '../constants';

interface IncomeChartProps {
  students: Student[];
}

interface MonthlyData {
  name: string;
  ingresos: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f', '#ffbb28', '#ff8042', '#a4de6c', '#d0ed57', '#ffc658', '#8dd1e1'];

const IncomeChart: React.FC<IncomeChartProps> = ({ students }) => {
  const processData = (): MonthlyData[] => {
    const monthlyTotals: { [key: string]: number } = {};
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    
    students.forEach(student => {
      const paymentDate = new Date(student.paymentDate + 'T00:00:00');
      const year = paymentDate.getFullYear();
      const month = paymentDate.getMonth();
      const key = `${year}-${month}`;
      
      if (!monthlyTotals[key]) {
        monthlyTotals[key] = 0;
      }
      monthlyTotals[key] += student.planId ? PLANS[student.planId].price : 0;
    });

    const sortedKeys = Object.keys(monthlyTotals).sort();

    return sortedKeys.map(key => {
      const [year, monthIndex] = key.split('-').map(Number);
      return {
        name: `${monthNames[monthIndex]} ${year}`,
        ingresos: monthlyTotals[key],
      };
    });
  };

  const data = processData();

  if(data.length === 0) {
    return <div className="text-center py-10 text-gray-500">No hay datos de pagos para mostrar.</div>
  }
  
  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis tickFormatter={(value) => `S/ ${value}`} className="text-xs" />
          <Tooltip 
            cursor={{fill: 'rgba(206, 212, 218, 0.2)'}}
            contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', border: 'none', borderRadius: '0.5rem' }}
            labelStyle={{ color: '#ffffff' }}
          />
          <Legend />
          <Bar dataKey="ingresos" name="Ingresos (S/)" fill="#4f46e5">
            {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeChart;
