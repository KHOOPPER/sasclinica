'use client'

import { useState } from 'react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

interface DashboardChartsProps {
  incomeData: { day: string; amount: number }[]
  serviceData: { name: string; value: number }[]
}

const COLORS = ['#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#34d399']

export default function DashboardCharts({ incomeData, serviceData }: DashboardChartsProps) {
  const [timeRange, setTimeRange] = useState('7D')

  const hasIncomeData = incomeData.some(d => d.amount > 0)
  const hasServiceData = serviceData.length > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Income Chart */}
      <div className="lg:col-span-2 bg-card-bg p-8 rounded-[2.5rem] shadow-card border border-slate-200/50 dark:border-white/5 transition-all flex flex-col hover:-translate-y-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Análisis de Ingresos</h3>
            <p className="text-xl font-black text-text-main uppercase tracking-tight">Crecimiento Semanal</p>
          </div>
          <div className="flex bg-slate-50/50 dark:bg-white/5 p-1 rounded-2xl border border-slate-100/50 dark:border-white/5">
            {['7D', '1M', '3M', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  timeRange === range 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                    : 'text-slate-400 hover:text-emerald-500'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-[300px] w-full min-h-[300px] flex items-center justify-center">
          {hasIncomeData ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <AreaChart data={incomeData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200/50 dark:text-white/5" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '4 4' }}
                  contentStyle={{ 
                    backgroundColor: 'rgb(15 23 42 / 0.9)', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)',
                    backdropFilter: 'blur(8px)',
                    padding: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center">
              <p className="text-sm text-slate-400 font-medium italic">No hay datos de ingresos suficientes para mostrar el gráfico.</p>
              <p className="text-[10px] text-slate-300 mt-1 uppercase font-bold tracking-widest">Real Clinic Data Only</p>
            </div>
          )}
        </div>
      </div>

      {/* Services Distribution Chart */}
      <div className="bg-card-bg p-8 rounded-[2.5rem] shadow-card border border-slate-200/50 dark:border-white/5 transition-all flex flex-col hover:-translate-y-1">
        <div className="mb-8">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Distribución</h3>
          <p className="text-xl font-black text-text-main uppercase tracking-tight">Servicios</p>
        </div>
        
        <div className="flex-1 min-h-[300px] w-full flex items-center justify-center">
          {hasServiceData ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgb(15 23 42 / 0.9)', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.3)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '12px',
                    fontWeight: '800',
                    color: '#fff'
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: 700, color: '#4A5568' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center">
              <p className="text-sm text-slate-400 font-medium italic">Sin datos de servicios.</p>
              <p className="text-[10px] text-slate-300 mt-1 uppercase font-bold tracking-widest">Real Clinic Data Only</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
