'use client'

import React from 'react'
import { MapPin, Phone, Globe, Mail, MessageCircle, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
// Animaciones removidas

export function LandingContact({ clinicData, onBookClick }: { clinicData: any, onBookClick?: () => void }) {
  const layout = clinicData.contact_layout || 'split'
  const mapStyle = clinicData.map_style || 'standard'
  const primaryColor = clinicData.primary_color || '#2563eb'
  const radius = clinicData.border_radius === 'rounded-none' ? 'rounded-none' : clinicData.border_radius === 'rounded-2xl' ? 'rounded-2xl' : 'rounded-[3rem]'
  
  const customBg = clinicData.contact_bg_color
  const customText = clinicData.contact_text_color

  // MAP STYLING
  let mapFilter = ''
  if (mapStyle === 'silver') mapFilter = 'grayscale-[50%] brightness-[105%] sepia-[20%]'
  if (mapStyle === 'dark') mapFilter = 'invert-[90%] hue-rotate-180 brightness-75 contrast-125'
  if (mapStyle === 'night') mapFilter = 'invert-[100%] hue-rotate-180 brightness-75 contrast-150 grayscale-[100%]'
  if (mapStyle === 'retro') mapFilter = 'sepia-[40%] hue-rotate-[-10deg] saturate-[140%] brightness-[90%]'
  if (mapStyle === 'aubergine') mapFilter = 'hue-rotate-[240deg] saturate-[50%] brightness-[70%] contrast-[120%]'
  if (mapStyle === 'minimal') mapFilter = 'grayscale-[100%] brightness-[110%] contrast-[90%]'
  
  const MapElement = (
    <div className="w-full h-full relative group">
      {clinicData.map_link ? (
          <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src={clinicData.map_link.includes('output=embed') ? clinicData.map_link : `${clinicData.map_link}&output=embed`}
              className={`w-full h-full object-cover transition-all  ${mapFilter}`}
          ></iframe>
      ) : clinicData.map_coordinates ? (
          <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src={`https://maps.google.com/maps?q=${clinicData.map_coordinates}&z=${clinicData.map_zoom || 15}&t=${clinicData.map_type === 'satellite' ? 'k' : clinicData.map_type === 'hybrid' ? 'h' : clinicData.map_type === 'terrain' ? 'p' : 'm'}&ie=UTF8&output=embed`}
              className={`w-full h-full object-cover transition-all  ${mapFilter}`}
          ></iframe>
      ) : (
          <div className="absolute inset-0 flex items-center justify-center flex-col space-y-4 bg-slate-50">
              <div className="h-24 w-24 rounded-full flex items-center justify-center " style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}><Globe className="h-12 w-12" /></div>
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 block">Ubicación</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">Pendiente de Configuración</span>
              </div>
          </div>
      )}
      <a 
        href={clinicData.map_link || `https://www.google.com/maps/search/?api=1&query=${clinicData.contact_address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl border border-white/20 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-900 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0"
      >
        Abrir en Maps <ArrowRight size={14} />
      </a>
    </div>
  )

  const InfoBlock = (
    <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10",
        layout === 'centered' ? 'max-w-4xl mx-auto' : ''
    )}>
        <ContactItem 
          icon={MapPin} 
          label="Dirección" 
          value={clinicData.contact_address || clinicData.clinic?.address || "Avenida Principal"} 
          theme={customText ? 'custom' : (layout === 'split' ? 'dark' : 'light')}
          primaryColor={primaryColor}
          customText={customText}
        />
        <ContactItem 
          icon={Phone} 
          label="Teléfono" 
          value={clinicData.contact_phone || clinicData.clinic?.phone || "+503 2200-0000"} 
          theme={customText ? 'custom' : (layout === 'split' ? 'dark' : 'light')}
          primaryColor={primaryColor}
          customText={customText}
        />
        {clinicData.contact_whatsapp && (
            <ContactItem 
              icon={MessageCircle} 
              label="WhatsApp" 
              value={clinicData.contact_whatsapp} 
              theme={customText ? 'custom' : (layout === 'split' ? 'dark' : 'light')}
              primaryColor="#10b981"
              customText={customText}
            />
        )}
        {clinicData.contact_email && (
            <ContactItem 
              icon={Mail} 
              label="Email" 
              value={clinicData.contact_email} 
              theme={customText ? 'custom' : (layout === 'split' ? 'dark' : 'light')}
              primaryColor={primaryColor}
              customText={customText}
            />
        )}
    </div>
  )

  const ScheduleBlock = (
      <div className={cn(
          "mt-16 space-y-8 pt-16 border-t",
          layout === 'split' ? 'border-white/10' : 'border-slate-100',
          layout === 'centered' ? 'w-full max-w-2xl mx-auto' : ''
      )} style={{ borderColor: customText ? `${customText}20` : undefined }}>
          <div className="flex items-center gap-4">
              <div className="h-4 w-4 rounded-full flex items-center justify-center bg-emerald-500/10">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 " />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500" style={{ color: customText ? `${customText}60` : undefined }}>Horarios de Atención</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div className="space-y-2 group">
                  <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest block transition-colors",
                      layout === 'split' ? "text-slate-500 group-hover:text-white" : "text-slate-400 group-hover:text-slate-900"
                  )} style={{ color: customText ? `${customText}50` : undefined }}>Lunes a Viernes</span>
                  <span className={cn(
                      "text-xl font-bold block",
                      layout === 'split' ? "text-white" : "text-slate-900"
                  )} style={{ color: customText || undefined }}>{clinicData.schedule_weekdays || '8:00 AM - 6:00 PM'}</span>
              </div>
              <div className="space-y-2 group">
                  <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest block transition-colors",
                      layout === 'split' ? "text-slate-500 group-hover:text-white" : "text-slate-400 group-hover:text-slate-900"
                  )} style={{ color: customText ? `${customText}50` : undefined }}>Fines de Semana</span>
                  <span className={cn(
                      "text-xl font-bold block",
                      layout === 'split' ? "text-white" : "text-slate-900"
                  )} style={{ color: customText || undefined }}>{clinicData.schedule_weekends || '8:00 AM - 12:00 PM'}</span>
              </div>
          </div>
          {onBookClick && (
            <Button 
              onClick={onBookClick}
              className="w-full mt-10 h-18 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
              style={{ backgroundColor: primaryColor, boxShadow: `0 25px 50px -12px ${primaryColor}40` }}
            >
              Agenda tu consulta hoy
            </Button>
          )}
      </div>
  )

  if (layout === 'fullmap') {
      return (
          <section id="contacto" className="relative min-h-[800px] md:h-[1000px] w-full bg-slate-100 overflow-hidden flex items-center" style={{ backgroundColor: customBg || undefined }}>
              <div className="absolute inset-0 z-0 h-1/2 md:h-full">
                  {MapElement}
              </div>
              <div className={cn(
                  "absolute inset-y-0 left-0 w-full md:w-1/2 z-10",
                  customBg ? "" : "bg-gradient-to-b md:bg-gradient-to-r from-white/95 via-white/80 to-transparent"
              )} style={{ backgroundImage: customBg ? `linear-gradient(to bottom, ${customBg}, ${customBg}CC, transparent)` : undefined }}></div>
              
              <div className="max-w-7xl mx-auto w-full px-6 relative z-20 pt-[400px] md:pt-0">
                  <div className={`bg-white/90 backdrop-blur-3xl p-8 md:p-20 max-w-2xl border border-white/50 shadow-2xl ${radius}`} style={{ backgroundColor: customBg ? `${customBg}E6` : undefined, borderColor: customText ? `${customText}20` : undefined }}>
                      <div className="space-y-6 md:space-y-8 mb-12 md:mb-16">
                          <div className="h-1 w-12 bg-blue-600 rounded-full" style={{ backgroundColor: primaryColor }} />
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-blue-600 block" style={{ color: primaryColor }}>Ubicación y Contacto</span>
                          <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] text-slate-900 italic" style={{ color: customText || undefined }}>
                             {clinicData.contact_title || "Nuestra Clínica"}
                          </h2>
                          <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed italic max-w-lg" style={{ color: customText ? `${customText}80` : undefined }}>
                             {clinicData.contact_subtitle || "Vanguardia médica a tu servicio."}
                          </p>
                      </div>
                      <div className="space-y-12 md:space-y-20">
                          {InfoBlock}
                          {ScheduleBlock}
                      </div>
                  </div>
              </div>
          </section>
      )
  }

  if (layout === 'centered') {
      return (
          <section id="contacto" className="py-20 md:py-40 bg-white relative overflow-hidden" style={{ backgroundColor: customBg || undefined }}>
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] md:h-[800px] bg-blue-500/[0.04] blur-[100px] md:blur-[180px] -z-10" />
               
               <div className="max-w-7xl mx-auto px-6 space-y-16 md:space-y-24">
                  <div className="text-center space-y-6 md:space-y-8 max-w-4xl mx-auto">
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-blue-600" style={{ color: primaryColor }}>Presencia Nacional</span>
                      <h2 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.8] text-slate-900 italic" style={{ color: customText || undefined }}>
                          {clinicData.contact_title || "Sede Central"}
                      </h2>
                      <p className="text-lg md:text-2xl text-slate-400 font-medium leading-relaxed italic max-w-2xl mx-auto" style={{ color: customText ? `${customText}60` : undefined }}>
                          {clinicData.contact_subtitle || "Estamos aquí para cuidar de ti con la mejor tecnología."}
                      </p>
                  </div>
                  
                  <div className={`w-full h-[350px] md:h-[700px] bg-slate-100 overflow-hidden shadow-2xl ${radius} relative group border border-slate-100/50`}>
                      {MapElement}
                  </div>

                  <div className="space-y-16 md:space-y-24">
                      {InfoBlock}
                      {ScheduleBlock}
                  </div>
               </div>
          </section>
      )
  }

  // DEFAULT 'split'
  return (
      <section id="contacto" className="py-20 md:py-40 bg-slate-950 text-white relative overflow-hidden group" style={{ backgroundColor: customBg || undefined }}>
          <div className="absolute top-0 right-0 w-full h-full bg-blue-600/[0.02] blur-[100px] md:blur-[150px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 relative z-10 items-center">
              <div className="space-y-12 md:space-y-20">
                   <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                      <div className="h-1 w-12 bg-blue-500 rounded-full mx-auto lg:ml-0" style={{ backgroundColor: primaryColor }} />
                      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-blue-500 block" style={{ color: primaryColor }}>Canales de Atención</span>
                      <h2 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.8] italic" style={{ color: customText || undefined }}>
                          {clinicData.contact_title || "Contacto"}
                      </h2>
                      <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed italic lg:pr-12 opacity-80" style={{ color: customText ? `${customText}80` : undefined }}>
                          {clinicData.contact_subtitle || "Nuestro equipo especializado responderá todas tus preguntas."}
                      </p>
                  </div>
                  
                  <div className="space-y-16 md:space-y-24">
                    {InfoBlock}
                    {ScheduleBlock}
                  </div>
              </div>
              
              <div className={`relative h-[400px] md:h-[850px] overflow-hidden shadow-2xl ${radius} border-[8px] md:border-[16px] border-white/[0.03] transition-all  group-hover:border-white/[0.05]`}>
                  {MapElement}
              </div>
          </div>
      </section>
  )
}

function ContactItem({ icon: Icon, label, value, theme, primaryColor, customText }: any) {
  return (
    <div className="flex gap-6 group/item">
      <div 
        className={cn(
          "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all  group-hover/item:scale-110 group-hover/item:rotate-[-5deg]",
          theme === 'dark' ? "bg-white/5 border border-white/10 text-white group-hover/item:bg-white group-hover/item:text-slate-950" : "bg-slate-100 text-slate-900 border border-slate-200 group-hover/item:bg-slate-900 group-hover/item:text-white",
          theme === 'custom' && "border"
        )}
        style={{ 
            backgroundColor: theme === 'custom' ? `${customText}10` : undefined,
            color: theme === 'custom' ? customText : undefined,
            borderColor: theme === 'custom' ? `${customText}20` : undefined
        }}
      >
        <Icon size={24} />
      </div>
      <div className="space-y-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block" style={{ color: customText ? `${customText}60` : undefined }}>{label}</span>
        <p className={cn(
          "text-xl font-bold transition-colors leading-tight",
          theme === 'dark' ? "text-white" : "text-slate-900"
        )} style={{ color: customText || undefined }}>
          {value}
        </p>
      </div>
    </div>
  )
}
