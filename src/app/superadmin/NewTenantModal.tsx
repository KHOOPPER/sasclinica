'use client'

import { useState, useActionState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createTenant } from './actions'
import { UserCheck, Building, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

export function NewTenantModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [state, action, isPending] = useActionState(createTenant, undefined)

  // Feedback notifications
  useEffect(() => {
    if (isPending) {
      toast.loading('Creando clínica y configurando administrador...', { id: 'create-tenant' })
    }
  }, [isPending])

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error, { id: 'create-tenant' })
    }
    if (state?.success) {
      toast.success('Clínica creada exitosamente', { id: 'create-tenant' })
      setIsOpen(false)
    }
  }, [state])

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Nueva Clínica</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Crear nueva clínica">
        <form action={action} className="space-y-4">

          {/* Sección 1: Datos de la Clínica */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 pb-1 border-b border-slate-100/50 dark:border-white/5">
              <Building className="h-3 w-3 text-emerald-500" /> Datos de la Clínica
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold text-slate-600">Nombre de la Clínica</Label>
              <Input id="name" name="name" required placeholder="Ej. Clínica Dental Sonrisas" className="h-10 rounded-xl bg-slate-100/50 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/10 transition-all font-medium" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-xs font-bold text-slate-600">Slug (URL)</Label>
                <Input id="slug" name="slug" required placeholder="ej-clinica-sonrisas" className="font-mono text-[13px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan" className="text-xs font-bold text-slate-600">Plan de Suscripción</Label>
                <select id="plan" name="plan" className="flex h-12 w-full rounded-2xl border border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 px-4 py-2 text-sm focus:border-emerald-500/30 dark:focus:bg-slate-900 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-medium text-text-main">
                  <option value="trial" className="bg-white dark:bg-slate-900">Trial (14 días)</option>
                  <option value="profesional" selected className="bg-white dark:bg-slate-900">Profesional</option>
                  <option value="elite" className="bg-white dark:bg-slate-900">Elite</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección 2: Administrador */}
          <div className="space-y-4 pt-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 pb-1 border-b border-slate-100/50 dark:border-white/5">
              <UserCheck className="h-3 w-3 text-emerald-500" /> Administrador Principal
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adminName" className="text-xs font-bold text-slate-600">Nombre</Label>
                <Input id="adminName" name="adminName" required placeholder="Ej: Juan" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminLastName" className="text-xs font-bold text-slate-600">Apellidos</Label>
                <Input id="adminLastName" name="adminLastName" required placeholder="Ej: Pérez" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="text-xs font-bold text-slate-600">Correo Electrónico</Label>
                <Input id="adminEmail" name="adminEmail" type="email" required placeholder="admin@clinica.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword" className="text-xs font-bold text-slate-600">Contraseña Temp.</Label>
                <div className="relative group/pass">
                  <Input 
                    id="adminPassword" 
                    name="adminPassword" 
                    type={showPassword ? 'text' : 'password'} 
                    required 
                    className="font-mono pr-10" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t mt-6 border-slate-100/50 dark:border-white/5">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 px-5">Cancelar</Button>
            <Button type="submit" disabled={isPending} className="rounded-xl bg-emerald-500 text-white dark:text-black text-[11px] font-black uppercase tracking-widest px-6 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all transition-transform active:scale-95">
              {isPending ? 'Creando...' : 'Crear Tenant y Admin'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
