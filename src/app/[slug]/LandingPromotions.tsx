'use client'

import React from 'react'
import { Tag, ArrowRight, Sparkles, Clock, Percent } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LandingPromotions({ clinicData }: { clinicData: any }) {
  const {
    promotions_data = [],
    promo_variant = 'grid',
    show_promotions = false,
    primary_color = '#0059bb',
    promotions_title = 'Ofertas Especiales',
    promotions_subtitle = 'Oportunidades Únicas',
    promotions_badge = 'Limitado',
    promotions_cta_text = 'Ver Detalles',
    promo_text_color = '#ffffff',
    promo_bg_color = 'rgba(15, 23, 42, 0.4)',
    promo_section_bg = null,
    promo_accent_color = null,
    promo_cta_bg_color = null,
    promo_cta_text_color = null
  } = clinicData

  if (!show_promotions || !promotions_data.length) return null

  const fallbackImage = 'https://images.unsplash.com/photo-1576091160550-217359f481e3?q=80&w=2000&auto=format&fit=crop'
  const activeAccent = promo_accent_color || clinicData.about_accent_color || primary_color
  const ctaBg = promo_cta_bg_color || activeAccent
  const ctaText = promo_cta_text_color || (promo_variant === 'grid' ? '#0f172a' : '#ffffff')

  // ============================================
  // VARIANT 1: ELITE GRID (Texto sobre Imagen)
  // ============================================
  if (promo_variant === 'grid') {
    return (
      <section id="ofertas" className="py-20 md:py-24 relative overflow-hidden" style={{ backgroundColor: promo_section_bg || '#ffffff' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-16 md:mb-20">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-zinc-400">{promotions_subtitle}</span>
            <h2 className="text-4xl md:text-7xl font-black text-zinc-900 tracking-tighter leading-[0.95] md:leading-none">
               {promotions_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {promotions_data.map((promo: any, i: number) => (
              <div key={i} className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all  md:hover:-translate-y-3" style={{ backgroundColor: promo_bg_color || '#f4f4f5' }}>
                <div className="absolute inset-0 z-0">
                  <img 
                    src={promo.image_url || fallbackImage} 
                    alt={promo.title} 
                    className="w-full h-full object-cover transition-transform  group-hover:scale-105" 
                  />
                  {/* Gradiente para legibilidad */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>
                
                <div className="absolute top-4 md:top-6 right-4 md:right-6 z-20 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-xl">
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-900">{promotions_badge}</span>
                </div>

                <div className="absolute inset-0 z-10 p-8 md:p-10 flex flex-col justify-end space-y-3 md:space-y-4" style={{ color: promo_text_color }}>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tighter leading-none uppercase">
                    {promo.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="opacity-40 line-through text-xs md:text-sm font-bold">{promo.old_price}</span>
                    <span className="text-3xl md:text-4xl font-black" style={{ color: activeAccent }}>{promo.new_price}</span>
                  </div>
                  <button 
                    className="w-full sm:w-fit px-6 md:px-8 py-3.5 md:py-4 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:opacity-90 flex items-center justify-center gap-3 active:scale-95 shadow-2xl"
                    style={{ backgroundColor: ctaBg, color: ctaText }}
                  >
                    {promotions_cta_text} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ============================================
  // VARIANT 2: GLASS MATRIX (Premium & Slender)
  // ============================================
  if (promo_variant === 'glass') {
    return (
      <section id="ofertas" className="py-20 md:py-32 relative overflow-hidden" style={{ backgroundColor: promo_section_bg || '#020617' }}>
        <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/10 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/5 blur-[80px] md:blur-[120px] rounded-full" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center space-y-4 mb-16 md:mb-24">
            <div className="flex items-center justify-center gap-3 md:gap-4">
               <div className="h-px w-8 md:w-12 bg-white/20" />
               <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-white/40">{promotions_subtitle}</span>
               <div className="h-px w-8 md:w-12 bg-white/20" />
            </div>
            <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-[0.95] md:leading-none uppercase">
               {promotions_title}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
             {promotions_data.map((promo: any, i: number) => (
                <div key={i} className="flex flex-col sm:flex-row backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden group transition-all  shadow-2xl" style={{ backgroundColor: promo_bg_color || 'rgba(15, 23, 42, 0.4)' }}>
                    <div className="sm:w-2/5 aspect-[16/9] sm:aspect-auto relative bg-black/20 overflow-hidden">
                        <img 
                          src={promo.image_url || fallbackImage} 
                          alt={promo.title} 
                          className="w-full h-full object-cover transition-transform  group-hover:scale-105" 
                        />
                    </div>
                    <div className="sm:w-3/5 p-8 md:p-10 flex flex-col justify-between space-y-6 md:space-y-8">
                        <div className="space-y-3 md:space-y-4 text-left">
                            <div className="flex items-center gap-2 text-amber-500">
                               <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                               <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{promotions_badge}</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-tight uppercase">
                               {promo.title}
                            </h3>
                         </div>
                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/5 pt-6 md:pt-8 gap-6 sm:gap-4">
                            <div className="flex flex-col">
                               <span className="text-white/40 line-through text-[10px] md:text-xs font-bold">{promo.old_price}</span>
                               <span className="text-3xl md:text-4xl font-black text-white">{promo.new_price}</span>
                            </div>
                            <button 
                              className="h-14 md:h-16 w-full sm:w-auto px-8 rounded-full flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest italic"
                              style={{ backgroundColor: ctaBg, color: ctaText }}
                            >
                               {promotions_cta_text} <ArrowRight className="w-4 h-4 md:w-4.5 md:h-4.5" />
                            </button>
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
  // VARIANT 3: ELITE OVERLAP (Editorial & Boutique)
  // ============================================
  return (
    <section id="ofertas" className="py-16 relative overflow-hidden" style={{ backgroundColor: promo_section_bg || '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-12 md:mb-16">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-zinc-300">{promotions_subtitle}</span>
            <h2 className="text-3xl md:text-5xl font-black text-zinc-950 tracking-tighter leading-none uppercase">
               {promotions_title}
            </h2>
          </div>

         <div className="space-y-12 md:space-y-16">
            {promotions_data.map((promo: any, i: number) => (
               <div key={i} className={cn(
                 "flex flex-col lg:flex-row items-center relative gap-0 lg:gap-0",
                 i % 2 !== 0 && "lg:flex-row-reverse"
               )}>
                  {/* Imagen de Gran Formato */}
                  <div className="w-full lg:w-3/5 aspect-[16/10] lg:h-[350px] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-xl group relative bg-zinc-100 border border-zinc-100">
                    <img 
                      src={promo.image_url || fallbackImage} 
                      alt={promo.title} 
                      className="w-full h-full object-cover transition-transform  group-hover:scale-105" 
                    />
                    <div className="absolute top-4 md:top-6 right-4 md:right-6 z-20 bg-white/90 backdrop-blur-md text-zinc-950 px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-lg">
                      <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">{promotions_badge}</span>
                    </div>
                  </div>

                  {/* Tarjeta de Texto "Floating Glass" */}
                  <div className={cn(
                    "w-full lg:w-[42%] lg:absolute z-30 p-8 lg:p-10 rounded-2xl md:rounded-[2rem] shadow-2xl lg:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-black/5 flex flex-col justify-center space-y-5 md:space-y-6 backdrop-blur-3xl transition-all  mt-[-2rem] lg:mt-0 mx-4 lg:mx-0",
                    i % 2 === 0 ? "lg:right-0 lg:-mr-10" : "lg:left-0 lg:-ml-10"
                  )} style={{ backgroundColor: promo_bg_color || 'rgba(255, 255, 255, 0.95)', color: promo_text_color || '#000000' }}>
                     <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="h-px w-6" style={{ backgroundColor: promo_text_color ? `${promo_text_color}33` : 'rgba(0,0,0,0.2)' }} />
                           <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]" style={{ color: promo_text_color ? `${promo_text_color}66` : 'rgba(0,0,0,0.4)' }}>Exclusive Offer</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black tracking-tighter leading-[1.1] uppercase italic underline decoration-zinc-950/5 underline-offset-4" style={{ color: promo_text_color || '#000000' }}>
                           {promo.title}
                        </h3>
                     </div>

                     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8">
                        <div className="flex flex-col">
                           <span className="line-through text-xs md:text-sm font-bold tracking-tighter opacity-50">{promo.old_price}</span>
                           <span className="text-3xl md:text-4xl font-black tracking-tighter" style={{ color: activeAccent }}>{promo.new_price}</span>
                        </div>
                        <button 
                          className="w-full sm:w-fit h-12 md:h-14 px-6 md:px-8 rounded-2xl text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                          style={{ backgroundColor: ctaBg, color: ctaText }}
                        >
                           {promotions_cta_text} <ArrowRight size={14} />
                        </button>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </section>
  )
}
