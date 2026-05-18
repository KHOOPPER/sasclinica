'use client'

import { useState, useActionState, useEffect } from 'react'
import { Modal } from '../../../components/ui/modal'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Edit, Eye, EyeOff } from 'lucide-react'
import { updateStaffMember } from './actions'

export interface EditStaffModalProps {
  member: {
    id: string
    user_id?: string
    full_name: string
    email: string
    specialty: string
    image_url?: string
  }
}

export default function EditStaffModal({ member }: EditStaffModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const initialState = { error: '', success: false }
  const [state, formAction, isPending] = useActionState(updateStaffMember, initialState)

  useEffect(() => {
    if (state?.success && !isPending) {
      setIsOpen(false)
    }
  }, [state?.success, isPending])

  const nameParts = (member.full_name || '').split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
        <Edit className="h-4 w-4" />
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Editar Trabajador">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={member.id} />
          <input type="hidden" name="userId" value={member.user_id} />

          {state?.error && (
            <div className="p-4 bg-red-500/10 text-red-500 text-[10px] rounded-2xl font-black uppercase tracking-widest border border-red-500/20 italic">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-firstName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre</Label>
              <Input id="edit-firstName" name="firstName" defaultValue={firstName} required className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lastName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Apellidos</Label>
              <Input id="edit-lastName" name="lastName" defaultValue={lastName} required className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Correo (No editable)</Label>
            <Input value={member.email || ''} disabled className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] text-slate-400 font-black cursor-not-allowed opacity-60" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Rol en la Clínica</Label>
            <select
              id="edit-role"
              name="role"
              required
              defaultValue={member.specialty || ''}
              className="w-full flex h-12 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-transparent dark:bg-black/20 px-4 py-2 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm"
            >
              <option value="" className="text-slate-900">Selecciona un rol...</option>
              <option value="doctor" className="text-slate-900">Doctor / Especialista</option>
              <option value="receptionist" className="text-slate-900">Recepcionista</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-imageUrl" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Imagen de perfil (URL)</Label>
            <Input 
              id="edit-imageUrl" 
              name="imageUrl" 
              defaultValue={member.image_url || ''} 
              type="url" 
              placeholder="https://ejemplo.com/foto.jpg" 
              className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" 
            />
          </div>

          {/* Password change section */}
          <div className="pt-4 mt-2 border-t border-slate-100/50 dark:border-white/5">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-3 px-1 italic">Dejar en blanco para no cambiar la contraseña.</p>
            <div className="space-y-2">
              <Label htmlFor="edit-password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nueva Contraseña (opcional)</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100/50 dark:border-white/5">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-2xl border-slate-200/50 dark:border-white/10 font-black uppercase tracking-widest text-[10px] h-12 px-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} className="bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all border-none">
              {isPending ? 'Guardando...' : 'Actualizar Datos'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
