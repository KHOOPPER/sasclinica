'use client'

import { useState, useActionState, useEffect } from 'react'
import { Modal } from '../../../components/ui/modal'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { createStaffMember } from './actions'

export function NewStaffModal() {
  const [isOpen, setIsOpen] = useState(false)
  const initialState = { success: false, error: '' }
  const [state, formAction, isPending] = useActionState(createStaffMember, initialState)

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
        Agregar Trabajador
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Agregar nuevo trabajador">
        <form action={formAction} className="space-y-4">
          
          {state?.error && (
            <div className="p-4 mb-4 bg-red-500/10 text-red-500 text-[10px] rounded-2xl font-black uppercase tracking-widest border border-red-500/20 italic">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre</Label>
              <Input id="firstName" name="firstName" required placeholder="Ej. Juan" className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Apellidos</Label>
              <Input id="lastName" name="lastName" required placeholder="Ej. Pérez" className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Correo electrónico</Label>
            <Input id="email" name="email" type="email" required placeholder="juan.perez@clinica.com" className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Contraseña Temporal</Label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Rol en la Clínica</Label>
            <select 
              id="role" 
              name="role" 
              required 
              className="w-full flex h-12 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-transparent dark:bg-black/20 px-4 py-2 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm"
            >
              <option value="" className="text-slate-900">Selecciona un rol...</option>
              <option value="doctor" className="text-slate-900">Doctor / Especialista</option>
              <option value="receptionist" className="text-slate-900">Recepcionista</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Imagen de perfil (URL)</Label>
            <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://ejemplo.com/foto.jpg" className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-6 border-slate-100/50 dark:border-white/5">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-2xl border-slate-200/50 dark:border-white/10 font-black uppercase tracking-widest text-[10px] h-12 px-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Cancelar</Button>
            <Button type="submit" disabled={isPending} className="bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all border-none">
              {isPending ? 'Guardando...' : 'Guardar Trabajador'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
