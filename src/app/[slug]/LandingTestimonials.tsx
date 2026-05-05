'use client'

import React from 'react'
import { Quote, MessageSquare, HeartPulse, ShieldCheck, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LandingTestimonials({ clinicData }: { clinicData: any }) {
  const {
    testimonials_data = [],
    testimonials_variant = 'grid',
    show_testimonials = false,
    primary_color = '#0059bb'
  } = clinicData

  if (!show_testimonials || !testimonials_data.length) return null

  const activeAccent = clinicData.about_accent_color || primary_color

  // ============================================
  // VARIANT 1: ELITE CARDS (Clean & Symmetrical)
  // ============================================
  if (testimonials_variant === 'grid') {
    return (
      <section id="testimonios" className="py-32 bg-zinc-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-6 mb-24">
             <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-zinc-100 shadow-sm">
                <Quote size={14} className="text-zinc-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Nuestros Pacientes</span>
             </div>
             <h2 className="text-5xl md:text-8xl font-black text-zinc-950 tracking-tighter leading-none">
                Confían en nosotros
             </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials_data.map((t: any, i: number) => (
              <div key={i} className="p-12 rounded-[3.5rem] bg-white border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                <div className="flex items-center gap-1 mb-8">
                   {[1,2,3,4,5].map(n => <Star key={n} size={14} fill={activeAccent} className="text-transparent" />)}
                </div>
                <p className="text-xl text-zinc-600 font-medium leading-relaxed italic mb-10">
                   "{t.content}"
                </p>
                <div className="flex items-center gap-4 pt-8 border-t border-zinc-50">
                   <div className="h-14 w-14 rounded-full overflow-hidden bg-zinc-100 border-2 border-white shadow-lg">
                      <img src={t.image_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + i} alt={t.name} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h4 className="text-lg font-black text-zinc-900 tracking-tight leading-none uppercase">{t.name}</h4>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{t.specialty}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ============================================
  // VARIANT 2: GLASS FLOATING (High End Dark)
  // ============================================
  if (testimonials_variant === 'glass') {
    return (
      <section id="testimonios" className="py-40 bg-slate-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
              <div className="lg:col-span-5 space-y-10 text-center lg:text-left">
                 <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
                    <ShieldCheck size={14} className="text-amber-500" />
                    Casos de Éxito
                 </div>
                 <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                    Historias de <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-amber-500">recuperación</span> real
                 </h2>
                 <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
                    Mas de 5,000 pacientes han transformado su calidad de vida gracias a nuestra atención especializada.
                 </p>
              </div>

              <div className="lg:col-span-7 grid gap-8">
                {testimonials_data.map((t: any, i: number) => (
                  <div key={i} className={cn(
                    "p-10 rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 hover:bg-white/10 transition-all duration-500 group",
                    i % 2 !== 0 && "lg:translate-x-12"
                  )}>
                    <p className="text-xl text-slate-300 font-medium leading-relaxed mb-8 italic">
                       "{t.content}"
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden border border-white/20">
                            <img src={t.image_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (i+10)} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-white font-black uppercase tracking-tight text-lg">{t.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{t.specialty}</p>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>
    )
  }

  // ============================================
  // VARIANT 3: MINIMALIST (Clean Typography)
  // ============================================
  return (
    <section id="testimonios" className="py-32 bg-white relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
         <div className="space-y-24">
            {testimonials_data.slice(0, 1).map((t: any, i: number) => (
               <div key={i} className="space-y-16">
                  <div className="flex justify-center">
                     <div className="h-20 w-20 rounded-full flex items-center justify-center bg-zinc-50 border border-zinc-100 shadow-2xl relative overflow-hidden">
                        <Quote size={32} className="text-zinc-200" />
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                     </div>
                  </div>
                  <h3 className="text-4xl md:text-7xl font-black text-zinc-950 tracking-tighter leading-[0.95] text-balance">
                     "{t.content}"
                  </h3>
                  <div className="flex flex-col items-center space-y-4">
                     <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-zinc-50 shadow-2xl">
                        <img src={t.image_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=focused'} alt={t.name} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <p className="text-2xl font-black text-zinc-900 tracking-tight uppercase leading-none">{t.name}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-2">{t.specialty}</p>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </section>
  )
}
