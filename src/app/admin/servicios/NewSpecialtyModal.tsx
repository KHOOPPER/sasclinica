'use client'

import { useState, useActionState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Stethoscope, Image as ImageIcon } from 'lucide-react'
import { createSpecialty } from './actions'

export function NewSpecialtyModal() {
  const [isOpen, setIsOpen] = useState(false)
  const initialState = { success: false, error: '' }
  const [state, formAction, isPending] = useActionState(createSpecialty, initialState)

  useEffect(() => {
    if (state?.success && !isPending) {
      setIsOpen(false)
    }
  }, [state?.success, isPending])

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl transition-all flex items-center gap-2"
      >
        <Stethoscope className="h-4 w-4" /> Especialidad
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Nueva Especialidad">
        <form action={formAction} className="space-y-6 py-2">
          {state?.error && (
            <div className="p-4 bg-red-50 text-red-600 text-[11px] font-black uppercase tracking-widest rounded-2xl border border-red-100">
              {state.error}
            </div>
          )}

          <div className="space-y-4 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de la Especialidad</Label>
              <Input 
                id="name" 
                name="name" 
                required 
                placeholder="Ej. Dermatología, Cardiología..." 
                className="h-14 rounded-2xl border-transparent bg-white shadow-sm focus:ring-2 focus:ring-slate-900/5 transition-all text-sm font-bold px-6" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción corta</Label>
              <Input 
                id="description" 
                name="description" 
                placeholder="Breve descripción para la página..." 
                className="h-14 rounded-2xl border-transparent bg-white shadow-sm focus:ring-2 focus:ring-slate-900/5 transition-all text-sm font-bold px-6" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon_url" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <ImageIcon className="h-3 w-3" /> URL del Icono/Imagen
              </Label>
              <Input 
                id="icon_url" 
                name="icon_url" 
                placeholder="https://images.unsplash.com/..." 
                className="h-14 rounded-2xl border-transparent bg-white shadow-sm focus:ring-2 focus:ring-slate-900/5 transition-all text-sm font-bold px-6" 
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsOpen(false)} 
              className="h-14 px-8 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isPending} 
              className="h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-slate-900/10 transition-all"
            >
              {isPending ? 'Guardando...' : 'Crear Especialidad'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
