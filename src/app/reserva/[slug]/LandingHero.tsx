'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function LandingHero({ clinicData, onBookClick }: { clinicData: any, onBookClick: () => void }) {
    const { 
        hero_title, 
        hero_subtitle, 
        hero_image_url, 
        primary_color = '#003366',
        animation_style = 'slide',
        hero_layout = 'left',
        secondary_color = '#f8fafc',
        border_radius = 'rounded-2xl',
        trust_badges_color = '#94a3b8'
    } = clinicData

    const animations: Record<string, string> = {
        fade: 'animate-in fade-in duration-1000',
        slide: 'animate-in slide-in-from-left-12 duration-1000',
        zoom: 'animate-in zoom-in-90 duration-1000',
        bounce: 'animate-in slide-in-from-bottom-12 duration-1000'
    }
  
  return (
    <section id="inicio" className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-white">
        {hero_image_url && (
            <img 
              src={hero_image_url} 
              alt="Clinic Hero" 
              className="w-full h-full object-cover"
            />
        )}
        <div className={`absolute inset-0 transition-all duration-700 ${
            hero_layout === 'center' 
            ? 'bg-white/95 backdrop-blur-sm' 
            : hero_layout === 'split'
            ? 'bg-gradient-to-r from-white via-white/40 to-transparent'
            : hero_image_url 
                ? 'bg-gradient-to-r from-white via-white/80 to-transparent'
                : 'bg-white'
        }`}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className={`transition-all duration-1000 transform ${
            hero_layout === 'center' ? 'max-w-4xl mx-auto text-center items-center flex flex-col' : 
            hero_layout === 'split' ? 'grid grid-cols-1 md:grid-cols-2 gap-20 items-center' :
            'max-w-2xl text-left'
        } ${animations[animation_style] || animations.slide} space-y-8`}>
          
          <div className={`inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-1.5 ${border_radius}`} style={{ borderColor: `${primary_color}20` }}>
            <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: primary_color }}></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: primary_color }}>
                {clinicData.hero_badge || "Clínica Privada Élite"}
            </span>
          </div>

          <div className={`space-y-6 ${hero_layout === 'center' ? 'flex flex-col items-center' : ''}`}>
            <h1 className={`text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter ${clinicData.hero_title_italic ? 'italic' : ''}`}>
              {hero_title || "Atención médica privada de primer nivel."}
            </h1>
            <p className={`text-xl text-slate-500 font-medium leading-relaxed max-w-lg ${hero_layout === 'center' ? 'text-center' : ''} ${clinicData.hero_subtitle_italic ? 'italic' : ''}`}>
              {hero_subtitle || "Tu tiempo y tu salud son nuestra prioridad. Consultas el mismo día, sin tiempos de espera y con el mejor equipo médico."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <Button 
              onClick={onBookClick}
              size="lg"
              className={`text-white h-16 px-12 font-black text-lg gap-3 shadow-2xl transition-all group ${border_radius}`}
              style={{ backgroundColor: primary_color, boxShadow: `0 20px 40px -10px ${primary_color}40` }}
            >
              Agendar Consulta Ahora
              <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button 
                variant="outline" 
                size="lg"
                className={`h-16 px-12 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 ${border_radius}`}
            >
                Ver Servicios
            </Button>
          </div>
        </div>
      </div>

      {/* Trust Badges Dynamic */}
      <div className="absolute bottom-12 left-6 right-6 z-10 hidden lg:block">
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-12 font-black uppercase tracking-[0.3em] text-[10px]" style={{ color: trust_badges_color }}>
                {[
                    clinicData.trust_badge_1 || "SEGUROS MÉDICOS",
                    clinicData.trust_badge_2 || "ISO 9001:2015",
                    clinicData.trust_badge_3 || "CLÍNICA CERTIFICADA"
                ].map((badge, i) => (
                    <span key={i} className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: trust_badges_color }}></div> {badge}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </section>
  )
}
