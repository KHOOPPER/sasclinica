export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'

import { requireRole } from '@/lib/auth-utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { User } from 'lucide-react'
import { NewStaffModal } from './NewStaffModal'
import { StaffActions } from './StaffActions'

export default async function StaffPage() {
  await requireRole(['admin'])
  const supabase = await createClient()

  const { data: staff, error } = await supabase
    .from('staff_members')
    .select(`
      id, 
      user_id, 
      full_name, 
      email, 
      specialty, 
      created_at,
      profiles:user_id (
        image_url
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-text-main tracking-tight uppercase leading-none mb-1">Equipo de Trabajo</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gestión del personal y roles de clínica</p>
        </div>
        <NewStaffModal />
      </div>

      <div className="bg-card-bg rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/30 dark:bg-white/[0.02] border-b border-slate-100/50 dark:border-white/5">
              <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Completo</TableHead>
              <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Correo</TableHead>
              <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol / Cargo</TableHead>
              <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha Ingreso</TableHead>
              <TableHead className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error || !staff || staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-slate-400 italic font-black uppercase tracking-widest text-[10px]">
                  No hay trabajadores registrados en tu clínica.
                </TableCell>
              </TableRow>
            ) : (
              staff.map((member: any) => {
                const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles
                const imageUrl = profile?.image_url || member.image_url

                return (
                  <TableRow key={member.id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors border-b border-slate-100/50 dark:border-white/5">
                    <TableCell className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-slate-100/50 dark:bg-white/5 flex items-center justify-center text-slate-400 overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-sm">
                          {imageUrl ? (
                            <img src={imageUrl} alt={member.full_name} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <span className="font-black text-text-main uppercase tracking-tight">{member.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-4 text-slate-400 text-xs font-black uppercase tracking-tighter">{member.email}</TableCell>
                    <TableCell className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-[0.1em] transition-all ${
                        member.specialty === 'doctor'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : (member.specialty === 'receptionist'
                             ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                             : 'bg-slate-50/50 dark:bg-white/5 text-slate-400 border-slate-200/50 dark:border-white/10')
                      }`}>
                        {member.specialty === 'doctor' ? 'Doctor' : (member.specialty === 'receptionist' ? 'Recepcionista' : (member.specialty || 'Personal'))}
                      </span>
                    </TableCell>
                    <TableCell className="px-8 py-4 text-slate-400 text-xs font-black">
                      {new Date(member.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-8 py-4 text-right">
                      <StaffActions member={member} />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
