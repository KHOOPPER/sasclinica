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
            <div className={`relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${
              (state as any)?.isLimitError 
                ? 'bg-gradient-to-br from-amber-50 to-white dark:from-amber-500/10 dark:to-transparent border-amber-200 dark:border-amber-500/30 shadow-2xl shadow-amber-500/10' 
                : 'bg-red-50/50 dark:bg-red-500/5 border-red-100 dark:border-red-500/20 text-red-500'
            }`}>
              {(state as any)?.isLimitError ? (
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/40 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                    </div>
                    <div>
                      <h4 className="text-amber-600 font-black uppercase tracking-tighter text-lg leading-none">Oportunidad de Crecimiento</h4>
                      <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest mt-1">Upgrade de Arquitectura Requerido</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-slate-600 dark:text-slate-400 text-xs font-medium leading-relaxed">
                      Tu clínica ha superado los límites del plan actual. Para integrar a <span className="font-black text-amber-600">más especialistas</span> y escalar tu operación, necesitas saltar al siguiente nivel.
                    </p>
                    <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                      <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide italic">
                        {state.error}
                      </p>
                    </div>
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -bottom-6 -right-6 opacity-5 dark:opacity-10 rotate-12">
                     <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-[10px] font-black uppercase tracking-widest italic">
                  {state.error}
                </div>
              )}
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
            <div className="relative group">
              <select 
                id="role" 
                name="role" 
                required 
                className="w-full h-12 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 font-black text-text-main appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm cursor-pointer"
              >
                <option value="" className="text-slate-900 bg-white">Selecciona un rol...</option>
                <option value="doctor" className="text-slate-900 bg-white">Doctor / Especialista</option>
                <option value="receptionist" className="text-slate-900 bg-white">Recepcionista</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-emerald-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
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
