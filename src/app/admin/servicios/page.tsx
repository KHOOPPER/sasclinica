export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { requireRole, getEffectiveRole } from '@/lib/auth-utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { NewServiceModal } from './NewServiceModal'
import { NewSpecialtyModal } from './NewSpecialtyModal'
import { ServiceActions } from './ServiceActions'
import { Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function ServicesPage() {
  const { role } = await requireRole(['admin', 'receptionist'])
  const isAdmin = role === 'admin' || role === 'superadmin'
  const supabase = await createClient()

  const { data: services, error } = await supabase
    .from('services')
    .select('id, name, description, price, duration_minutes, is_active, image_url, created_at, is_offer, offer_price, specialty_id')
    .order('name', { ascending: true })

  const { data: specialties } = await supabase
    .from('specialties')
    .select('*')
    .order('name')

  return (
    <div className="space-y-6 p-1 md:p-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-text-main tracking-tight uppercase leading-none mb-1">Servicios de la Clínica</h2>
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gestión institucional de servicios médicos</p>
        </div>
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <NewSpecialtyModal />
            <NewServiceModal specialties={specialties || []} initialIsOffer={true} />
            <NewServiceModal specialties={specialties || []} />
          </div>
        )}
      </div>

      {/* Vista de Escritorio (Tabla) */}
      <div className="hidden md:block bg-card-bg rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 shadow-card overflow-hidden transition-all">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/30 dark:bg-white/[0.02] hover:bg-slate-50/30 dark:hover:bg-white/[0.02] border-b border-slate-100/50 dark:border-white/5">
               <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-8 py-5">Nombre</TableHead>
              <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-8 py-5">Descripción</TableHead>
              <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-8 py-5">Precio</TableHead>
              <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-8 py-5">Duración</TableHead>
              <TableHead className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-8 py-5">Estado</TableHead>
              <TableHead className="text-right text-[10px] font-black text-slate-400 uppercase tracking-widest px-8 py-5">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {error || !services || services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-slate-400 italic font-medium">
                  <div className="flex flex-col items-center gap-2">
                    <p>No hay servicios registrados en el sistema.</p>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Base de Datos Vacía</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id} className="hover:bg-slate-50/30 dark:hover:bg-white/[0.02] transition-colors group border-b border-slate-100/50 dark:border-white/5">
                  <TableCell className="px-8">
                    <div className="flex flex-col">
                      <span className="font-black text-text-main uppercase tracking-tight">{service.name}</span>
                      {service.is_offer && (
                        <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                          <Tag className="h-2 w-2" /> Oferta Especial
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-400 text-[11px] px-8 max-w-xs truncate font-black uppercase tracking-widest">{service.description || '—'}</TableCell>
                  <TableCell className="px-8">
                    <div className="flex flex-col">
                      {service.is_offer && service.offer_price ? (
                        <>
                          <span className="text-emerald-500 font-black tabular-nums tracking-tighter text-base">${Number(service.offer_price).toFixed(2)}</span>
                          <span className="text-[10px] text-slate-300 line-through tabular-nums">${Number(service.price).toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-text-main font-black tabular-nums tracking-tighter">${Number(service.price).toFixed(2)}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-400 font-black px-8 text-xs">{service.duration_minutes} min</TableCell>
                  <TableCell className="px-8">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black border uppercase tracking-[0.1em] transition-all",
                      service.is_active
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm shadow-emerald-500/5'
                        : 'bg-slate-50/50 dark:bg-white/5 text-slate-400 border-slate-200/50 dark:border-white/10'
                    )}>
                      {service.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <ServiceActions service={service} specialties={specialties || []} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Vista de Móvil (Tarjetas) */}
      <div className="md:hidden space-y-4">
        {error || !services || services.length === 0 ? (
          <div className="bg-card-bg rounded-3xl p-12 text-center border border-slate-100 dark:border-white/5">
             <p className="text-sm font-bold text-slate-400 italic">No hay servicios registrados.</p>
          </div>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-card-bg rounded-3xl p-5 border border-slate-200/50 dark:border-white/5 shadow-sm space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-black text-text-main uppercase tracking-tight leading-tight">{service.name}</span>
                  {service.is_offer && (
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                      <Tag className="h-2 w-2" /> Oferta Especial
                    </span>
                  )}
                  <span className={cn(
                    "w-fit px-2 py-0.5 rounded-full text-[7px] font-black border uppercase tracking-widest mt-1",
                    service.is_active
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-200/50'
                  )}>
                    {service.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <ServiceActions service={service} specialties={specialties || []} />
              </div>

              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed line-clamp-2">
                {service.description || 'Sin descripción disponible.'}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Precio</span>
                  {service.is_offer && service.offer_price ? (
                    <div className="flex items-baseline gap-2">
                      <span className="text-emerald-500 font-black tracking-tighter text-lg">${Number(service.offer_price).toFixed(2)}</span>
                      <span className="text-[9px] text-slate-300 line-through">${Number(service.price).toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-text-main font-black tracking-tighter text-lg">${Number(service.price).toFixed(2)}</span>
                  )}
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Duración</span>
                  <span className="text-text-main font-black tracking-tighter text-sm uppercase">{service.duration_minutes} min</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
