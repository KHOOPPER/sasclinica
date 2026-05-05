'use client'

import { useState, useActionState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPatient } from './actions'
import { AlertTriangle } from 'lucide-react'

export function NewPatientModal({ doctors }: { doctors: { id: string; full_name: string }[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const initialState = { success: false, error: '' }
  const [state, formAction, isPending] = useActionState(createPatient, initialState)

  const [dui, setDui] = useState('')
  const [phone, setPhone] = useState('')
  const [birthDate, setBirthDate] = useState('')

  const handleDuiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) {
      val = val.substring(0, 8) + '-' + val.substring(8, 9);
    }
    setDui(val);
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 0) {
      // Must start with 2, 6, or 7
      if (!/^[267]/.test(val)) {
        val = ''; // Clear if the first digit is invalid
      }
    }
    if (val.length > 8) val = val.substring(0, 8);
    setPhone(val);
  }

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 2 && val.length <= 4) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    } else if (val.length > 4) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4) + '/' + val.substring(4, 8);
    }
    setBirthDate(val);
  }

  useEffect(() => {
    if (state?.success && !isPending) {
      setIsOpen(false)
      setDui('')
      setPhone('')
      setBirthDate('')
    }
  }, [state?.success, isPending])

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all border-none"
      >
        + Nuevo Paciente
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Registrar Ficha de Paciente">
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="p-4 bg-red-500/10 text-red-500 text-[10px] rounded-2xl font-black uppercase tracking-widest border border-red-500/20 italic">
              {state.error}
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre *</Label>
              <Input id="firstName" name="firstName" required className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Apellidos *</Label>
              <Input id="lastName" name="lastName" required className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dui" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">DUI *</Label>
              <Input id="dui" name="dui" value={dui} onChange={handleDuiChange} required placeholder="00000000-0" className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Teléfono</Label>
              <Input id="phone" name="phone" value={phone} onChange={handlePhoneChange} placeholder="Ej: 70009306" className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Correo Electrónico</Label>
            <Input id="email" name="email" type="email" className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Fecha de Nacimiento</Label>
              <Input id="birthDate" name="birthDate" type="text" placeholder="DD/MM/YYYY" value={birthDate} onChange={handleBirthDateChange} className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Género</Label>
              <select name="gender" className="w-full flex h-12 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-transparent dark:bg-black/20 px-4 py-2 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm">
                <option value="M" className="text-slate-900">Masculino</option>
                <option value="F" className="text-slate-900">Femenino</option>
                <option value="O" className="text-slate-900">Otro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodType" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tipo de Sangre</Label>
              <select name="bloodType" className="w-full flex h-12 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-transparent dark:bg-black/20 px-4 py-2 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm">
                <option value="" className="text-slate-900">— Desconocido —</option>
                <option value="A+" className="text-slate-900">A+</option>
                <option value="A-" className="text-slate-900">A-</option>
                <option value="B+" className="text-slate-900">B+</option>
                <option value="B-" className="text-slate-900">B-</option>
                <option value="AB+" className="text-slate-900">AB+</option>
                <option value="AB-" className="text-slate-900">AB-</option>
                <option value="O+" className="text-slate-900">O+</option>
                <option value="O-" className="text-slate-900">O-</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Dirección</Label>
              <Input id="address" name="address" className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 text-text-main font-black tracking-wide placeholder:text-slate-500 transition-all shadow-sm" />
            </div>
          </div>

          {/* Medical Info */}
          <div className="border-t border-slate-100/50 dark:border-white/5 pt-6 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Información Médica</h4>

            <div className="space-y-2">
              <Label htmlFor="allergies" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <div className="bg-red-500/10 p-1 rounded-md">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                </div>
                Alergias
              </Label>
              <textarea
                id="allergies"
                name="allergies"
                rows={2}
                placeholder="Ej: Penicilina, polvo, látex..."
                className="w-full min-h-[5rem] rounded-2xl border border-slate-200/50 dark:border-white/10 dark:bg-white/5 px-4 py-3 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 focus-visible:border-red-500/50 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="familyHistory" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Antecedentes Médicos Familiares</Label>
              <textarea
                id="familyHistory"
                name="familyHistory"
                rows={2}
                placeholder="Ej: Diabetes tipo 2 (padre), hipertensión..."
                className="w-full min-h-[5rem] rounded-2xl border border-slate-200/50 dark:border-white/10 dark:bg-white/5 px-4 py-3 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* Doctor Assignment */}
          {doctors && doctors.length > 0 && (
            <div className="border-t border-slate-100/50 dark:border-white/5 pt-6 space-y-2">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Asignación</h4>
              <Label htmlFor="assignedDoctorId" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Médico Responsable</Label>
              <select name="assignedDoctorId" className="w-full flex h-12 rounded-2xl border border-slate-200/50 dark:border-white/10 bg-transparent dark:bg-black/20 px-4 py-2 font-black text-text-main placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 transition-all shadow-sm">
                <option value="" className="text-slate-900">— Sin asignar —</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id} className="text-slate-900">Dr. {d.full_name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100/50 dark:border-white/5">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-2xl border-slate-200/50 dark:border-white/10 font-black uppercase tracking-widest text-[10px] h-12 px-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Cancelar</Button>
            <Button type="submit" disabled={isPending} className="bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all border-none">
              {isPending ? 'Guardando...' : 'Registrar Paciente'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
