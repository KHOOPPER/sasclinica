'use client'

import React from 'react'
import { MapPin, Phone, Mail, ArrowRight, Share, Globe, Star, ShieldCheck, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function LandingFooter({ 
  clinicData, 
  onBookClick 
}: { 
  clinicData: any, 
  onBookClick: () => void 
}) {
  const { 
    name, 
    address, 
    email, 
    phone, 
    schedule_weekdays, 
    schedule_weekends 
  } = clinicData.clinic || clinicData

  const footerVariant = clinicData.footer_variant || 'classic'
  const bgColor = clinicData.footer_bg || (clinicData.footer_variant === 'dark' ? '#0f172a' : '#f8fafc')
  const textColor = clinicData.footer_text_color || (clinicData.footer_variant === 'dark' ? '#94a3b8' : '#64748b')
  const headlineColor = clinicData.text_main || (clinicData.footer_variant === 'dark' ? '#ffffff' : '#0f172a')
  const primaryColor = clinicData.primary_color || '#2563eb'

  // ============================================
  // VARIANT: IMPACT BLOCK ('impact') - REDESIGNED PREMIUM
  // ============================================
  if (footerVariant === 'impact') {
    return (
      <footer className="w-full">
        <div className="relative overflow-hidden bg-slate-950 py-20 md:py-32 px-6 md:px-8">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent blur-3xl opacity-50" />
           <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-emerald-600/10 to-transparent blur-3xl opacity-30" />
           
           <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center space-y-8 md:space-y-12">
              <div className="space-y-4 md:space-y-6">
                 <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-emerald-400">Excelencia Médica</span>
                 </div>
                 <h2 className="text-4xl md:text-8xl font-black text-white leading-[1.05] tracking-tight max-w-4xl mx-auto italic">
                   Tu salud merece el <br className="hidden md:block"/>
                   <span style={{ color: primaryColor }}>mejor cuidado.</span>
                 </h2>
                 <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                   Agenda hoy mismo y descubre por qué somos la clínica líder en atención personalizada y tecnología de vanguardia.
                 </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                 <Button 
                   onClick={onBookClick}
                   className="h-16 md:h-20 w-full sm:w-auto px-8 md:px-12 rounded-full text-lg md:text-xl font-black uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
                   style={{ backgroundColor: primaryColor, boxShadow: `0 20px 40px ${primaryColor}40` }}
                 >
                   Agendar Consulta
                   <ArrowRight className="ml-3 md:ml-4 h-5 md:h-6 w-5 md:w-6" />
                 </Button>
                 
                 <div className="flex -space-x-2 md:-space-x-3">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                           <span className="text-[8px] md:text-[10px] font-black text-white">MD</span>
                        </div>
                    ))}
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-slate-900 bg-emerald-500 flex items-center justify-center">
                        <Heart size={14} className="text-white fill-white" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Sub-footer for Impact variant */}
        <div className="bg-slate-950 py-10 md:py-12 px-6 md:px-8 border-t border-white/5">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center text-center md:text-left">
                 <div className="space-y-1">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Ubicación</p>
                    <p className="text-xs md:text-sm font-bold text-slate-300">{address}</p>
                 </div>
                 <div className="w-px h-8 md:h-10 bg-white/5 hidden md:block" />
                 <div className="space-y-1">
                    <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Teléfono</p>
                    <p className="text-xs md:text-sm font-bold text-slate-300">{phone}</p>
                 </div>
              </div>

              <div className="flex gap-4">
                 {[Globe, Share].map((Icon, i) => (
                    <div key={i} className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors border border-white/5">
                       <Icon size={18} />
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="max-w-7xl mx-auto mt-10 md:mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
              <p>© {new Date().getFullYear()} {name}.</p>
              <nav className="flex gap-6 md:gap-8">
                 <a href="#" className="hover:text-slate-400">Privacidad</a>
                 <a href="#" className="hover:text-slate-400">Términos</a>
              </nav>
           </div>
        </div>
      </footer>
    )
  }

  // ============================================
  // VARIANT: DEEP DARK ('dark') - THEME MATCHING
  // ============================================
  if (footerVariant === 'dark') {
    return (
      <footer className="py-20 md:py-32 px-6 md:px-8 bg-slate-950 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-20 relative z-10 text-center md:text-left">
           <div className="space-y-6 md:space-y-8 max-w-sm mx-auto md:mx-0">
              <h4 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                 {clinicData.footer_info_title || name}
              </h4>
              <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed italic">
                 {clinicData.footer_info_desc || 'Redefiniendo la experiencia médica con tecnología y humanidad.'}
              </p>
           </div>

           <div className="flex flex-wrap justify-center md:justify-start gap-x-12 md:gap-x-20 gap-y-10">
              <div className="space-y-4 md:space-y-6 min-w-[120px]">
                 <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-blue-500">Navegación</span>
                 <ul className="space-y-3 md:space-y-4 text-xs font-bold text-slate-400">
                    <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
                    <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
                    <li><a href="#nosotros" className="hover:text-white transition-colors">Nosotros</a></li>
                 </ul>
              </div>
              <div className="space-y-4 md:space-y-6 min-w-[120px]">
                 <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-blue-500">Contacto</span>
                 <div className="space-y-2">
                    <p className="text-sm md:text-base font-bold text-white tracking-widest leading-none">{phone}</p>
                    <p className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase tracking-tighter max-w-[200px]">{address}</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 md:mt-24 pt-8 md:pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-slate-700 text-center md:text-left">
              © {new Date().getFullYear()} {name}. ALL RIGHTS RESERVED.
           </p>
           <button 
             onClick={onBookClick}
             className="w-full md:w-auto px-8 md:px-10 py-4 rounded-full bg-white text-slate-950 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
           >
              Agenda Ahora
           </button>
        </div>
      </footer>
    )
  }

  // ============================================
  // VARIANT: MINIMALIST ('minimal')
  // ============================================
  if (footerVariant === 'minimal') {
    return (
      <footer 
        className="py-16 md:py-24 px-6 md:px-8 text-center space-y-10 md:space-y-12"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex flex-col items-center gap-6 md:gap-8">
           {clinicData.logo_url ? (
             <img src={clinicData.logo_url} alt={name} className="h-8 md:h-10 w-auto opacity-80" />
           ) : (
             <span className="text-xl md:text-2xl font-black italic tracking-tighter uppercase" style={{ color: headlineColor }}>{name}</span>
           )}
           
           <div className="flex gap-8 md:gap-10">
              {[Star, Globe].map((Icon, i) => (
                <a key={i} href="#" className="hover:scale-125 transition-transform" style={{ color: textColor }}>
                   <Icon size={24} />
                </a>
              ))}
           </div>
        </div>

         <nav className="flex flex-wrap justify-center gap-x-8 md:gap-x-12 gap-y-4 pt-8 md:pt-10 border-t border-slate-200/20 max-w-4xl mx-auto">
           {[
             { label: clinicData.footer_nav_1_label || 'Inicio', href: '#inicio' },
             { label: clinicData.footer_nav_2_label || 'Servicios', href: '#servicios' },
             { label: clinicData.footer_nav_3_label || 'Nosotros', href: '#nosotros' },
             { label: clinicData.footer_nav_4_label || 'Contacto', href: '#contacto' },
             { label: clinicData.footer_nav_5_label || 'Reserva', href: '#', onClick: (e: any) => { e.preventDefault(); onBookClick(); } }
           ].map((link, i) => (
             <a 
               key={i} 
               href={link.href} 
               onClick={link.onClick}
               className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:opacity-100 transition-opacity whitespace-nowrap" 
               style={{ color: textColor }}
             >
               {link.label}
             </a>
           ))}
         </nav>

        <p className="text-[9px] md:text-[10px] uppercase font-black tracking-[0.3em] md:tracking-[0.4em] opacity-40 pt-8 md:pt-10" style={{ color: textColor }}>
          {clinicData.footer_text || `© ${new Date().getFullYear()} • ${name} • Precision Medicine`}
        </p>
      </footer>
    )
  }

  // ============================================
  // VARIANT: CLASSIC ('classic') - DEFAULT
  // ============================================
  return (
    <footer 
      className="pt-16 md:pt-24 pb-10 md:pb-12 px-6 md:px-8 border-t border-slate-100"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-20">
        {/* Info Area */}
        {(clinicData.footer_show_info !== false) && (
          <div className="space-y-6 md:space-y-8 text-center sm:text-left">
             <h4 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter" style={{ color: headlineColor }}>
                {clinicData.footer_info_title || name}
             </h4>
             <p className="text-xs md:text-sm leading-relaxed" style={{ color: textColor }}>
                {clinicData.footer_info_desc || 'Ofreciendo servicios de salud de alta calidad con un enfoque humano y tecnológico. Comprometidos con tu bienestar integral.'}
             </p>
             <div className="flex justify-center sm:justify-start gap-3 md:gap-4">
                {[Star, Globe].map((Icon, i) => (
                  <div key={i} className="h-10 w-10 md:h-11 md:w-11 rounded-xl md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center cursor-pointer hover:border-slate-300 hover:shadow-md transition-all">
                     <Icon size={20} style={{ color: primaryColor }} />
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Links */}
        {(clinicData.footer_show_nav !== false) && (
          <div className="space-y-6 md:space-y-8 text-center sm:text-left">
             <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]" style={{ color: headlineColor }}>{clinicData.footer_nav_title || 'Navegación'}</h5>
             <ul className="space-y-4 md:space-y-5">
                {[
                  { label: clinicData.footer_nav_1_label || 'Inicio', href: '#inicio' },
                  { label: clinicData.footer_nav_2_label || 'Nuestro Equipo', href: '#nosotros' },
                  { label: clinicData.footer_nav_3_label || 'Servicios', href: '#servicios' },
                  { label: clinicData.footer_nav_4_label || 'Blog', href: '#servicios' },
                  { label: clinicData.footer_nav_5_label || 'Preguntas Frecuentes', href: '#contacto' }
                ].map((l, i) => (
                  <li key={i}>
                    <a 
                      href={l.href} 
                      className="text-xs md:text-sm hover:translate-x-2 transition-transform inline-block group" 
                      style={{ color: textColor }}
                    >
                       <span className="flex items-center justify-center sm:justify-start gap-2 group-hover:text-slate-900 transition-colors">
                          {l.label}
                       </span>
                    </a>
                  </li>
                ))}
             </ul>
          </div>
        )}

        {/* Schedule */}
        {(clinicData.footer_show_schedule !== false) && (
          <div className="space-y-6 md:space-y-8 text-center sm:text-left">
             <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]" style={{ color: headlineColor }}>{clinicData.footer_schedule_title || 'Horarios'}</h5>
             <ul className="space-y-4 md:space-y-6 text-xs md:text-sm" style={{ color: textColor }}>
                <li className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                   <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-60 mb-2" style={{ color: headlineColor }}>{clinicData.footer_schedule_weekdays_label || 'Lunes a Viernes'}</p>
                   <p className="font-bold text-slate-800">{schedule_weekdays || '08:00 AM - 18:00 PM'}</p>
                </li>
                <li className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                   <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest opacity-60 mb-2" style={{ color: headlineColor }}>{clinicData.footer_schedule_weekends_label || 'Sábados'}</p>
                   <p className="font-bold text-slate-800">{schedule_weekends || '08:00 AM - 12:00 PM'}</p>
                </li>
             </ul>
          </div>
        )}

        {/* Contact Strip */}
        {(clinicData.footer_show_contact !== false) && (
          <div className="space-y-6 md:space-y-8 text-center sm:text-left">
             <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]" style={{ color: headlineColor }}>{clinicData.footer_contact_title || 'Ubicación & Citas'}</h5>
             <div className="space-y-4 md:space-y-6">
                {(clinicData.footer_address_label || address) && (
                  <div className="flex items-center justify-center sm:justify-start gap-3 md:gap-4">
                     <div 
                       className="h-9 w-9 md:h-10 md:w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors" 
                       style={{ 
                         backgroundColor: `${primaryColor}10`,
                         color: primaryColor 
                       }}
                     >
                        <MapPin size={18} />
                     </div>
                     <span className="text-xs md:text-sm leading-relaxed max-w-[200px]" style={{ color: textColor }}>{clinicData.footer_address_label || address}</span>
                  </div>
                )}
                {(clinicData.footer_phone_label || phone) && (
                  <div className="flex items-center justify-center sm:justify-start gap-3 md:gap-4">
                     <div 
                       className="h-9 w-9 md:h-10 md:w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors" 
                       style={{ 
                         backgroundColor: `${primaryColor}10`,
                         color: primaryColor 
                       }}
                     >
                        <Phone size={18} />
                     </div>
                     <span className="text-xs md:text-sm font-bold" style={{ color: textColor }}>{clinicData.footer_phone_label || phone}</span>
                  </div>
                )}
                <div className="pt-4">
                   <Button 
                     onClick={onBookClick}
                     className="w-full rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] h-14 shadow-lg hover:-translate-y-1 transition-all"
                     style={{ backgroundColor: primaryColor, boxShadow: `0 10px 20px ${primaryColor}30` }}
                   >
                      {clinicData.footer_cta_text || 'Agendar Cita'}
                   </Button>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto pt-8 md:pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
         <p className="text-[8px] md:text-[9px] uppercase font-black tracking-[0.2em] md:tracking-[0.3em] opacity-50 text-center md:text-left" style={{ color: textColor }}>
           {clinicData.footer_text || `© ${new Date().getFullYear()} ${name}. Clinical Excellence.`}
         </p>
         <div className="flex gap-6 md:gap-10 text-[8px] md:text-[9px] uppercase font-black tracking-[0.2em] md:tracking-[0.3em] opacity-50">
            <a href="#" className="hover:opacity-100 transition-opacity" style={{ color: textColor }}>Privacidad</a>
            <a href="#" className="hover:opacity-100 transition-opacity" style={{ color: textColor }}>Términos</a>
         </div>
      </div>
    </footer>
  )
}
