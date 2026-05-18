'use client'

import { useState, useActionState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAppointment } from './actions'

export function NewAppointmentModal({ 
  patients, 
  doctors, 
  services 
}: { 
  patients: any[], 
  doctors: any[], 
  services: any[] 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<string>('')
  const [duration, setDuration] = useState<number>(0)
  
  const initialState = { success: false, error: '' }
  const [state, formAction, isPending] = useActionState(createAppointment, initialState)

  useEffect(() => {
    if (state?.success && !isPending) {
      setIsOpen(false)
    }
  }, [state?.success, isPending])

  useEffect(() => {
    const service = services.find(s => s.id === selectedService)
    if (service) setDuration(service.duration_minutes)
  }, [selectedService, services])

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all border-none"
      >
        + Nueva Cita
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Programar Nueva Cita">
        <form action={formAction} className="space-y-4">
          
          {state?.error && (
            <div className="p-4 bg-red-500/10 text-red-500 text-[10px] rounded-2xl font-black uppercase tracking-widest border border-red-500/20 italic">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="patientId" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Paciente</Label>
            <select name="patientId" required className="w-full flex h-12 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-transparent dark:bg-black/20 px-4 py-2 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm">
              <option value="" className="text-slate-900">Seleccione un paciente...</option>
              {patients.map(p => (
                <option key={p.id} value={p.id} className="text-slate-900">{p.first_name} {p.last_name} ({p.dui})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staffId" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Médico / Especialista</Label>
            <select name="staffId" required className="w-full flex h-12 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-transparent dark:bg-black/20 px-4 py-2 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm">
              <option value="" className="text-slate-900">Seleccione un médico...</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id} className="text-slate-900">Dr. {d.full_name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceId" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Servicio</Label>
            <select 
              name="serviceId" 
              required 
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full flex h-12 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-transparent dark:bg-black/20 px-4 py-2 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm"
            >
              <option value="" className="text-slate-900">Seleccione un servicio...</option>
              {services.map(s => (
                <option key={s.id} value={s.id} className="text-slate-900">{s.name} (${s.price})</option>
              ))}
            </select>
            {duration > 0 && (
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-2 px-1">Duración estimada: {duration} minutos</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fecha y Hora de Inicio</Label>
            <Input id="startTime" name="startTime" type="datetime-local" required className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Notas / Observaciones</Label>
            <textarea 
              id="notes" 
              name="notes" 
              placeholder="Ej: El paciente vendrá acompañado..."
              className="w-full min-h-[5rem] rounded-2xl border border-slate-200/50 dark:border-white/10 dark:bg-white/5 px-4 py-3 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100/50 dark:border-white/5">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-2xl border-slate-200/50 dark:border-white/10 font-black uppercase tracking-widest text-[10px] h-12 px-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Cancelar</Button>
            <Button type="submit" disabled={isPending} className="bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all border-none">
              {isPending ? 'Confirmando...' : 'Programar Cita'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
