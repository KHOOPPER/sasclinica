'use client'

import { 
  Users, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  MessageSquare,
  PlusCircle,
  Search,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'

interface ReceptionistDashboardProps {
  stats: {
    todayAppointments: any[]
    newPatients: number
    incomeToday: number
    totalAppointmentsToday: number
  }
}

export default function ReceptionistDashboard({ stats }: ReceptionistDashboardProps) {
  return (
    <div className="space-y-8 max-w-[1400px] mx-auto pb-10">
      {/* ── QUICK ACTIONS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/pacientes" className="group">
          <div className="bg-card-bg p-6 rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-card hover:-translate-y-1 transition-all flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <PlusCircle className="h-6 w-6 text-emerald-500 group-hover:text-white" />
            </div>
            <div>
              <h3 className="font-black text-text-main uppercase tracking-tight">Registrar Paciente</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Añadir nuevo al sistema</p>
            </div>
          </div>
        </Link>
        <Link href="/admin/reservas" className="group">
          <div className="bg-card-bg p-6 rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-card hover:-translate-y-1 transition-all flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <Calendar className="h-6 w-6 text-emerald-500 group-hover:text-white" />
            </div>
            <div>
              <h3 className="font-black text-text-main uppercase tracking-tight">Nueva Cita</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Agendar consulta hoy</p>
            </div>
          </div>
        </Link>
        <div className="bg-emerald-500 p-6 rounded-3xl shadow-lg shadow-emerald-500/20 flex items-center justify-between text-white dark:text-black">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/20 dark:bg-black/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black uppercase tracking-tight text-sm">Caja de Hoy</h3>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Ingresos confirmados</p>
            </div>
          </div>
          <p className="text-2xl font-black tabular-nums tracking-tighter">${stats.incomeToday.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── MAIN QUEUE (AGENDA DE HOY) ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-text-main uppercase tracking-tight flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-500" /> Pacientes para Hoy
            </h2>
            <div className="bg-slate-50/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl px-4 py-2 flex items-center gap-3">
              <Search className="h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Buscar en agenda..." className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest text-text-main w-32 placeholder:text-slate-500" />
            </div>
          </div>

          <div className="space-y-4">
            {stats.todayAppointments.length === 0 ? (
              <div className="bg-card-bg rounded-[2.5rem] border border-dashed border-slate-200/50 dark:border-white/10 p-20 text-center text-slate-400 shadow-card">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="font-black text-lg text-text-main uppercase tracking-tight">No hay citas para hoy</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Las citas aparecerán aquí a medida que se agenden.</p>
              </div>
            ) : (
              stats.todayAppointments.map((apt) => (
                <div key={apt.id} className="bg-card-bg p-5 rounded-3xl border border-slate-200/50 dark:border-white/5 shadow-card flex items-center gap-6 hover:-translate-y-1 transition-all">
                  <div className="bg-slate-50/50 dark:bg-white/5 h-14 w-14 rounded-2xl flex flex-col items-center justify-center border border-slate-200/50 dark:border-white/10 shrink-0">
                    <span className="text-xs font-black text-text-main">
                      {new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-black text-text-main uppercase tracking-tight">{apt.patient?.first_name} {apt.patient?.last_name}</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{apt.service?.name}</p>
                  </div>

                  <div className="flex items-center gap-2">
                     <button className="p-3 rounded-2xl bg-slate-50/50 dark:bg-white/5 text-slate-400 hover:text-emerald-500 transition-colors" title="Enviar WhatsApp">
                        <MessageSquare className="h-5 w-5" />
                     </button>
                     <Link href="/admin/reservas" className="p-3 rounded-2xl bg-emerald-500 text-white dark:text-black hover:shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-6">
                        Gestionar <ArrowRight className="h-4 w-4" />
                     </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── SIDEBAR METRICS ── */}
        <div className="space-y-8">
           <div className="bg-card-bg p-8 rounded-[3rem] border border-slate-200/50 dark:border-white/5 shadow-card">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Métricas de Recepción</h3>
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-emerald-500" />
                    </div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Nuevos Pacientes</span>
                  </div>
                  <span className="text-xl font-black text-text-main">{stats.newPatients}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    </div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Citas Completadas</span>
                  </div>
                  <span className="text-xl font-black text-text-main">{stats.todayAppointments.filter(a => a.status === 'completed').length}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100/50 dark:border-white/5">
                 <div className="p-6 bg-slate-50/50 dark:bg-white/5 rounded-[2rem] border border-slate-200/50 dark:border-white/5">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Próximo Recordatorio</p>
                    <p className="text-sm font-black text-text-main uppercase tracking-tight mb-4">Paciente: Maria Gonzalez</p>
                    <button className="w-full py-4 bg-emerald-500 text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
                       Enviar WhatsApp
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
