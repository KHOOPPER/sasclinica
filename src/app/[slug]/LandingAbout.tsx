'use client'

import React from 'react'
import { CheckCircle2, ShieldCheck, Activity, Users, HeartPulse, Stethoscope, Medal, Plus, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LandingAbout({ clinicData, primaryColor = '#0059bb' }: { clinicData: any, primaryColor?: string }) {
    const {
        about_title = 'Nuestra Clínica',
        about_subtitle = 'Comprometidos con tu bienestar desde el primer día.',
        about_description = 'Somos un equipo multidisciplinario de especialistas de primer nivel dedicados a ofrecer una atención integral. Creemos firmemente en el trato humano, ético y personalizado.',
        about_image_url = 'https://images.unsplash.com/photo-1551076805-e18690c5e561?q=80&w=2000&auto=format&fit=crop',
        about_variant = 'split',
        about_badge = '+10 Años',
        about_badge_subtext = 'Experiencia Clínica',
        about_accent_color = null,
        about_bg_opacity = 10,
        about_blur = 20,
        about_overlay_opacity = 70,
        show_about = true
    } = clinicData

    if (!show_about) return null

    // Determine the active accent color (custom or global primary)
    const activeAccent = about_accent_color || primaryColor
    
    const validImageUrl = about_image_url && about_image_url.trim() !== '' 
        ? about_image_url 
        : 'https://images.unsplash.com/photo-1551076805-e18690c5e561?q=80&w=2000&auto=format&fit=crop'

    const features = [
        { 
            title: 'Atención Personalizada', 
            desc: 'Cada paciente es único y recibe un seguimiento estrecho.',
            icon: HeartPulse
        },
        { 
            title: 'Tecnología de Punta', 
            desc: 'Equipos modernos para diagnósticos exactos.',
            icon: Stethoscope
        }
    ]

    // ============================================
    // VARIANT 1: ELITE SPLIT (Standard)
    // ============================================
    if (about_variant === 'split') {
        return (
            <section id="nosotros" className="py-20 md:py-32 bg-white overflow-hidden relative z-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-20 items-center">
                        <div className="relative group order-2 lg:order-1">
                            <div className="aspect-[4/5] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl relative bg-slate-100">
                                <img src={validImageUrl} alt={about_title} className="w-full h-full object-cover transition-transform  group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                            
                            {/* Floating Badge */}
                            <div className="absolute -left-4 md:-left-8 top-1/4 bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-slate-100    z-10">
                                <div className="flex flex-col items-center gap-2">
                                    <div 
                                        className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center"
                                        style={{ backgroundColor: `${activeAccent}15`, color: activeAccent }}
                                    >
                                        <Medal className="w-5 h-5 md:w-7 md:h-7" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl md:text-2xl font-black text-slate-900 leading-none">{about_badge}</p>
                                        <p className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{about_badge_subtext}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 md:space-y-12 order-1 lg:order-2 text-center lg:text-left">
                            <div className="space-y-4 md:space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-slate-50 border border-slate-100">
                                    <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: activeAccent }} />
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400">{about_title}</span>
                                </div>
                                <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.95]">
                                    {about_subtitle}
                                </h2>
                                <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    {about_description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-8 md:gap-10 pt-8 border-t border-slate-100">
                                {features.map((f, i) => (
                                    <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 group">
                                        <div 
                                            className="h-14 w-14 md:h-16 md:w-16 shrink-0 rounded-2xl md:rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 transition-all group-hover:text-white"
                                            style={{ '--hover-bg': activeAccent } as any}
                                        >
                                            <f.icon className="w-5 h-5 md:w-6 md:h-6 group-hover:text-white transition-colors" />
                                        </div>
                                        <style jsx>{`
                                            div:hover { background-color: var(--hover-bg) !important; }
                                        `}</style>
                                        <div className="text-center sm:text-left">
                                            <h4 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight">{f.title}</h4>
                                            <p className="text-sm md:text-base text-slate-500 font-medium mt-1">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Diffusion Fade for smooth transition */}
                <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            </section>
        )
    }

    // ============================================
    // VARIANT 2: GLASS MATRIX (Modern)
    // ============================================
    if (about_variant === 'glass') {
        return (
            <section id="nosotros" className="py-20 md:py-32 bg-slate-950 overflow-hidden relative">
                {/* Background Image Container with Dynamic Blur & Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img 
                        src={validImageUrl} 
                        className="w-full h-full object-cover scale-110" 
                        alt="" 
                        style={{ filter: `blur(${about_blur}px)` }}
                    />
                    {/* Dark Overlay with Dynamic Opacity */}
                    <div 
                        className="absolute inset-0 bg-slate-950/80" 
                        style={{ opacity: about_overlay_opacity / 100 }}
                    />
                    {/* Subtle Gradient Polish */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950 opacity-60" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 mb-16 md:mb-20">
                         <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
                            <Activity size={12} style={{ color: activeAccent }} />
                            {about_title}
                        </div>
                        <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter max-w-4xl leading-[0.95]">
                            {about_subtitle}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        <div 
                            className="lg:col-span-2 backdrop-blur-3xl p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-white/10 flex flex-col justify-between group"
                            style={{ backgroundColor: `rgba(255,255,255,${about_bg_opacity / 1000})` }}
                        >
                            <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed italic">
                                "{about_description}"
                            </p>
                            <div className="pt-10 md:pt-12 flex items-center gap-4 md:gap-6">
                                <div 
                                    className="h-12 w-12 md:h-16 md:w-16 rounded-full flex items-center justify-center text-black font-black text-lg md:text-xl"
                                    style={{ backgroundColor: activeAccent }}
                                >
                                    <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <div>
                                    <p className="text-lg md:text-xl text-white font-black">{about_badge}</p>
                                    <p className="text-slate-500 uppercase tracking-widest text-[8px] md:text-[10px] font-bold">{about_badge_subtext}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-8">
                            {features.map((f, i) => (
                                <div 
                                    key={i} 
                                    className="backdrop-blur-2xl p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/10 hover:bg-white/10 transition-all group"
                                    style={{ backgroundColor: `rgba(255,255,255,${about_bg_opacity / 1000})` }}
                                >
                                    <f.icon className="h-8 w-8 md:h-10 md:w-10 mb-4 md:mb-6" style={{ color: activeAccent }} />
                                    <h4 className="text-white font-black uppercase tracking-tight text-lg md:text-xl mb-2">{f.title}</h4>
                                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Diffusion Fade for smooth transition */}
                <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
            </section>
        )
    }

    // ============================================
    // VARIANT 3: BOUTIQUE SHOWCASE (New)
    // ============================================
    return (
        <section id="nosotros" className="py-20 md:py-40 bg-zinc-50 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 md:mb-24 space-y-6 md:space-y-8">
                    <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-zinc-400 flex items-center gap-2 md:gap-3">
                         <div className="h-px w-6 md:w-8 bg-zinc-200" />
                         {about_title}
                         <div className="h-px w-6 md:w-8 bg-zinc-200" />
                    </span>
                    <h2 className="text-4xl md:text-8xl font-black text-zinc-950 tracking-tighter leading-[0.95] md:leading-[0.9] text-balance">
                        {about_subtitle}
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-500 font-medium leading-relaxed max-w-2xl">
                        {about_description}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
                     <div className="lg:col-span-2 aspect-[16/10] sm:aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative">
                        <img src={validImageUrl} className="w-full h-full object-cover" alt="Boutique showcase" />
                        <div className="absolute inset-0 bg-black/10" />
                        
                        {/* Floating Lab Info */}
                        <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${activeAccent}15`, color: activeAccent }}>
                                    <Medal className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="text-lg md:text-xl font-black text-zinc-900 leading-none">{about_badge}</p>
                                    <p className="text-[8px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{about_badge_subtext}</p>
                                </div>
                            </div>
                            <button 
                                className="h-10 md:h-12 w-full sm:w-auto px-6 rounded-full text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-black/5"
                                style={{ backgroundColor: activeAccent }}
                            >
                                Contactar
                            </button>
                        </div>
                     </div>

                     <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-white border border-zinc-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl md:rounded-3xl bg-zinc-50 flex items-center justify-center text-zinc-300 mb-6 md:mb-8 transition-transform group-hover:-rotate-6">
                                    <f.icon className="w-6 h-6 md:w-7 md:h-7" />
                                </div>
                                <h4 className="text-zinc-900 font-black uppercase tracking-tight text-base md:text-lg mb-2">{f.title}</h4>
                                <p className="text-zinc-500 text-xs md:text-sm leading-relaxed">{f.desc}</p>
                                <div className="mt-6 md:mt-8 flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" style={{ color: activeAccent }}>
                                    Leer más <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                </div>
                            </div>
                        ))}
                        
                        {/* Final boutique-only card */}
                        <div className="sm:col-span-2 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-zinc-300 transition-all">
                             <Plus className="h-8 w-8 md:h-10 md:w-10 text-zinc-200 group-hover:scale-125 transition-transform" />
                             <p className="text-zinc-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-3 md:mt-4">Nuestra Filosofía Médica</p>
                        </div>
                     </div>
                </div>
            </div>
            {/* Diffusion Fade for smooth transition */}
            <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-zinc-50 to-transparent pointer-events-none" />
        </section>
    )
}
