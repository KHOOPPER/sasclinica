'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { CreditCard, Calendar, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { updateTenantPlan } from './actions'
import { toast } from 'sonner'

interface PlanManagementModalProps {
  isOpen: boolean
  onClose: () => void
  tenant: {
    id: string
    name: string
    plan?: string
    plan_expires_at?: string
  }
}

const PLANS = [
  { id: 'basic', name: 'Básico', price: 20, features: ['2 Usuarios', 'Agenda básica', 'Expedientes'] },
  { id: 'professional', name: 'Profesional', price: 35, features: ['4 Usuarios', 'WhatsApp Business', 'Facturación'] },
  { id: 'elite', name: 'Elite', price: 50, features: ['Usuarios Ilimitados', 'Multi-sucursal', 'Dominio .com'] },
]

export function PlanManagementModal({ isOpen, onClose, tenant }: PlanManagementModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(tenant.plan || 'basic')
  // Inicializar con la fecha actual de la clínica o hoy si no tiene
  const initialDate = tenant.plan_expires_at ? new Date(tenant.plan_expires_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  const [expiryDate, setExpiryDate] = useState(initialDate)

  const handleSave = async () => {
    setLoading(true)
    const planData = PLANS.find(p => p.id === selectedPlan)
    
    const result = await updateTenantPlan(tenant.id, selectedPlan, expiryDate, planData?.price || 0)
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Plan ${selectedPlan.toUpperCase()} actualizado para ${tenant.name}`)
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestión de Plan SaaS">
      <div className="space-y-8 p-1">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Seleccionar Arquitectura</p>
          <div className="grid grid-cols-1 gap-3">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  selectedPlan === plan.id 
                    ? 'border-brand-primary bg-emerald-500/5 shadow-lg shadow-emerald-500/10' 
                    : 'border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${selectedPlan === plan.id ? 'bg-brand-primary text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black text-text-main uppercase">{plan.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">${plan.price}/mes</p>
                  </div>
                </div>
                {selectedPlan === plan.id && <CheckCircle2 className="h-5 w-5 text-brand-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vencimiento del Servicio</p>
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
            <div className="flex-1">
              <p className="text-xs font-bold text-text-main">Nueva Fecha de Corte</p>
              <p className="text-[10px] text-slate-400 font-medium italic">Actual: {tenant.plan_expires_at ? new Date(tenant.plan_expires_at).toLocaleDateString() : 'Sin fecha'}</p>
            </div>
            <div className="flex items-center gap-3">
              <input 
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-black text-text-main focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-950 rounded-[2rem] p-6 text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Resumen de Actualización</p>
              <CreditCard className="h-4 w-4 text-slate-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black">{selectedPlan.toUpperCase()}</span>
              <span className="text-xs font-bold text-slate-400">Arquitectura Seleccionada</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
              <Calendar className="h-3 w-3" />
              Nuevo Vencimiento: {new Date(expiryDate + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="h-24 w-24 text-emerald-500" />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="flex-[2] h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar Activación'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
