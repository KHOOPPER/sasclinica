'use client'

import { Zap, Crown } from 'lucide-react'
import { toast } from 'sonner'

export function PricingGrid() {
  const handleEditPlan = () => {
    toast.info('Configuración de planes: La edición se habilitará al completar la integración con Stripe.')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Plan Básico */}
      <div className="bg-card-bg rounded-[2.5rem] p-9 shadow-card border border-slate-200/50 dark:border-white/5 flex flex-col relative group hover:-translate-y-1 transition-all">
        <div className="mb-6">
          <h3 className="text-[15px] font-black text-text-main uppercase tracking-tight">Básico</h3>
          <div className="mt-4 flex items-baseline gap-1 text-text-main">
            <span className="text-3xl font-black tracking-tight">$20</span>
            <span className="text-sm font-bold text-slate-400">/mes</span>
          </div>
        </div>
        <ul className="space-y-3 mb-8 flex-1">
          <li className="flex items-start gap-2.5 text-[13px] font-medium text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/10 mt-1.5" /> 2 Usuarios (Médico + Recepción)</li>
          <li className="flex items-start gap-2.5 text-[13px] font-medium text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/10 mt-1.5" /> Agenda y citas básicas</li>
          <li className="flex items-start gap-2.5 text-[13px] font-medium text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/10 mt-1.5" /> Expedientes clínicos</li>
        </ul>
        <button 
          onClick={handleEditPlan}
          className="w-full py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:text-slate-600 transition-all cursor-pointer"
        >
          Editar Plan
        </button>
      </div>

      <div className="bg-card-bg rounded-[2.5rem] p-9 shadow-card border-2 border-emerald-500/30 dark:border-emerald-500/20 flex flex-col relative group hover:-translate-y-1 transition-all overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-500 text-white dark:text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-lg">
          Más Popular
        </div>
        <div className="mb-6">
          <h3 className="text-[15px] font-black text-emerald-500 uppercase tracking-tight flex items-center gap-2">
            <Zap className="h-4 w-4 fill-emerald-500" /> PROFESIONAL
          </h3>
          <div className="mt-4 flex items-baseline gap-1 text-text-main">
            <span className="text-3xl font-black tracking-tight">$35</span>
            <span className="text-sm font-bold text-slate-400">/mes</span>
          </div>
        </div>
        <ul className="space-y-3 mb-8 flex-1">
          <li className="flex items-start gap-2.5 text-[13px] font-medium text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]" /> 4 Usuarios</li>
          <li className="flex items-start gap-2.5 text-[13px] font-medium text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]" /> WhatsApp Business</li>
          <li className="flex items-start gap-2.5 text-[13px] font-medium text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]" /> Facturación Interna</li>
          <li className="flex items-start gap-2.5 text-[13px] font-medium text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.4)]" /> Sitio Web Pro</li>
        </ul>
        <button 
          onClick={handleEditPlan}
          className="w-full py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/5 transition-all cursor-pointer"
        >
          Editar Plan
        </button>
      </div>

      <div className="bg-slate-950 rounded-[2.5rem] p-9 shadow-card border border-emerald-500/20 flex flex-col relative group hover:-translate-y-1 transition-all overflow-hidden ring-1 ring-emerald-500/10">
        <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl shadow-lg">
          Empresarial
        </div>
        <div className="mb-6">
          <h3 className="text-[15px] font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Crown className="h-4 w-4 text-emerald-400 fill-emerald-400/20" /> ELITE
          </h3>
          <div className="mt-4 flex items-baseline gap-1 text-white">
            <span className="text-3xl font-black tracking-tight">$50</span>
            <span className="text-sm font-bold text-slate-500">/mes</span>
          </div>
        </div>
        <ul className="space-y-3 mb-8 flex-1">
          <li className="flex items-start gap-2.5 text-[13px] font-medium text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_12px_rgba(52,211,153,0.5)]" /> Usuarios Ilimitados</li>
          <li className="flex items-start gap-2.5 text-[13px] font-medium text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_12px_rgba(52,211,153,0.5)]" /> Multi-sucursal</li>
          <li className="flex items-start gap-2.5 text-[13px] font-medium text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_12px_rgba(52,211,153,0.5)]" /> Dominio .com</li>
          <li className="flex items-start gap-2.5 text-[13px] font-medium text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shadow-[0_0_12px_rgba(52,211,153,0.5)]" /> Soporte VIP</li>
        </ul>
        <button 
          onClick={handleEditPlan}
          className="w-full py-3 px-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-white bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
        >
          Editar Plan
        </button>
      </div>
    </div>
  )
}
