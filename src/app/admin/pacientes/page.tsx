export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'

import { requireRole, getEffectiveRole } from '@/lib/auth-utils'
import { NewPatientModal } from './NewPatientModal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Search, AlertTriangle } from 'lucide-react'

export default async function PatientsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; view?: string }> 
}) {
  const { user } = await requireRole(['admin', 'receptionist', 'doctor', 'staff'])
  const supabase = await createClient()
  const params = await searchParams
  const q = params.q || ''
  const view = params.view || 'all'

  // Get doctors for modal dropdown
  const { data: doctors } = await supabase
    .from('staff_members')
    .select('id, full_name')
    .eq('specialty', 'doctor')
    .order('full_name')

  // Get all staff for name lookup (without FK hint)
  const { data: staffMap } = await supabase
    .from('staff_members')
    .select('id, full_name')

  // Build patient query - plain select, no FK join
  let query = supabase
    .from('patients')
    .select('*')

  if (q) {
    query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,dui.ilike.%${q}%,phone.ilike.%${q}%`)
  }

  if (view === 'mine') {
    const { data: myStaff } = await supabase
      .from('staff_members')
      .select('id')
      .eq('user_id', user!.id)
      .maybeSingle()

    if (myStaff) {
      query = query.eq('assigned_doctor_id', myStaff.id)
    }
  }

  const { data: rawPatients } = await query.order('last_name')

  // Manually enrich with doctor name
  const staffById = Object.fromEntries((staffMap || []).map(s => [s.id, s]))
  const patients = (rawPatients || []).map(p => ({
    ...p,
    assigned_doctor: p.assigned_doctor_id ? staffById[p.assigned_doctor_id] || null : null
  }))

  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-text-main tracking-tight uppercase leading-none mb-1">Directorio de Pacientes</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Listado maestro y expedientes clínicos</p>
        </div>
        <NewPatientModal doctors={doctors || []} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-50/50 dark:bg-white/5 p-1.5 rounded-[1.25rem] w-fit border border-slate-200/50 dark:border-white/5">
        <Link
          href={`/admin/pacientes?view=all${q ? `&q=${q}` : ''}`}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            view !== 'mine' 
              ? 'bg-white dark:bg-white/10 shadow-card text-emerald-500' 
              : 'text-slate-400 hover:text-emerald-500'
          }`}
        >
          Todos los Pacientes
        </Link>
        <Link
          href={`/admin/pacientes?view=mine${q ? `&q=${q}` : ''}`}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            view === 'mine' 
              ? 'bg-white dark:bg-white/10 shadow-card text-emerald-500' 
              : 'text-slate-400 hover:text-emerald-500'
          }`}
        >
          Mis Pacientes
        </Link>
      </div>

      {/* Search */}
      <form className="bg-card-bg p-4 rounded-[1.5rem] border border-slate-200/50 dark:border-white/5 shadow-card flex items-center gap-4 transition-all focus-within:border-emerald-500/50">
        <Search className="text-emerald-500 h-5 w-5 shrink-0" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre, DUI o teléfono..."
          className="w-full bg-transparent border-none focus:ring-0 text-[11px] font-black uppercase tracking-widest text-text-main outline-none placeholder:text-slate-500"
        />
        {params.view && <input type="hidden" name="view" value={params.view} />}
      </form>

      {/* Table */}
      <div className="bg-card-bg rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 overflow-hidden shadow-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/30 dark:bg-white/[0.02] border-b border-slate-100/50 dark:border-white/5">
              <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</TableHead>
              <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">DUI</TableHead>
              <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacto</TableHead>
              <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doctor Asignado</TableHead>
              <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alergias</TableHead>
              <TableHead className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!patients || patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-24 text-slate-400 italic font-black uppercase tracking-[0.2em] text-[10px]">
                  No se encontraron pacientes registrados.
                </TableCell>
              </TableRow>
            ) : (
              patients.map((p: any) => (
                <TableRow key={p.id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors group border-b border-slate-100/50 dark:border-white/5">
                  <TableCell className="px-8 py-5">
                    <div className="font-black text-text-main uppercase tracking-tight">{p.first_name} {p.last_name}</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{p.fecha_nacimiento || '—'}</div>
                  </TableCell>
                  <TableCell className="px-8 py-5 text-slate-400 font-mono text-xs font-black">{p.dui}</TableCell>
                  <TableCell className="px-8 py-5">
                    <div className="text-[11px] font-black text-text-main uppercase tracking-tight">{p.phone || '—'}</div>
                    <div className="text-[10px] text-emerald-500 font-black lowercase tracking-tight">{p.email || ''}</div>
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    {p.assigned_doctor
                      ? <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest"> {p.assigned_doctor.full_name}</span>
                      : <span className="text-[9px] text-slate-500 font-black italic uppercase tracking-widest opacity-50">Sin asignar</span>
                    }
                  </TableCell>
                  <TableCell className="px-8 py-5">
                    {p.alergias && p.alergias.toLowerCase() !== 'ninguna' ? (
                      <span className="flex items-center gap-2 text-[10px] font-black text-red-500 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20 uppercase tracking-widest shadow-sm backdrop-blur-sm transition-all hover:bg-red-500/20">
                        <AlertTriangle className="h-3 w-3 shrink-0" /> 
                        <span className="truncate max-w-[120px]">{p.alergias}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-[9px] font-black text-slate-400 bg-slate-50/50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-white/5 uppercase tracking-widest opacity-60">
                        Ninguna
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-8 py-5 text-right">
                    <Link href={`/admin/pacientes/${p.id}`}>
                      <Button variant="outline" size="sm" className="rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-[9px] h-8 px-4 hover:bg-emerald-500 hover:text-white dark:hover:text-black transition-all">
                        Ver Expediente
                      </Button>
                    </Link>
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
