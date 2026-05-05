export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'

import { getEffectiveRole, requireRole } from '@/lib/auth-utils'
import { redirect } from 'next/navigation'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  CalendarCheck,
  XCircle,
  PlusCircle
} from 'lucide-react'
import DashboardCharts from './DashboardCharts'
import ReceptionistDashboard from '@/components/admin/ReceptionistDashboard'

// Helper for sparklines (mini charts)
function Sparkline({ data, color }: { data: number[], color: string }) {
  if (!data || data.length < 2) return <div className="w-[60px] h-[20px] bg-slate-50 flex items-center justify-center text-[8px] text-slate-300 font-bold rounded">NO DATA</div>
  
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 60
  const height = 20
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((d - min) / range) * height
  }))
  const path = `M ${points.map(p => `${p.x},${p.y}`).join(' L')}`

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default async function AdminPage() {
  const context = await requireRole(['admin', 'receptionist', 'doctor', 'staff'])
  const { user, role, tenantId, isSuperadmin } = context
  const supabase = await createClient()

  const isClinicAdmin = role === 'admin' || isSuperadmin
  const isDoctor = role === 'doctor'
  const isReceptionist = role === 'receptionist'
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOf7DaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const startOfToday = new Date(now.setHours(0, 0, 0, 0)).toISOString()
  const endOfToday = new Date(now.setHours(23, 59, 59, 999)).toISOString()

  // Get doctor's staff ID if applicable
  let staffId: string | null = null
  if (isDoctor) {
    const { data: staffData } = await supabase
      .from('staff_members')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()
    staffId = staffData?.id || null
  }

  // 1. Parallel Data Fetching
  const appointmentsQuery = supabase
      .from('appointments')
      .select('status, start_time')
      .eq('tenant_id', tenantId)
  
  const todayAppointmentsQuery = supabase
      .from('appointments')
      .select('id, start_time, status, patient:patients(first_name, last_name), service:services(name)')
      .eq('tenant_id', tenantId)
      .gte('start_time', startOfToday)
      .lte('start_time', endOfToday)

  // FILTER FOR DOCTOR: If doctor, only show THEIR appointments
  if (isDoctor && staffId) {
    appointmentsQuery.eq('staff_id', staffId)
    todayAppointmentsQuery.eq('staff_id', staffId)
  }

  const [
    { data: appointmentsMonth },
    { data: appointmentsToday },
    { count: newPatientsCount },
    { count: cancelledAppointmentsCount },
    { data: recentPatients },
    { data: allServicesUsage },
    { data: historicalAppointments },
    { data: historicalPatients },
  ] = await Promise.all([
    appointmentsQuery.gte('start_time', startOfMonth),
    todayAppointmentsQuery.order('start_time', { ascending: true }),

    // New Patients this month (Admin/Receptionist sees all, Doctor sees only assigned if filter added, but usually clinic total is fine or hide)
    supabase
      .from('patients')
      .select('id', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('created_at', startOfMonth),

    // Cancelled this month
    (isDoctor && staffId ? supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('staff_id', staffId) : supabase.from('appointments').select('id', { count: 'exact', head: true }))
      .eq('tenant_id', tenantId)
      .eq('status', 'cancelled')
      .gte('start_time', startOfMonth),

    // Recent Patients
    supabase
      .from('patients')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(5),

    // Services Usage (Pie chart data)
    (isDoctor && staffId ? supabase.from('appointments').select('service:services(name)').eq('staff_id', staffId) : supabase.from('appointments').select('service:services(name)'))
      .eq('tenant_id', tenantId)
      .eq('status', 'completed'),

    // Historical data for sparklines (Last 7 days)
    (isDoctor && staffId ? supabase.from('appointments').select('start_time, status').eq('staff_id', staffId) : supabase.from('appointments').select('start_time, status'))
      .eq('tenant_id', tenantId)
      .gte('start_time', startOf7DaysAgo),

    supabase
      .from('patients')
      .select('created_at')
      .eq('tenant_id', tenantId)
      .gte('created_at', startOf7DaysAgo),
  ])

  // Payments: guarded separately — table may not exist yet
  let paymentsMonth: any[] = []
  try {
    const { data: paymentsData, error: paymentsErr } = await supabase
      .from('payments')
      .select('amount, created_at')
      .eq('tenant_id', tenantId)
      .gte('created_at', startOfMonth)
    if (!paymentsErr) paymentsMonth = paymentsData ?? []
  } catch {
    // Table doesn't exist yet — revenue shows as $0
  }

  // --- Process Metrics ---
  const incomeMonth = (paymentsMonth || []).reduce((acc, curr: any) => acc + (Number(curr.amount) || 0), 0)
  
  const totalVisits = (appointmentsMonth || []).length
  const newPatients = newPatientsCount || 0
  const cancelledVisits = cancelledAppointmentsCount || 0

  // --- Process Sparklines (7 days) ---
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  // Revenue Sparkline from Payments table
  const incomeSparkline = last7Days.map(date => 
    (paymentsMonth || [])
      .filter(p => p.created_at.startsWith(date))
      .reduce((acc, curr: any) => acc + (Number(curr.amount) || 0), 0)
  )

  const appointmentsSparkline = last7Days.map(date => 
    (historicalAppointments || []).filter(a => a.start_time.startsWith(date)).length
  )

  const patientsSparkline = last7Days.map(date => 
    (historicalPatients || []).filter(p => p.created_at.startsWith(date)).length
  )

  const cancelledSparkline = last7Days.map(date => 
    (historicalAppointments || []).filter(a => a.status === 'cancelled' && a.start_time.startsWith(date)).length
  )

  // --- Process Weekly Income Chart from Payments ---
  const daysLabels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const weeklyIncome = daysLabels.map((day, index) => {
    const dayIncome = (paymentsMonth || [])
      .filter((p: any) => new Date(p.created_at).getDay() === index)
      .reduce((acc, curr: any) => acc + (Number(curr.amount) || 0), 0)
    
    return { day, amount: dayIncome }
  })

  // --- Process Service Data ---
  const serviceCounts: Record<string, number> = {}
  allServicesUsage?.forEach((a: any) => {
    const name = a.service?.name || 'Otro'
    serviceCounts[name] = (serviceCounts[name] || 0) + 1
  })
  const serviceData = Object.entries(serviceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-10">
      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card - Only for Admin/Receptionist */}
        {(isClinicAdmin || isReceptionist) && (
          <div className="bg-card-bg p-6 rounded-3xl shadow-card border border-slate-200/50 dark:border-white/5 flex flex-col justify-between h-40 transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-slate-50/50 dark:bg-white/5 rounded-2xl">
                <DollarSign className="h-5 w-5 text-emerald-500" />
              </div>
              <Sparkline data={incomeSparkline} color="#10b981" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ingresos (Mes)</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-text-main tracking-tight">${incomeMonth.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Patients Card */}
        <div className="bg-card-bg p-6 rounded-3xl shadow-card border border-slate-200/50 dark:border-white/5 flex flex-col justify-between h-40 transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-slate-50/50 dark:bg-white/5 rounded-2xl">
              <PlusCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <Sparkline data={patientsSparkline} color="#10b981" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pacientes Nuevos (Mes)</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-text-main tracking-tight">{newPatients}</h3>
            </div>
          </div>
        </div>

        {/* Visits Card */}
        <div className="bg-card-bg p-6 rounded-3xl shadow-card border border-slate-200/50 dark:border-white/5 flex flex-col justify-between h-40 transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-slate-50/50 dark:bg-white/5 rounded-2xl">
              <CalendarCheck className="h-5 w-5 text-emerald-500" />
            </div>
            <Sparkline data={appointmentsSparkline} color="#10b981" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              {isDoctor ? 'Mis Citas (Mes)' : 'Citas Totales (Mes)'}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-text-main tracking-tight">{totalVisits}</h3>
            </div>
          </div>
        </div>

        {/* Cancelled Card */}
        <div className="bg-card-bg p-6 rounded-3xl shadow-card border border-slate-200/50 dark:border-white/5 flex flex-col justify-between h-40 transition-all hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-slate-50/50 dark:bg-white/5 rounded-2xl">
              <XCircle className="h-5 w-5 text-slate-400" />
            </div>
            <Sparkline data={cancelledSparkline} color="#94A3B8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cancelaciones (Mes)</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-text-main tracking-tight">{cancelledVisits}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Area - Hidden for Doctors */}
      {(isClinicAdmin || isReceptionist) && (
        <DashboardCharts incomeData={weeklyIncome} serviceData={serviceData} />
      )}

      {/* Bottom Sections: Activity & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Patients Table */}
        <div className="bg-card-bg rounded-[2.5rem] shadow-card border border-slate-200/50 dark:border-white/5 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100/50 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50/50 dark:bg-white/5 rounded-xl">
                <Activity className="h-4 w-4 text-emerald-500" />
              </div>
              <h3 className="text-md font-black text-text-main uppercase tracking-tight">Actividad Reciente</h3>
            </div>
            <button className="text-[10px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-colors">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100/50 dark:border-white/5">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentPatients?.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/30 transition-all group">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100/80 dark:bg-white/5 text-slate-500 dark:text-slate-400 flex items-center justify-center font-black text-[10px] border border-slate-200/50 dark:border-white/10">
                          {p.first_name[0]}{p.last_name[0]}
                        </div>
                        <span className="text-sm font-black text-slate-600 dark:text-slate-300 group-hover:text-emerald-500 transition-colors uppercase tracking-tight">
                          {p.first_name} {p.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                        Nuevo
                      </span>
                    </td>
                  </tr>
                ))}
                {(!recentPatients || recentPatients.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-8 py-12 text-center text-slate-400 text-sm italic">
                      No hay pacientes registrados recientemente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Schedule List */}
        <div className="bg-card-bg rounded-[2.5rem] shadow-card border border-slate-200/50 dark:border-white/5 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100/50 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50/50 dark:bg-white/5 rounded-xl">
                <Calendar className="h-4 w-4 text-emerald-500" />
              </div>
            <h3 className="text-md font-black text-text-main uppercase tracking-tight">Próximas Citas Hoy</h3>
            </div>
            <span className="text-[10px] font-black text-text-main bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
              {appointmentsToday?.length || 0} Total
            </span>
          </div>
          <div className="p-8 space-y-6">
            {appointmentsToday?.slice(0, 4).map((a) => (
              <div key={a.id} className="flex items-center justify-between group p-2 hover:bg-slate-50/50 dark:hover:bg-white/5 rounded-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-1.5 bg-slate-100 dark:bg-white/10 group-hover:bg-emerald-500 transition-all rounded-full" />
                  <div>
                    <h4 className="text-sm font-black text-text-main group-hover:text-emerald-500 transition-colors uppercase tracking-tight">
                      {(a.patient as any)?.first_name} {(a.patient as any)?.last_name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      {(a.service as any)?.name || 'Servicio General'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-text-main">
                    {new Date(a.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className={`text-[9px] uppercase font-black tracking-[0.1em] px-2 py-0.5 rounded-md border ${(a.status === 'confirmed' || a.status === 'completed') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                    {(a.status === 'confirmed' || a.status === 'completed') ? 'Confirmado' : 'Pendiente'}
                  </p>
                </div>
              </div>
            ))}
            {(!appointmentsToday || appointmentsToday.length === 0) && (
              <div className="py-12 text-center text-slate-400 text-xs italic font-medium">
                No hay citas programadas para el resto del día.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
