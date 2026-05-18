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
      <div className="bg-card-bg rounded-2xl md:rounded-[2.5rem] p-4 md:p-9 shadow-card border border-slate-200/50 dark:border-white/5 flex flex-col relative group hover:-translate-y-1 transition-all">
        <div className="mb-3 md:mb-6">
          <h3 className="text-[13px] md:text-[15px] font-black text-text-main uppercase tracking-tight leading-none">Básico</h3>
          <div className="mt-3 md:mt-4 flex items-baseline gap-1 text-text-main">
            <span className="text-xl md:text-3xl font-black tracking-tight">$20</span>
            <span className="text-[10px] md:text-sm font-bold text-slate-400">/mes</span>
          </div>
        </div>
        <ul className="space-y-2 md:space-y-3 mb-4 md:mb-8 flex-1">
          <li className="flex items-start gap-2 text-[11px] md:text-[13px] font-medium text-slate-400 leading-tight"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/10 mt-1" /> 2 Usuarios</li>
          <li className="flex items-start gap-2 text-[11px] md:text-[13px] font-medium text-slate-400 leading-tight"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/10 mt-1" /> Agenda básica</li>
          <li className="flex items-start gap-2 text-[11px] md:text-[13px] font-medium text-slate-400 leading-tight"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/10 mt-1" /> Expedientes</li>
        </ul>
        <button 
          onClick={handleEditPlan}
          className="w-full py-2.5 px-4 rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:text-slate-600 transition-all cursor-pointer"
        >
          Editar Plan
        </button>
      </div>

      <div className="bg-card-bg rounded-2xl md:rounded-[2.5rem] p-4 md:p-9 shadow-card border-2 border-emerald-500/30 dark:border-emerald-500/20 flex flex-col relative group hover:-translate-y-1 transition-all overflow-hidden">
        <div className="absolute top-0 right-0 bg-emerald-500 text-white dark:text-black text-[7px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-xl shadow-lg">
          Popular
        </div>
        <div className="mb-3 md:mb-6">
          <h3 className="text-[13px] md:text-[15px] font-black text-emerald-500 uppercase tracking-tight flex items-center gap-2 leading-none">
            <Zap className="h-3.5 w-3.5 md:h-4 md:w-4 fill-emerald-500" /> PROFESIONAL
          </h3>
          <div className="mt-3 md:mt-4 flex items-baseline gap-1 text-text-main">
            <span className="text-xl md:text-3xl font-black tracking-tight">$35</span>
            <span className="text-[10px] md:text-sm font-bold text-slate-400">/mes</span>
          </div>
        </div>
        <ul className="space-y-2 md:space-y-3 mb-4 md:mb-8 flex-1">
          <li className="flex items-start gap-2 text-[11px] md:text-[13px] font-medium text-slate-400 leading-tight"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" /> 4 Usuarios</li>
          <li className="flex items-start gap-2 text-[11px] md:text-[13px] font-medium text-slate-400 leading-tight"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" /> WhatsApp Biz</li>
          <li className="flex items-start gap-2 text-[11px] md:text-[13px] font-medium text-slate-400 leading-tight"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" /> Facturación</li>
          <li className="flex items-start gap-2 text-[11px] md:text-[13px] font-medium text-slate-400 leading-tight"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" /> Sitio Web</li>
        </ul>
        <button 
          onClick={handleEditPlan}
          className="w-full py-2.5 px-4 rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/5 transition-all cursor-pointer"
        >
          Editar Plan
        </button>
      </div>

      <div className="bg-slate-950 rounded-2xl md:rounded-[2.5rem] p-4 md:p-9 shadow-card border border-emerald-500/20 flex flex-col relative group hover:-translate-y-1 transition-all overflow-hidden ring-1 ring-emerald-500/10">
        <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[7px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-xl shadow-lg">
          Elite
        </div>
        <div className="mb-3 md:mb-6">
          <h3 className="text-[13px] md:text-[15px] font-black text-white uppercase tracking-tight flex items-center gap-2 leading-none">
            <Crown className="h-3.5 w-3.5 md:h-4 md:w-4 text-emerald-400 fill-emerald-400/20" /> ELITE
          </h3>
          <div className="mt-3 md:mt-4 flex items-baseline gap-1 text-white">
            <span className="text-xl md:text-3xl font-black tracking-tight">$50</span>
            <span className="text-[10px] md:text-sm font-bold text-slate-500">/mes</span>
          </div>
        </div>
        <ul className="space-y-2 md:space-y-3 mb-4 md:mb-8 flex-1">
          <li className="flex items-start gap-2 text-[11px] md:text-[13px] font-medium text-slate-400 leading-tight"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1" /> Ilimitados</li>
          <li className="flex items-start gap-2 text-[11px] md:text-[13px] font-medium text-slate-400 leading-tight"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1" /> Multi-sucursal</li>
          <li className="flex items-start gap-2 text-[11px] md:text-[13px] font-medium text-slate-400 leading-tight"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1" /> Dominio .com</li>
        </ul>
        <button 
          onClick={handleEditPlan}
          className="w-full py-2.5 px-4 rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-widest text-white bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer"
        >
          Editar Plan
        </button>
      </div>
    </div>
  )
}
