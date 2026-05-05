'use client'

import { useState, useActionState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createClinicalRecord } from './actions'

export function NewRecordModal({ patientId }: { patientId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const initialState = { success: false, error: '' }
  const [state, formAction, isPending] = useActionState(createClinicalRecord, initialState)

  useEffect(() => {
    if (state?.success && !isPending) {
      setIsOpen(false)
    }
  }, [state?.success, isPending])

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all border-none"
      >
        + Registrar Nueva Consulta
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Nueva Consulta Médica">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="patientId" value={patientId} />
          
          {state?.error && (
            <div className="p-4 bg-red-500/10 text-red-500 text-[10px] rounded-2xl font-black uppercase tracking-widest border border-red-500/20 italic">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="motivo" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Motivo de Consulta</Label>
            <input 
              id="motivo" 
              name="motivo" 
              required 
              placeholder="Ej: Dolor abdominal persistente"
              className="w-full h-12 rounded-2xl border border-slate-200/50 dark:border-white/10 dark:bg-white/5 px-4 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sintomas" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Síntomas</Label>
            <textarea 
              id="sintomas" 
              name="sintomas" 
              rows={3}
              placeholder="Describa los síntomas reportados por el paciente..."
              className="w-full min-h-[5rem] rounded-2xl border border-slate-200/50 dark:border-white/10 dark:bg-white/5 px-4 py-3 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm"
            ></textarea>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnostico" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Diagnóstico</Label>
            <textarea 
              id="diagnostico" 
              name="diagnostico" 
              required
              rows={3}
              placeholder="Conclusión médica..."
              className="w-full min-h-[5rem] rounded-2xl border border-slate-200/50 dark:border-white/10 dark:bg-white/5 px-4 py-3 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm"
            ></textarea>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tratamiento" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tratamiento / Receta</Label>
            <textarea 
              id="tratamiento" 
              name="tratamiento" 
              rows={4}
              placeholder="Medicamentos, dosis y recomendaciones..."
              className="w-full min-h-[5rem] rounded-2xl border border-slate-200/50 dark:border-white/10 dark:bg-white/5 px-4 py-3 font-mono text-sm text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm font-bold"
            ></textarea>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Notas Internas (Privadas)</Label>
            <textarea 
              id="notas" 
              name="notas" 
              rows={2}
              className="w-full min-h-[5rem] rounded-2xl border border-slate-200/50 dark:border-white/10 dark:bg-white/5 px-4 py-3 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm italic"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100/50 dark:border-white/5">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-2xl border-slate-200/50 dark:border-white/10 font-black uppercase tracking-widest text-[10px] h-12 px-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Descartar</Button>
            <Button type="submit" disabled={isPending} className="bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all border-none">
              {isPending ? 'Guardando Consulta...' : 'Finalizar y Guardar'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
