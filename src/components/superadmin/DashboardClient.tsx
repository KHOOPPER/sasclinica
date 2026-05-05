'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Building2, Globe, Users, Calendar, Clock, ArrowUpRight,
  Activity, Stethoscope, UserCheck, LayoutDashboard,
  ChevronRight, CheckCircle2, XCircle, AlertCircle, Timer,
  TrendingUp, Database, ShieldAlert
} from 'lucide-react'
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'

interface Stats {
  totalClinics: number
  totalTenants: number
  totalSites: number
  totalUsers: number
  totalPatients: number
  totalStaff: number
  totalAppointments: number
  recentClinics: any[]
  recentAppointments: any[]
  growthData: any[]
  tenantDetails: any[]
  totalTrials: number
  activeSubscriptions: number
}

interface DashboardClientProps {
  stats: Stats
}



export default function DashboardClient({ stats }: DashboardClientProps) {
  const [mounted, setMounted] = useState(false)
  const [dateStr, setDateStr] = useState('')
  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    setMounted(true)
    const update = () => {
      setDateStr(new Date().toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }))
      setTimeStr(new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="space-y-8">

      {/* ── HEADER BANNER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Sistema Operativo</span>
          </div>
          <h1 className="text-4xl font-black text-text-main tracking-tighter uppercase leading-none">
            Super Admin
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-2">Centro de control de la red SaaS</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card-bg border border-slate-200/50 dark:border-white/5 shadow-sm rounded-2xl px-5 py-3 text-right backdrop-blur-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{mounted ? dateStr : '—'}</p>
            <p className="text-2xl font-black text-text-main tabular-nums tracking-tight leading-none">{mounted ? timeStr : '—:—'}</p>
          </div>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SaaSKpiCard
          label="MRR (Ingresos Recurrentes Mensuales)"
          value="$0"
          subtitle="Esperando transacciones"
          subtitleColor="text-slate-400"
          icon={TrendingUp}
          color="emerald"
        />
        <SaaSKpiCard
          label="Suscripciones Activas"
          value={stats.activeSubscriptions.toString()}
          subtitle={stats.activeSubscriptions === 1 ? "Plan Premium Activo" : "Planes Premium Activos"}
          subtitleColor="text-emerald-500"
          icon={CheckCircle2}
          color="emerald"
        />
        <SaaSKpiCard
          label="Clínicas en prueba (Trials)"
          value={stats.totalTrials.toString()}
          subtitle={stats.totalTrials === 0 ? "Sin periodos de prueba" : stats.totalTrials === 1 ? "1 Clínica on trial" : `${stats.totalTrials} Clínicas on trial`}
          subtitleColor="text-orange-500"
          icon={Timer}
          color="orange"
        />
      </div>

      {/* ── MAIN GRID (Row 2) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Growth Chart */}
        <div className="xl:col-span-2 bg-card-bg rounded-[2.5rem] shadow-card border border-slate-200/50 dark:border-white/5 overflow-hidden">
          <div className="p-8 pb-2 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black text-text-main uppercase tracking-tight flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Crecimiento de la Red
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Tenants acumulados · últimos 6 meses</p>
            </div>
            <Link href="/superadmin/clinicas" className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:gap-2 transition-all">
              Ver todos <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="h-72 p-4 pb-6">
            {mounted && stats.growthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--brand-primary)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false}
                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                      borderRadius: '1.25rem', fontFamily: 'inherit',
                      boxShadow: 'var(--card-shadow)',
                      padding: '12px 16px',
                      backdropFilter: 'blur(10px)'
                    }}
                    labelStyle={{ fontWeight: 800, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}
                    itemStyle={{ fontWeight: 700, fontSize: 13, color: '#10b981' }}
                    formatter={(v: any) => [v, 'Tenants']}
                  />
                  <Area type="monotone" dataKey="clinicas" stroke="#10b981"
                    strokeWidth={3} fill="url(#grad)" animationDuration={800} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-300">
                <Database className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-card-bg rounded-[2.5rem] shadow-card border border-slate-200/50 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="p-6 pb-4 flex items-center justify-between">
            <h2 className="text-base font-black text-text-main uppercase tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-500" />
              Estado del Sistema
            </h2>
            <Link href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-colors">
              Historial
            </Link>
          </div>
          <div className="flex-1 px-4 pb-6 flex flex-col justify-center items-center text-center">
             <div className="h-16 w-16 rounded-3xl bg-emerald-500/5 flex items-center justify-center mb-4 transition-colors">
               <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-80" />
             </div>
             <p className="text-sm font-black text-text-main uppercase tracking-tight">Todos los sistemas operativos</p>
             <p className="text-[11px] text-slate-400 font-medium mt-1.5 max-w-[200px] mx-auto">No se han detectado alertas críticas en el sistema en las últimas 24h.</p>
          </div>
        </div>
      </div>

      {/* ── BOTTOM GRID (Row 3) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* TENANT TABLE */}
        <div className="xl:col-span-2 bg-card-bg rounded-[2.5rem] shadow-card border border-slate-200/50 dark:border-white/5 overflow-hidden">
          <div className="p-8 flex items-center justify-between border-b border-slate-100/50 dark:border-white/5">
            <h2 className="text-base font-black text-text-main uppercase tracking-tight flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-500" />
              Red de Tenants
            </h2>
            <Link href="/superadmin/clinicas"
              className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              Gestionar <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100/50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02]">
                  <th className="text-left py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Tenant</th>
                  <th className="text-left py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Slug</th>
                  <th className="text-center py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Clínicas</th>
                  <th className="text-center py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Usuarios</th>
                  <th className="text-left py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Registro</th>
                  <th className="text-right py-5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Acceso</th>
                </tr>
              </thead>
              <tbody>
                {stats.tenantDetails.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <EmptyState label="No hay tenants registrados" />
                    </td>
                  </tr>
                ) : (
                  stats.tenantDetails.map((t: any) => (
                    <tr key={t.id} className="border-b border-slate-50/50 dark:border-white/5 last:border-0 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] group transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-brand-primary/5 flex items-center justify-center text-emerald-500 font-black text-sm uppercase leading-none">
                            {t.name[0]}
                          </div>
                          <span className="font-black text-text-main text-sm uppercase">{t.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <code className="text-[11px] bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg text-slate-500 dark:text-slate-400 font-mono ring-1 ring-slate-200/50 dark:ring-white/5">/{t.slug}</code>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-sm font-black text-text-main tabular-nums">
                          {Array.isArray(t.clinics) ? t.clinics.length : 0}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-sm font-black text-text-main tabular-nums">
                          {Array.isArray(t.profiles) ? t.profiles.length : 0}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[11px] text-slate-400 font-medium tracking-wide">
                        {new Date(t.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {t.clinics && t.clinics.length > 0 && (
                            <Link 
                              href={`/admin?clinicId=${t.clinics[0].id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-slate-950 text-[10px] font-black text-white uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-sm h-8"
                            >
                              Modo Dios
                            </Link>
                          )}
                          <Link href={`/${t.slug}`} target="_blank"
                            className="inline-flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-500 transition-colors">
                            Visitar <ArrowUpRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SAAS ACTIVITY LOG */}
        <div className="bg-card-bg rounded-[2.5rem] shadow-card border border-slate-200/50 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100/50 dark:border-white/5">
            <h2 className="text-base font-black text-text-main uppercase tracking-tight flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" />
              Actividad Reciente
            </h2>
          </div>
          <div className="flex-1 p-6 relative">
            <div className="absolute left-[29px] top-8 bottom-8 w-px bg-slate-100/50"></div>
            <div className="space-y-6 relative z-10">
              {stats.tenantDetails.length > 0 ? (
                <>
                  <LogItem text={['Tenant', stats.tenantDetails[0].name, 'ha sido verificado en el sistema.']} time="Activo" color="bg-emerald-500" />
                  <LogItem text={['Sistema', 'Infraestructura SaaS', 'configuración de dominio completada.']} time="Hoy" color="bg-emerald-500" />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 opacity-20">
                  <Database className="h-8 w-8 text-slate-400" />
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-2">Sin actividad</p>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-t border-slate-50/50 text-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              Fin de los registros recientes
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, { bg: string; text: string; light: string }> = {
  emerald:{ bg: 'bg-emerald-500/10',    text: 'text-emerald-500',    light: 'bg-emerald-50' },
  cyan:   { bg: 'bg-emerald-500/10',    text: 'text-emerald-500',    light: 'bg-emerald-50' },
  blue:   { bg: 'bg-emerald-500/10',    text: 'text-emerald-500',    light: 'bg-emerald-50' },
  violet: { bg: 'bg-emerald-500/10',    text: 'text-emerald-500',    light: 'bg-emerald-50' },
  orange: { bg: 'bg-orange-500/10',     text: 'text-orange-500',     light: 'bg-orange-50' },
}

function SaaSKpiCard({ label, value, subtitle, subtitleColor, icon: Icon, color, href }: {
  label: string; value: string; subtitle: string; subtitleColor: string; icon: any; color: string; href?: string
}) {
  const c = COLOR_MAP[color] || COLOR_MAP.emerald
  const inner = (
    <div className="bg-card-bg rounded-[2.5rem] shadow-card border border-slate-200/50 dark:border-white/5 p-8 dark:hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all group cursor-pointer flex flex-col justify-between min-h-[160px]">
      <div className="flex items-start gap-4 mb-3">
        <div className={`h-12 w-12 rounded-2xl ${c.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
          <Icon className={`h-6 w-6 ${c.text}`} />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 leading-snug pt-1">{label}</p>
      </div>
      <div>
        <p className="text-4xl font-black text-text-main tracking-tighter tabular-nums leading-none mb-1.5">{value}</p>
        <p className={`text-[11px] font-bold ${subtitleColor} tracking-wide`}>{subtitle}</p>
      </div>
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

function AlertItem({ icon: Icon, type, title, desc, time }: { icon: any, type: string, title: string, desc: string, time: string }) {
  const colors = {
    error: 'text-rose-500 bg-rose-50',
    warning: 'text-amber-500 bg-amber-50',
    info: 'text-emerald-500 bg-emerald-500/10'
  }
  const colorClass = colors[type as keyof typeof colors] || colors.info;

  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50/50 transition-colors cursor-default border border-transparent hover:border-slate-100/50">
      <div className={`h-10 w-10 rounded-xl shrink-0 flex items-center justify-center ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-[13px] font-bold text-text-main tracking-tight leading-tight mb-0.5">{title}</p>
        <p className="text-[11px] text-slate-500 font-medium truncate">{desc}</p>
      </div>
      <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 whitespace-nowrap pt-1 line-clamp-1">{time}</span>
    </div>
  )
}

function LogItem({ text, time, color, bold }: { text: string[], time: string, color: string, bold?: boolean }) {
  return (
    <div className="relative pl-6">
      <div className={`absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white ${color}`}></div>
      <p className="text-[13px] text-slate-600 leading-snug">
        <span className="font-bold text-slate-400">{text[0]} </span>
        <span className="font-black text-text-main">'{text[1]}'</span>
        {' '}<span className={bold ? "font-bold text-text-main" : "text-slate-500 font-medium"}>{text[2]}</span>
      </p>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{time}</p>
    </div>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-4 opacity-30">
      <Database className="h-8 w-8 text-slate-400" />
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  )
}
