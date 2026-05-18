'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2, Sparkles, Shield, Star, Heart, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LandingHero({ 
    clinicData, 
    onBookClick,
    isPreview = false 
}: { 
    clinicData: any, 
    onBookClick: () => void,
    isPreview?: boolean 
}) {
    const { 
        hero_title, 
        hero_subtitle, 
        hero_image_url, 
        primary_color = '#2563eb',
        accent_color = '#60a5fa',
        hero_variant = 'centered',
        header_variant = 'classic',
        enable_animations = true,
    } = clinicData

    const title = hero_title || "Atención médica privada de *primer nivel.*"
    const subtitle = hero_subtitle || "Tu tiempo y tu salud son nuestra prioridad. Consultas el mismo día, sin tiempos de espera y con el mejor equipo médico."
    const badgeText = clinicData.hero_badge || "Clínica Privada Élite"
    const ctaText = clinicData.hero_cta_text || "Agendar Consulta Ahora"
    
    const trustBadges = [
        clinicData.trust_badge_1 || "Seguros Médicos",
        clinicData.trust_badge_2 || "ISO 9001:2015",
        clinicData.trust_badge_3 || "Certificada"
    ].filter(Boolean)

    const renderTitle = (text: string) => {
        if (!text) return null;
        const parts = text.split('*');
        return parts.map((part, i) => {
            if (i % 2 === 1) { // Bold/Colored part
                return <span key={i} style={{ color: accent_color }}>{part}</span>
            }
            return part;
        });
    }

    const animationClass = ""

    const headerSpacingClass = isPreview 
        ? (header_variant === 'floating' ? "pt-24" : "pt-10") 
        : header_variant === 'floating' 
            ? "pt-32 lg:pt-40" 
            : header_variant === 'minimal' 
                ? "pt-48 lg:pt-56" 
                : "pt-24 lg:pt-32"

    // Use a neutral dark background if no image is provided
    const bgImage = hero_image_url || null

    // ============================================
    // VARIANT 1: CENTRADO CLÁSICO ('centered')
    // ============================================
    if (hero_variant === 'centered') {
        return (
            <section id="inicio" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0 bg-slate-950">
                    {bgImage && <img src={bgImage} className="w-full h-full object-cover" alt="Hero background" />}
                    <div className="absolute inset-0 bg-slate-950/60" />
                </div>

                <div className={cn("relative z-10 max-w-5xl mx-auto px-6 text-center space-y-6 md:space-y-8 h-full flex flex-col justify-center", headerSpacingClass, animationClass)}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] mx-auto">
                        <Plus size={10} className="text-amber-500" />
                        {badgeText}
                    </div>
                    <h1 className="text-4xl md:text-8xl font-black text-white leading-[1.05] tracking-tight">
                        {renderTitle(title)}
                    </h1>
                    <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        {subtitle}
                    </p>
                    <div className="pt-4 md:pt-6 flex flex-col items-center gap-6 md:gap-8">
                        <Button 
                            onClick={onBookClick}
                            className="h-14 md:h-16 px-8 md:px-10 rounded-2xl text-base md:text-lg font-black uppercase tracking-widest text-white transition-all hover:scale-105 w-full md:w-auto"
                            style={{ backgroundColor: primary_color, boxShadow: `0 20px 40px ${primary_color}40` }}
                        >
                            {ctaText}
                            <ArrowRight className="ml-3 h-5 w-5" />
                        </Button>
                        
                        <div className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-8 gap-y-3 opacity-70">
                            {trustBadges.map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                                    <CheckCircle2 size={12} className="text-emerald-400" />
                                    {badge}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // ============================================
    // VARIANT 2: ALINEADO IZQUIERDA ('gradient')
    // ============================================
    if (hero_variant === 'gradient') {
        return (
            <section id="inicio" className="relative min-h-screen w-full flex items-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0 bg-slate-950">
                    {bgImage && <img src={bgImage} className="w-full h-full object-cover" alt="Hero background" />}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-transparent md:bg-gradient-to-r" />
                    <div className="absolute inset-0 bg-slate-950/40 md:hidden" />
                </div>

                <div className={cn("relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-2 h-full flex items-center", headerSpacingClass, animationClass)}>
                    <div className="space-y-8 md:space-y-10">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 text-white w-fit">
                            <Plus size={12} style={{ color: accent_color }} />
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em]">{badgeText}</span>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <h1 className="text-4xl md:text-8xl font-black text-white leading-[1.05] tracking-tight">
                                {renderTitle(title)}
                            </h1>
                            <p className="text-base md:text-xl text-slate-300 leading-relaxed max-w-xl">
                                {subtitle}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                             <Button 
                                onClick={onBookClick}
                                className="h-14 md:h-16 px-8 md:px-10 rounded-2xl text-base md:text-lg font-black uppercase tracking-widest text-white shadow-xl transition-all w-full sm:w-auto"
                                style={{ backgroundColor: primary_color }}
                            >
                                {ctaText}
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-6 md:gap-8 pt-8 md:pt-10 border-t border-white/10">
                            {trustBadges.map((badge, i) => (
                                <div key={i} className="flex items-center gap-3 text-white/60">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">{badge}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // ============================================
    // VARIANT 4: ESTILO APPLE PRO ('apple')
    // ============================================
    if (hero_variant === 'apple') {
        return (
            <section id="inicio" className="relative min-h-screen w-full flex flex-col items-center justify-start pt-32 md:pt-40 overflow-hidden bg-white">
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes apple-slide-up {
                        0% { opacity: 0; transform: translateY(60px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    .animate-apple {
                        animation: apple-slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    }
                    .delay-100 { animation-delay: 0.1s; }
                    .delay-200 { animation-delay: 0.2s; }
                    .delay-300 { animation-delay: 0.3s; }
                `}} />

                <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
                    <div className="animate-apple opacity-0 mb-6 md:mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em]">
                        <Plus size={10} style={{ color: accent_color }} />
                        {badgeText}
                    </div>

                    <h1 className="animate-apple opacity-0 delay-100 text-4xl md:text-9xl font-black text-slate-900 leading-[1.1] md:leading-[0.95] tracking-tight mb-6 md:mb-8">
                        {renderTitle(title)}
                    </h1>

                    <p className="animate-apple opacity-0 delay-200 text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10 md:mb-12 font-medium">
                        {subtitle}
                    </p>

                    <div className="animate-apple opacity-0 delay-300 flex flex-col items-center gap-8 md:gap-12 w-full">
                        <Button 
                            onClick={onBookClick}
                            className="h-16 md:h-20 px-10 md:px-16 rounded-[1.5rem] md:rounded-[2.5rem] text-lg md:text-xl font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-2xl w-full md:w-auto"
                            style={{ backgroundColor: primary_color, boxShadow: `0 25px 50px -12px ${primary_color}40` }}
                        >
                            {ctaText}
                        </Button>
                        
                        <div className="w-full max-w-4xl rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 aspect-video relative group bg-slate-50">
                            {bgImage && <img src={bgImage} className="w-full h-full object-cover transition-transform  group-hover:scale-105" alt="Product preview" />}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-12 gap-y-4 md:gap-y-6 opacity-40">
                            {trustBadges.map((badge, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-900 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                                    <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                                    {badge}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // ============================================
    // VARIANT 5: SPLIT MODERN ('minimal')
    // ============================================
    if (hero_variant === 'minimal') {
        return (
            <section id="inicio" className="relative min-h-screen w-full flex items-center bg-slate-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className={cn("space-y-8", animationClass)}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                            <Plus size={10} style={{ color: primary_color }} />
                            {badgeText}
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[1.05] tracking-tighter">
                            {renderTitle(title)}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg">
                            {subtitle}
                        </p>
                        <Button 
                            onClick={onBookClick}
                            className="h-16 px-10 rounded-2xl text-lg font-bold text-white transition-all hover:shadow-xl"
                            style={{ backgroundColor: primary_color }}
                        >
                            {ctaText}
                        </Button>
                    </div>
                    <div className="relative h-[400px] lg:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
                        {bgImage && <img src={bgImage} className="w-full h-full object-cover" alt="Hero" />}
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/20 to-transparent" />
                    </div>
                </div>
            </section>
        )
    }

    // ============================================
    // VARIANT 3: TARJETA GLASSMORPISM ('glass')
    // ============================================
    return (
        <section id="inicio" className="relative min-h-screen w-full flex items-center justify-center lg:justify-start overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 bg-slate-950">
                {bgImage && <img src={bgImage} className="w-full h-full object-cover" alt="Hero background" />}
                <div className="absolute inset-0 bg-slate-950/40 lg:hidden" />
            </div>

            <div className={cn("relative z-10 max-w-7xl mx-auto px-6 lg:px-20 w-full h-full flex flex-col justify-center", headerSpacingClass, animationClass)}>
                <div className="max-w-2xl bg-white/10 backdrop-blur-2xl p-8 md:p-10 lg:p-16 rounded-[2rem] md:rounded-[3rem] border border-white/20 shadow-2xl space-y-8 md:space-y-10">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-white/20 flex items-center justify-center text-white">
                           <Shield className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">{badgeText}</p>
                            <p className="text-[8px] md:text-[9px] font-bold text-slate-300 uppercase tracking-tight">Atención Premium</p>
                        </div>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
                            {renderTitle(title)}
                        </h1>
                        <p className="text-base md:text-lg text-slate-200 leading-relaxed font-medium">
                            {subtitle}
                        </p>
                    </div>

                    <Button 
                        onClick={onBookClick}
                        className="h-14 md:h-16 px-8 md:px-10 rounded-2xl text-base md:text-lg font-black uppercase tracking-widest text-white transition-all w-full lg:w-auto"
                        style={{ backgroundColor: primary_color, boxShadow: `0 20px 40px ${primary_color}40` }}
                    >
                        {ctaText}
                    </Button>

                    <div className="flex items-center gap-4 md:gap-6 pt-4 md:pt-6 opacity-60">
                         {trustBadges.slice(0, 2).map((badge, i) => (
                             <div key={i} className="flex items-center gap-2 text-white">
                                 <div className="h-1 w-1 bg-white rounded-full" />
                                 <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tight">{badge}</span>
                             </div>
                         ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

