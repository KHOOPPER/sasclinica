export const dynamic = 'force-dynamic'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  DollarSign, CreditCard, AlertCircle, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { PricingGrid } from './PricingGrid'

export default async function SuperadminBillingPage() {
  // ── Auth ─────────────────────────────────────────────────────────────────
  let user: any = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    return <div className="p-10 text-slate-400 font-medium">Error de autenticación</div>
  }
  if (!user) return <div className="p-10 text-slate-400 font-medium">No autorizado</div>

  // ── Data fetching (fully guarded) ────────────────────────────────────────
  let tenants: any[] = []
  let fetchError = false

  try {
    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: tenantsData, error: tenantsErr } = await supabaseAdmin
      .from('tenants')
      .select(`
        id, name, slug, created_at, plan
      `)
      .order('created_at', { ascending: false })

    if (tenantsErr) throw tenantsErr
    tenants = tenantsData ?? []

  } catch (err) {
    console.error('[Facturación] fetch error:', err)
    fetchError = true
  }

  return (
    <div className="space-y-12 pb-16">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-text-main tracking-tight uppercase leading-none">Finanzas & Facturación</h1>
        <p className="text-slate-400 text-sm font-medium mt-2">
          Métricas clave y gestión de suscripciones SaaS
        </p>
      </div>

      {/* Fetch error banner */}
      {fetchError && (
        <div className="bg-rose-50 border-none rounded-2xl p-4 flex items-center gap-3 text-rose-600 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="text-[13px] font-bold uppercase tracking-wide">Error al cargar datos financieros. Intenta recargar la página.</p>
        </div>
      )}

      {/* ── KPIs Financieros ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-bg rounded-[2.5rem] p-8 shadow-card border border-slate-200/50 dark:border-white/5 flex flex-col justify-between group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">MRR Total</h3>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-text-main tabular-nums">$0.00</p>
            <p className="text-xs font-medium text-emerald-500 mt-1">+0.00% este mes</p>
          </div>
        </div>

        <div className="bg-card-bg rounded-[2.5rem] p-8 shadow-card border border-slate-200/50 dark:border-white/5 flex flex-col justify-between group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Suscripciones Activas</h3>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-text-main tabular-nums">{tenants.length}</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Suscritos a planes de pago / trial</p>
          </div>
        </div>

        <div className="bg-card-bg rounded-[2.5rem] p-8 shadow-card border border-slate-200/50 dark:border-white/5 flex flex-col justify-between group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Pagos Fallidos</h3>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-text-main tabular-nums">0</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Requieren atención inmediata</p>
          </div>
        </div>
      </div>

      {/* ── Catálogo de Planes SaaS ── */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 px-1 flex items-center gap-2">
          Arquitectura de Planes SaaS
        </h2>
        
        <PricingGrid />
      </div>

      {/* ── Estado de Suscripciones (Tabla) ── */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 px-1 flex items-center gap-2">
          Estado de Suscripciones (Tenants Reales)
        </h2>
        <div className="bg-card-bg rounded-[2.5rem] shadow-card border border-slate-200/50 dark:border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100/50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02]">
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Tenant</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Plan Actual</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Próximo Cobro</TableHead>
                  <TableHead className="py-4 px-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Panel Stripe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((t: any) => (
                  <TableRow key={t.id} className="border-slate-100/50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                    {/* Tenant Info */}
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-card-bg dark:bg-white/10 flex items-center justify-center text-emerald-500 font-black text-sm uppercase leading-none shadow-sm border border-slate-200/50 dark:border-white/5">
                          {t.name[0]}
                        </div>
                        <div>
                          <span className="block font-black text-text-main uppercase text-[13px] tracking-tight">{t.name}</span>
                          <span className="block font-medium text-slate-400 text-[11px] mt-0.5">/{t.slug}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Plan */}
                    <TableCell className="py-5 px-6">
                      <span className="inline-flex items-center text-[11px] font-black text-text-main uppercase tracking-widest">
                        {t.plan || 'Básico'}
                      </span>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[11px] font-black text-text-main uppercase tracking-widest">Activo</span>
                      </div>
                    </TableCell>

                    {/* Next Bill */}
                    <TableCell className="py-5 px-6 text-[12px] text-slate-500 font-medium">
                      {/* Generando una fecha ficticia en base a creacion o hardcode as requested since Stripe isn't live */}
                      {new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end">
                        <button title="Abrir Customer Portal (Stripe)" className="p-2 text-slate-300 hover:text-slate-600 transition-colors cursor-pointer outline-none">
                          <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.5} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {tenants.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={5} className="py-16 text-center text-slate-400 font-medium text-[13px]">
                       No hay tenants registrados.
                     </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

    </div>
  )
}
