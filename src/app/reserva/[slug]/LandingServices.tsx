'use client'

import { Clock, Stethoscope, Activity, Heart, Shield, FlaskConical } from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  general: Stethoscope,
  pediatria: Heart,
  diagnostico: Activity,
  laboratorio: FlaskConical,
  default: Shield
}

export function LandingServices({ services, primaryColor = '#003366', title, subtitle }: { services: any[], primaryColor?: string, title?: string, subtitle?: string }) {
  const publishedServices = services.filter(s => s.is_active !== false)
  if (publishedServices.length === 0) return null

  return (
    <section id="servicios" className="py-32 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>
            {title || "Nuestros Servicios"}
          </span>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
            {subtitle || "Cuidado integral para todas las edades."}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedServices.map((service, index) => {
            const Icon = ICON_MAP[service.name.toLowerCase()] || ICON_MAP.default
            return (
              <div 
                key={service.id} 
                className="relative overflow-hidden group min-h-[480px] rounded-[3rem] shadow-2xl transition-all hover:scale-[1.02] duration-500 bg-slate-900"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Image */}
                {service.image_url ? (
                  <>
                    <img 
                      src={service.image_url} 
                      alt={service.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-20" style={{ backgroundColor: primaryColor }}>
                    <Icon className="h-32 w-32 text-white" />
                  </div>
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end space-y-4">
                  <div className="space-y-4 text-left">
                    <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-none drop-shadow-md">{service.name}</h3>
                    
                    <p className="text-slate-300 font-medium leading-relaxed line-clamp-3 text-sm drop-shadow-sm group-hover:text-white transition-colors">
                      {service.description || "Atención especializada con los más altos estándares de calidad y tecnología de punta."}
                    </p>

                    <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-black text-white/60 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {service.duration_minutes} MIN</span>
                      <span className="text-white font-black text-3xl drop-shadow-lg">${service.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
