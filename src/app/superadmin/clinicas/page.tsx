export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { NewTenantModal } from '../NewTenantModal'
import { DeleteTenantButton } from '../DeleteTenantButton'
import Link from 'next/link'
import { Building2, Globe, Pencil, ShieldCheck, Users, Calendar, Settings2, Trash2 } from 'lucide-react'

export default async function SuperadminClinicasPage() {
  const supabase = await createClient()

  const { data: authData } = await supabase.auth.getUser()
  if (!authData.user) return <div>No autorizado</div>

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch tenants with all relevant related data counts
  const { data: tenants, error } = await supabaseAdmin
    .from('tenants')
    .select('id, name, slug, created_at, plan, clinics(id, name)')
    .order('created_at', { ascending: false })

  // Fetch counts per tenant for patients, staff, appointments
  const tenantIds = tenants?.map(t => t.id) ?? []

  const [
    { data: patientCounts },
    { data: staffCounts },
    { data: appointmentCounts },
    { data: userCounts },
  ] = await Promise.all([
    supabaseAdmin.from('patients').select('tenant_id').in('tenant_id', tenantIds),
    supabaseAdmin.from('staff_members').select('tenant_id').in('tenant_id', tenantIds),
    supabaseAdmin.from('appointments').select('tenant_id').in('tenant_id', tenantIds),
    supabaseAdmin.from('profiles').select('tenant_id').in('tenant_id', tenantIds),
  ])

  // Build lookup maps
  const countBy = (rows: any[] | null, key: string) => {
    const map: Record<string, number> = {}
    ;(rows ?? []).forEach(r => { map[r[key]] = (map[r[key]] || 0) + 1 })
    return map
  }
  const pMap  = countBy(patientCounts,     'tenant_id')
  const sMap  = countBy(staffCounts,       'tenant_id')
  const aMap  = countBy(appointmentCounts, 'tenant_id')
  const uMap  = countBy(userCounts,        'tenant_id')

  return (
    <div className="space-y-6 md:space-y-12 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-text-main tracking-tight uppercase leading-none">Clínicas</h1>
          <p className="text-slate-400 text-[10px] md:text-sm font-medium mt-1.5 md:mt-2">
            Gestión de clientes SaaS
          </p>
        </div>
        <div className="flex gap-2">
          <NewTenantModal />
        </div>
      </div>

      {/* ── Métricas de Resumen ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <SummaryCard label="Total" value={tenants?.length ?? 0} />
        <SummaryCard label="Premium" value={tenants?.filter(t => t.plan !== 'basic').length ?? 0} />
        <SummaryCard label="Básico" value={tenants?.filter(t => t.plan === 'basic').length ?? 0} />
        <SummaryCard label="Nuevas" value={tenants?.filter(t => {
          const createdAt = new Date(t.created_at)
          const now = new Date()
          const diffTime = Math.abs(now.getTime() - createdAt.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          return diffDays <= 30
        }).length ?? 0} />
      </div>

      {/* ── Lista de Clientes (Tabla) ── */}
      <div className="bg-card-bg rounded-2xl md:rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 shadow-card overflow-x-auto custom-scrollbar">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100/50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02]">
              <TableHead className="py-4 md:py-5 px-4 md:px-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Tenant</TableHead>
              <TableHead className="py-4 md:py-5 px-4 md:px-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Clínicas</TableHead>
              <TableHead className="py-4 md:py-5 px-4 md:px-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Usuarios</TableHead>
              <TableHead className="py-4 md:py-5 px-4 md:px-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Plan</TableHead>
              <TableHead className="py-4 md:py-5 px-4 md:px-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Estado</TableHead>
              <TableHead className="py-4 md:py-5 px-4 md:px-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Registro</TableHead>
              <TableHead className="py-4 md:py-5 px-4 md:px-6 text-right text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error || !tenants || tenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <Building2 className="h-10 w-10 text-slate-400" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">No se encontraron tenants</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tenants.map((tenant: any) => (
                <TableRow key={tenant.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors border-slate-100/50 dark:border-white/5">
                  {/* Tenant Name */}
                  <TableCell className="py-4 md:py-5 px-4 md:px-6">
                    <div className="flex items-center gap-3 min-w-[180px] md:min-w-[200px]">
                      <div className="h-9 w-9 md:h-10 md:w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-black text-sm md:text-base uppercase leading-none group-hover:bg-emerald-500 group-hover:text-white transition-colors shrink-0">
                        {tenant.name[0]}
                      </div>
                      <div>
                        <p className="font-black text-text-main uppercase tracking-tight text-xs md:text-sm leading-none">{tenant.name}</p>
                        <code className="text-[9px] md:text-[10px] text-slate-400 font-mono mt-1 block">/{tenant.slug}</code>
                      </div>
                    </div>
                  </TableCell>

                  {/* Clinics */}
                  <TableCell className="py-4 md:py-5 px-4 md:px-6 text-center tabular-nums">
                    <span className="text-xs md:text-sm font-black text-text-main">{tenant.clinics?.length ?? 0}</span>
                  </TableCell>

                  {/* Users */}
                  <TableCell className="py-4 md:py-5 px-4 md:px-6 text-center tabular-nums">
                    <span className="text-xs md:text-sm font-black text-text-main">{uMap[tenant.id] ?? 0}</span>
                  </TableCell>

                  {/* Plan */}
                  <TableCell className="py-4 md:py-5 px-4 md:px-6">
                    <span className="inline-flex items-center px-2 py-0.5 md:py-1 rounded-lg bg-emerald-500/5 text-[9px] md:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 uppercase tracking-wide whitespace-nowrap">
                      {tenant.plan || 'Profesional'}
                    </span>
                  </TableCell>

                  {/* Estado */}
                  <TableCell className="py-4 md:py-5 px-4 md:px-6 text-center">
                    <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-wide text-emerald-600">Activo</span>
                    </div>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="py-4 md:py-5 px-4 md:px-6 text-[10px] md:text-[11px] text-slate-500 font-medium whitespace-nowrap">
                    {new Date(tenant.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-4 md:py-5 px-4 md:px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {tenant.clinics?.[0] && (
                        <>
                          <Link href={`/${tenant.slug}`} target="_blank" rel="noopener noreferrer" title="Ver Sitio Público" className="p-2 md:p-3 text-slate-400 hover:text-slate-700 hover:opacity-80 transition-all cursor-pointer active:scale-90">
                            <Globe className="h-4 w-4 md:h-5 md:w-5" />
                          </Link>
                          <Link href={`/superadmin/sitios/${tenant.clinics[0].id}`} title="Editor Web" className="p-2 md:p-3 text-slate-400 hover:text-emerald-500 transition-all cursor-pointer hover:opacity-80 active:scale-90">
                            <Pencil className="h-4 w-4 md:h-5 md:w-5" />
                          </Link>
                          <Link href={`/admin?clinicId=${tenant.clinics[0].id}`} title="Panel Admin" className="p-2 md:p-3 text-slate-400 hover:text-emerald-500 transition-all cursor-pointer hover:opacity-80 active:scale-90">
                            <ShieldCheck className="h-4 w-4 md:h-5 md:w-5" />
                          </Link>
                        </>
                      )}
                      <div className="h-4 w-px bg-slate-100 dark:bg-white/5 mx-2 hidden md:block" />
                      <DeleteTenantButton tenantId={tenant.id} tenantName={tenant.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card-bg p-3 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-card group hover:-translate-y-1 transition-all">
      <p className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none mb-1.5 md:mb-3">{label}</p>
      <p className="text-xl md:text-4xl font-black text-text-main tabular-nums tracking-tighter leading-none">{value.toLocaleString()}</p>
    </div>
  )
}
