export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth-utils'
import { NewAppointmentModal } from './NewAppointmentModal'
import PaymentModal from './PaymentModal'
import MarkAsAttendedButton from './MarkAsAttendedButton'
import WhatsAppReminderButton from './WhatsAppReminderButton'
import { Calendar as CalendarIcon, Clock, User, Stethoscope, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

export default async function AppointmentsPage() {
  await requireRole(['admin', 'receptionist', 'doctor', 'staff'])
  const supabase = await createClient()

  // 1. Fetch data for the modal selects
  const { data: patients } = await supabase.from('patients').select('id, first_name, last_name, dui').order('last_name')
  const { data: doctors } = await supabase.from('staff_members').select('id, full_name').eq('specialty', 'doctor').order('full_name')
  const { data: services } = await supabase.from('services').select('id, name, price, duration_minutes').eq('is_active', true).order('name')

  // 2. Fetch today's appointments
  const today = new Date()
  today.setHours(0,0,0,0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, patient:patients(first_name, last_name, phone), doctor:staff_members(full_name), service:services(name, price), clinic:clinics(name)')
    .gte('start_time', today.toISOString())
    .lt('start_time', tomorrow.toISOString())
    .order('start_time')

  const statusMap: Record<string, { label: string, color: string, icon: any }> = {
    'pending': { label: 'Pendiente', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', icon: Clock },
    'confirmed': { label: 'Confirmada', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', icon: CheckCircle2 },
    'completed': { label: 'Pagada', color: 'bg-emerald-500 text-white dark:text-black border-emerald-600', icon: CheckCircle2 },
    'cancelled': { label: 'Cancelada', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: XCircle },
    'no_show': { label: 'Inasistencia', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', icon: AlertCircle },
    'attended_pending_payment': { label: 'Atendido / Pendiente', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', icon: Clock }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-text-main flex items-center gap-3 uppercase tracking-tight leading-none mb-1">
            <CalendarIcon className="h-6 w-6 text-emerald-500" /> Agenda de Reservas
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Citas hoy: {today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
        </div>
        <NewAppointmentModal 
          patients={patients || []} 
          doctors={doctors || []} 
          services={services || []} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Simple Agenda / Timeline */}
        <div className="lg:col-span-3 space-y-4">
          {!appointments || appointments.length === 0 ? (
            <div className="bg-card-bg rounded-[2.5rem] border border-dashed border-slate-200/50 dark:border-white/10 p-20 text-center text-slate-400 shadow-card">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-black text-lg text-text-main uppercase tracking-tight">No hay citas registradas para hoy.</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Agende su primera consulta con el botón de "Nueva Cita".</p>
            </div>
          ) : (
            appointments.map((apt) => {
              const status = statusMap[apt.status] || statusMap.pending
              const canPay = apt.status !== 'completed' && apt.status !== 'cancelled'
              const isPaid = apt.status === 'completed'
              
              return (
                <div key={apt.id} className="bg-card-bg p-6 rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-card flex items-center gap-6 hover:-translate-y-1 transition-all group">
                  <div className={`px-4 py-5 rounded-2xl flex flex-col items-center justify-center min-w-[110px] border transition-all ${
                    isPaid ? 'bg-emerald-500 border-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-slate-50/50 dark:bg-white/5 border-slate-200/50 dark:border-white/10'
                  }`}>
                    <span className={`text-xl font-black tracking-tighter ${isPaid ? 'text-white dark:text-black' : 'text-text-main'}`}>
                      {new Date(apt.start_time).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                    <span className={`text-[9px] uppercase font-black mt-1 tracking-widest leading-none ${isPaid ? 'text-white/70 dark:text-black/60' : 'text-slate-500'}`}>HORARIO</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-black text-text-main truncate tracking-tight uppercase leading-none">{apt.service?.name}</h3>
                      <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.1em] border shadow-sm ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                      <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-tight">
                        <User className="h-4 w-4 text-emerald-500/70" />
                        <span className="text-text-main">{apt.patient?.first_name} {apt.patient?.last_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-tight">
                        <Stethoscope className="h-4 w-4 text-slate-500/50" />
                        <span>Dr. {apt.doctor?.full_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-text-main font-black text-xl tracking-tighter tabular-nums">${apt.service?.price}</div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Monto</div>
                    </div>
                    
                    {canPay && (
                      <div className="flex items-center gap-3">
                        <WhatsAppReminderButton appointment={apt as any} />
                        {(apt.status === 'pending' || apt.status === 'confirmed') && (
                          <MarkAsAttendedButton appointmentId={apt.id} />
                        )}
                        <PaymentModal appointment={apt} />
                      </div>
                    )}
                    {isPaid && (
                      <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Sidebar Mini-Calendar */}
        <div className="space-y-6">
          <div className="bg-emerald-500 rounded-[2.5rem] p-8 text-white dark:text-black shadow-lg shadow-emerald-500/20">
            <h3 className="font-black text-lg mb-6 flex items-center gap-3 tracking-tight uppercase leading-none"><CalendarIcon className="h-5 w-5" /> Vista del Mes</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-black opacity-60 uppercase tracking-widest mb-4">
              <span>D</span><span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-black">
              {Array.from({length: 31}).map((_, i) => (
                <div key={i} className={`h-8 w-8 flex items-center justify-center rounded-xl text-[11px] transition-all cursor-pointer ${i + 1 === today.getDate() ? 'bg-white text-emerald-600 shadow-xl' : 'hover:bg-white/20'}`}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card-bg rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 p-8 shadow-card">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100/50 dark:border-white/5 pb-4 mb-6">Métricas del Día</h4>
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Consultas</span>
                   <span className="text-xl font-black text-text-main">{appointments?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-500">
                   <span className="text-[11px] font-black uppercase tracking-widest opacity-60">Ingresos Proyectados</span>
                   <span className="text-xl font-black tabular-nums tracking-tighter">${appointments?.reduce((acc, apt) => acc + (Number(apt.service?.price) || 0), 0).toFixed(2)}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
