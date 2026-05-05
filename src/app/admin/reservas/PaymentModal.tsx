'use client'

import { useState, useActionState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DollarSign, CreditCard, ReceiptText, Landmark } from 'lucide-react'
import { createPayment, ActionState } from '@/app/actions/payment_actions'

interface PaymentModalProps {
  appointment: {
    id: string
    tenant_id: string
    service: {
      name: string
      price: number
    }
    patient: {
      first_name: string
      last_name: string
    }
  }
}

export default function PaymentModal({ appointment }: PaymentModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const initialState: ActionState = { success: false }
  const [state, formAction, isPending] = useActionState(createPayment, initialState)

  useEffect(() => {
    if (state?.success && !isPending) {
      setIsOpen(false)
    }
  }, [state?.success, isPending])

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className="bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400 text-white dark:text-black font-black uppercase tracking-widest text-[9px] h-8 px-4 rounded-xl shadow-lg transition-all flex items-center gap-2 border-none"
      >
        <DollarSign className="h-4 w-4" /> Registrar Pago
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Registrar Pago">
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="appointmentId" value={appointment.id} />
          <input type="hidden" name="tenantId" value={appointment.tenant_id} />

          <div className="bg-slate-50/50 dark:bg-white/5 p-5 rounded-[2rem] border border-slate-200/50 dark:border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Servicio: {appointment.service?.name}</p>
              <p className="text-sm font-black text-text-main uppercase tracking-tight">{appointment.patient?.first_name} {appointment.patient?.last_name}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-1">Monto</p>
              <p className="text-xl font-black text-emerald-500 tracking-tighter tabular-nums">${appointment.service?.price}</p>
            </div>
          </div>

          {state?.error && (
            <div className="p-4 bg-red-500/10 text-red-500 text-[10px] rounded-2xl font-black uppercase tracking-widest border border-red-500/20 italic">
              {state.error}
            </div>
          )}

          <div className="space-y-3">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Monto Final ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500/50" />
              <Input 
                id="amount" 
                name="amount" 
                type="number" 
                step="0.01" 
                defaultValue={appointment.service?.price} 
                required 
                className="pl-12 h-14 rounded-2xl text-text-main font-black tracking-widest border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-lg"
              />
            </div>
          </div>

          <div className="space-y-4">
             <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Método de Pago</Label>
             <div className="grid grid-cols-3 gap-3">
                <label className="cursor-pointer border-2 border-slate-100/50 dark:border-white/5 rounded-[1.5rem] p-4 flex flex-col items-center gap-3 active:scale-95 hover:border-emerald-500/30 transition-all [&:has(input:checked)]:border-emerald-500 [&:has(input:checked)]:bg-emerald-500/10 group shadow-sm">
                   <input type="radio" name="method" value="cash" className="hidden" defaultChecked />
                   <ReceiptText className="h-6 w-6 text-slate-400 group-has-[input:checked]:text-emerald-500" />
                   <span className="text-[9px] font-black text-slate-500 group-has-[input:checked]:text-emerald-500 uppercase tracking-widest">EFECTIVO</span>
                </label>
                <label className="cursor-pointer border-2 border-slate-100/50 dark:border-white/5 rounded-[1.5rem] p-4 flex flex-col items-center gap-3 active:scale-95 hover:border-emerald-500/30 transition-all [&:has(input:checked)]:border-emerald-500 [&:has(input:checked)]:bg-emerald-500/10 group shadow-sm">
                   <input type="radio" name="method" value="card" className="hidden" />
                   <CreditCard className="h-6 w-6 text-slate-400 group-has-[input:checked]:text-emerald-500" />
                   <span className="text-[9px] font-black text-slate-500 group-has-[input:checked]:text-emerald-500 uppercase tracking-widest">TARJETA</span>
                </label>
                <label className="cursor-pointer border-2 border-slate-100/50 dark:border-white/5 rounded-[1.5rem] p-4 flex flex-col items-center gap-3 active:scale-95 hover:border-emerald-500/30 transition-all [&:has(input:checked)]:border-emerald-500 [&:has(input:checked)]:bg-emerald-500/10 group shadow-sm">
                   <input type="radio" name="method" value="transfer" className="hidden" />
                   <Landmark className="h-6 w-6 text-slate-400 group-has-[input:checked]:text-emerald-500" />
                   <span className="text-[9px] font-black text-slate-500 group-has-[input:checked]:text-emerald-500 uppercase tracking-widest">TRANSF.</span>
                </label>
             </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="notes" className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Notas (Opcional)</Label>
            <Input id="notes" name="notes" placeholder="Ej. Pago con descuento de colaborador" className="h-12 rounded-2xl border-slate-200/50 dark:border-white/10 dark:bg-white/5 focus:ring-emerald-500 font-black uppercase text-[10px] tracking-widest placeholder:text-slate-500" />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100/50 dark:border-white/5">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)} 
              className="rounded-2xl border-slate-200/50 dark:border-white/10 font-black uppercase tracking-widest text-[10px] h-12 px-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isPending} 
              className="bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all border-none min-w-[160px]"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando...</span>
                </div>
              ) : 'Confirmar Cobro'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
