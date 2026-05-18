'use client'

import { useState } from 'react'
import { Clock, Stethoscope, Activity, Heart, Shield, FlaskConical } from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  general: Stethoscope,
  pediatria: Heart,
  diagnostico: Activity,
  laboratorio: FlaskConical,
  default: Shield
}

export function LandingServices({ 
    services, 
    primaryColor = '#0059bb', 
    title, 
    subtitle,
    servicesLayout = 'grid',
    clinicData
}: { 
    services: any[], 
    primaryColor?: string, 
    title?: string, 
    subtitle?: string,
    servicesLayout?: string,
    clinicData?: any
}) {
  const publishedServices = services.filter(s => s.is_active !== false)
  const [activeCategory, setActiveCategory] = useState("Todos")

  if (publishedServices.length === 0) return null

  // Extract unique categories safely
  const uniqueCategories = Array.from(new Set(publishedServices.map(s => s.category || s.category_name || "Consultas")))
  const categories = ["Todos", ...uniqueCategories]

  const filteredServices = activeCategory === "Todos" 
    ? publishedServices 
    : publishedServices.filter(s => (s.category || s.category_name || "Consultas") === activeCategory)

  // THEME CONFIGURATION
  const isMinimal = servicesLayout === 'minimal'
  const isEliteDark = servicesLayout === 'elite-dark'
  const isWarm = servicesLayout === 'warm'

  // ============================================
  // ESTILO ELITE PREMIUM (DARK) - Matching user request
  // ============================================
  if (isEliteDark) {
    return (
      <section id="servicios" className="py-20 md:py-40 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4 md:space-y-6 mb-16 md:mb-24">
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-blue-600 block" style={{ color: primaryColor }}>
              {title || "Nuestros Servicios"}
            </span>
            <h2 className="text-4xl md:text-8xl font-black tracking-tighter text-white italic leading-tight">
              {subtitle || "Cuidado integral para todas las edades."}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {publishedServices.map((service, index) => {
              const Icon = ICON_MAP[service.name.toLowerCase()] || ICON_MAP.default
              return (
                <div 
                  key={service.id} 
                  className="group relative h-[320px] md:h-[500px] bg-[#0c1222] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl transition-all  hover:scale-[1.01]"
                >
                  {/* Background Image with Overlay */}
                  {service.image_url ? (
                    <>
                      <img 
                        src={service.image_url} 
                        alt={service.name} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform  group-hover:scale-110 opacity-40 group-hover:opacity-60" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1222]/80 via-[#0c1222]/40 to-[#0c1222]"></div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_30%,#3b82f6_0%,transparent_70%)] group-hover:opacity-20 transition-opacity " />
                      <div className="absolute -top-10 -left-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity  rotate-12">
                        <Icon className="h-40 md:h-80 w-40 md:w-80 text-white" />
                      </div>
                    </>
                  )}

                  {/* Main Content */}
                  <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-start z-10">
                    {/* Small Icon/Category */}
                    <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
                       <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-slate-950 transition-all  scale-90 group-hover:scale-100">
                          <Icon className="w-4 h-4 md:w-6 md:h-6" />
                       </div>
                       <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-500 group-hover:text-blue-400 transition-colors">
                         Atención Clínica
                       </span>
                    </div>

                    <div className="space-y-4 md:space-y-6 max-w-lg">
                      <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-[0.9] uppercase italic group-hover:translate-x-2 transition-transform ">
                        {service.name}
                      </h3>
                      <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed italic opacity-60 group-hover:opacity-100 transition-opacity line-clamp-3 md:line-clamp-none">
                        {service.description || "Atención especializada con los más altos estándares de calidad."}
                      </p>
                    </div>

                    {/* Bottom Info: Price and Duration */}
                    <div className="mt-auto pt-6 md:pt-10 border-t border-white/5 flex items-end justify-between">
                       <div className="space-y-1">
                         <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 block">Duración</span>
                         <div className="flex items-center gap-2 text-white/80 font-bold text-xs md:text-base">
                           <Clock className="h-3 md:h-4 w-3 md:w-4 text-blue-500" />
                           <span>{service.duration_minutes} MIN</span>
                         </div>
                       </div>

                       <div className="text-right">
                         <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Inversión</span>
                         <span className="text-4xl md:text-7xl font-black text-white italic tracking-tighter leading-none block group-hover:text-blue-500 transition-all ">
                           ${service.price}
                         </span>
                       </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Insurance Strip */}
          {clinicData?.insurance_text && (
             <div id="aseguradoras" className="mt-20 md:mt-32 pt-10 md:pt-16 border-t border-white/5 text-center max-w-4xl mx-auto space-y-4 md:space-y-6">
                 <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-slate-500">Aseguradoras Aliadas</h4>
                 <p className="text-xl md:text-2xl text-white font-medium italic opacity-60">
                   {clinicData.insurance_text}
                 </p>
             </div>
          )}
        </div>
      </section>
    )
  }

  // ============================================
  // ESTILO MINIMALISTA (Stitch Replica)
  // ============================================
  if (isMinimal) {
    return (
      <section id="servicios" className="py-16 md:py-24 px-6 md:px-8 bg-[#f9f9ff]">
        <div className="max-w-screen-2xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="font-bold tracking-[0.2em] text-[10px] md:text-xs uppercase mb-3 md:mb-4 block" style={{ color: primaryColor }}>
              {title || "NUESTROS SERVICIOS"}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {subtitle || "Cuidado integral para todas las edades."}
            </h2>
          </div>

          {/* Category Pills */}
          {categories.length > 2 && (
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 md:mb-16 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                      isActive 
                        ? 'text-white shadow-lg' 
                        : 'bg-white border text-slate-500 hover:text-slate-900 shadow-sm'
                    }`}
                    style={{ 
                      backgroundColor: isActive ? primaryColor : undefined,
                      borderColor: isActive ? primaryColor : 'var(--tw-colors-slate-200)',
                      boxShadow: isActive ? `0 10px 20px -5px ${primaryColor}40` : ''
                    }}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          )}

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredServices.map((service, index) => {
              const Icon = ICON_MAP[service.name.toLowerCase()] || ICON_MAP.default
              return (
                <div 
                  key={service.id}
                  className="group bg-white p-8 md:p-10 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 text-center flex flex-col items-center border border-slate-100"
                >
                  <div 
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-5 md:mb-6 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    <Icon className="h-8 w-8 md:h-10 md:w-10" style={{ color: primaryColor }} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3">{service.name}</h3>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6">
                    {service.description || "Atención especializada dedicada a la prevención y diagnóstico."}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between w-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 md:h-4 md:w-4" /> {service.duration_minutes} MIN</span>
                    <span className="font-black text-lg md:text-xl text-slate-900">${service.price}</span>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Insurance Strip */}
          {clinicData?.insurance_text && (
             <div id="aseguradoras" className="mt-16 md:mt-20 pt-8 md:pt-10 border-t border-slate-200/50 text-center max-w-3xl mx-auto space-y-3 md:space-y-4">
                 <h4 className="font-bold text-slate-900 text-sm md:text-base">Aseguradoras Aliadas</h4>
                 <p className="text-slate-500 font-medium text-xs md:text-sm">{clinicData.insurance_text}</p>
             </div>
          )}
        </div>
      </section>
    )
  }

  // ============================================
  // ESTILOS ANTERIORES (Grid / Warm)
  // ============================================
  const sectionBg = isWarm ? 'bg-[#fafafa]' : 'bg-slate-50/50'
  const cardBg = isWarm ? 'bg-white shadow-xl shadow-rose-900/5 ring-1 ring-slate-100' : 'bg-slate-900'
  const cardSubText = isWarm ? 'text-slate-500 group-hover:text-slate-900' : 'text-slate-300 drop-shadow-sm group-hover:text-white'
  const overlayGradient = isWarm ? 'bg-gradient-to-t from-white via-white/80 to-transparent' : 'bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent'
  const overlayTextColor = isWarm ? 'text-slate-900' : 'text-white'
  const iconColor = isWarm ? primaryColor : 'white'

  return (
    <section id="servicios" className={`py-20 md:py-32 ${sectionBg}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16 md:mb-20">
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>
            {title || "Nuestros Servicios"}
          </span>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tighter leading-tight ${isWarm ? 'text-slate-800' : 'text-slate-900'}`}>
            {subtitle || "Cuidado integral para todas las edades."}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {publishedServices.map((service, index) => {
            const Icon = ICON_MAP[service.name.toLowerCase()] || ICON_MAP.default
            return (
              <div 
                key={service.id} 
                className={`relative overflow-hidden group min-h-[400px] md:min-h-[480px] rounded-[2.5rem] md:rounded-[3rem] transition-all hover:scale-[1.02]  ${cardBg}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Image */}
                {service.image_url ? (
                  <>
                    <img 
                      src={service.image_url} 
                      alt={service.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform  group-hover:scale-110 opacity-60 group-hover:opacity-100" 
                    />
                    <div className={`absolute inset-0 ${overlayGradient}`}></div>
                  </>
                ) : (
                  <div className={`absolute inset-0 flex items-center justify-center ${isWarm ? 'opacity-10' : 'opacity-20'}`} style={{ backgroundColor: primaryColor }}>
                    <Icon className="h-32 md:h-40 w-32 md:w-40" style={{ color: iconColor }} />
                  </div>
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end space-y-4">
                  <div className="space-y-4 text-left z-10 relative">
                    <h3 className={`text-2xl md:text-3xl font-black uppercase tracking-tight leading-none ${overlayTextColor}`}>{service.name}</h3>
                    
                    <p className={`font-medium leading-relaxed line-clamp-3 text-xs md:text-sm transition-colors ${cardSubText}`}>
                      {service.description || "Atención especializada con los más altos estándares de calidad."}
                    </p>

                    <div className={`pt-4 md:pt-6 border-t flex items-center justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest ${isWarm ? 'border-slate-100 text-slate-400' : 'border-white/10 text-white/60'}`}>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 md:h-4 md:w-4" /> {service.duration_minutes} MIN</span>
                      <span className={`font-black text-2xl md:text-3xl ${isWarm ? 'text-slate-900' : 'text-white'}`}>${service.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Insurance Strip (Dark/Warm theme) */}
        {clinicData?.insurance_text && (
             <div id="aseguradoras" className={`mt-16 md:mt-20 pt-8 md:pt-10 border-t text-center max-w-3xl mx-auto space-y-3 md:space-y-4 ${isWarm ? 'border-slate-200 text-slate-900' : 'border-slate-800 text-white'}`}>
                 <h4 className="font-bold text-sm md:text-base">Aseguradoras Aliadas</h4>
                 <p className={isWarm ? 'text-slate-500 font-medium text-xs md:text-sm' : 'text-slate-400 font-medium text-xs md:text-sm'}>{clinicData.insurance_text}</p>
             </div>
        )}
      </div>
    </section>
  )
}
