export const dynamic = 'force-dynamic'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Globe, ShieldCheck, ExternalLink, RefreshCw, AlertTriangle, CheckCircle, Server } from 'lucide-react'
import Link from 'next/link'

export default async function SuperadminDomainsPage() {
  // ── Auth ──────────────────────────────────────────────────────────────────
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
  let sites: any[] = []
  let fetchError = false

  try {
    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabaseAdmin
      .from('public_clinic_settings')
      .select(`
        id, slug, clinic_name, primary_color,
        created_at, updated_at,
        tenant_id,
        clinic_id,
        clinics(id, name, tenant_id,
          tenants(id, name, slug)
        )
      `)
      .order('updated_at', { ascending: false })

    if (error) throw error
    sites = data ?? []
  } catch (err) {
    console.error('[Dominios] fetch error:', err)
    fetchError = true
  }

  const subdominiosActivos = sites.filter(s => s.slug && s.slug.length > 0).length

  return (
    <div className="space-y-12 pb-16">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-main tracking-tight uppercase leading-none">Dominios SSL</h1>
          <p className="text-slate-400 text-sm font-medium mt-2">
            Gestión técnica y enrutamiento web
          </p>
        </div>
      </div>

      {/* Fetch error banner */}
      {fetchError && (
        <div className="bg-rose-50 border-none rounded-2xl p-4 flex items-center gap-3 text-rose-600 shadow-sm">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <p className="text-[13px] font-bold uppercase tracking-wide">Error al cargar datos. Intenta recargar la página.</p>
        </div>
      )}

      {/* ── KPIs Dominios ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card-bg rounded-[2.5rem] p-8 shadow-card border border-slate-200/50 dark:border-white/5 flex flex-col justify-between group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Dominios Personalizados</h3>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Globe className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-text-main tabular-nums">0</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Requieren configuración .com</p>
          </div>
        </div>

        <div className="bg-card-bg rounded-[2.5rem] p-8 shadow-card border border-slate-200/50 dark:border-white/5 flex flex-col justify-between group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Subdominios Activos</h3>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <Server className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-text-main tabular-nums">{subdominiosActivos}</p>
            <p className="text-xs font-medium text-emerald-500 mt-1">Enrutamiento operativo</p>
          </div>
        </div>

        <div className="bg-card-bg rounded-[2.5rem] p-8 shadow-card border border-slate-200/50 dark:border-white/5 flex flex-col justify-between group hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Alertas SSL / DNS</h3>
            <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-4xl font-black text-text-main tabular-nums">0</p>
            <p className="text-xs font-medium text-slate-400 mt-1">Certificados o registros pendientes</p>
          </div>
        </div>
      </div>

      {/* ── Estado de Dominios y Enrutamiento (Tabla) ── */}
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 px-1 flex items-center gap-2">
          Estado de Dominios y Enrutamiento
        </h2>
        <div className="bg-card-bg rounded-[2.5rem] shadow-card border border-slate-200/50 dark:border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100/50 dark:border-white/5 bg-slate-50/30 dark:bg-white/[0.02]">
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Tenant</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo de Conexión</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">URL Pública</TableHead>
                  <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado SSL</TableHead>
                  <TableHead className="py-4 px-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site: any) => {
                  const tenant = site.clinics?.tenants
                  const displayTenantName = tenant?.name || site.clinic_name || 'Desconocido'
                  const urlDomain = site.slug ? `${site.slug}.tudominio.com` : 'No configurado'

                  return (
                    <TableRow key={site.id} className="border-slate-100/50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-colors">
                      {/* Tenant Info */}
                      <TableCell className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-2xl bg-card-bg dark:bg-white/10 flex items-center justify-center text-emerald-500 font-black text-sm uppercase leading-none shadow-sm border border-slate-200/50 dark:border-white/5">
                            {displayTenantName[0]}
                          </div>
                          <div>
                            <span className="block font-black text-text-main uppercase text-[13px] tracking-tight">{displayTenantName}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Tipo de Conexión */}
                      <TableCell className="py-5 px-6">
                        <span className="inline-flex items-center text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">
                          Subdominio
                        </span>
                      </TableCell>

                      {/* URL Pública */}
                      <TableCell className="py-5 px-6">
                        <code className="text-[12px] font-black text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border border-slate-200/50 dark:border-white/5">
                          {urlDomain}
                        </code>
                      </TableCell>

                      {/* Estado SSL */}
                      <TableCell className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">Activo</span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button title="Verificar DNS" className="p-2 text-slate-300 hover:text-emerald-500 hover:opacity-80 transition-all cursor-pointer outline-none">
                            <RefreshCw className="h-[18px] w-[18px]" strokeWidth={1.5} />
                          </button>
                          {site.slug && (
                            <Link href={`/${site.slug}`} target="_blank" rel="noopener noreferrer" title="Visitar URL Pública" className="p-2 text-slate-300 hover:text-slate-600 hover:opacity-80 transition-all cursor-pointer">
                              <ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.5} />
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                
                {sites.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={5} className="py-16 text-center text-slate-400 font-medium text-[13px]">
                       No hay dominios registrados en la red.
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
