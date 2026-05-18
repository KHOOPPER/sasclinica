'use client'

import { useState, useRef } from 'react'
import { MapPin, Phone, Globe } from 'lucide-react'
import { BookingPortal } from './BookingPortal'
import { LandingHeader } from './LandingHeader'
import { LandingHero } from './LandingHero'
import { LandingServices } from './LandingServices'

export function PublicLayout({ clinicData }: { clinicData: any }) {
  const [showBooking, setShowBooking] = useState(false)
  const bookingRef = useRef<HTMLDivElement>(null)

  const handleBookClick = () => {
    setShowBooking(true)
    setTimeout(() => {
        bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-white selection:bg-[#003366] selection:text-white pb-20">
      <LandingHeader 
        clinicName={clinicData.clinic.name} 
        logoUrl={clinicData.logo_url} 
        onBookClick={handleBookClick} 
        primaryColor={clinicData.primary_color}
        logoHeight={clinicData.logo_height}
        logoWidth={clinicData.logo_width}
        logoOffsetY={clinicData.logo_offset_y}
      />
      
      <main>
        <LandingHero 
          clinicData={clinicData} 
          onBookClick={handleBookClick} 
        />
        
        {clinicData.show_services && (
            <LandingServices 
                services={clinicData.clinic.services} 
                primaryColor={clinicData.primary_color}
                title={clinicData.services_title}
                subtitle={clinicData.services_subtitle}
            />
        )}

        {/* BOOKING SECTION */}
        <section 
            id="agendar" 
            ref={bookingRef}
            className={`py-32 transition-all duration-1000 ${showBooking ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
        >
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center space-y-4 mb-20 text-[#003366]">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Proceso de Reserva</span>
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Agenda tu cita en <br /> menos de 2 minutos.</h2>
                </div>
                <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-hidden">
                    <BookingPortal clinicData={clinicData} />
                </div>
            </div>
        </section>

        {/* CONTACT & MAP PLACEHOLDER */}
        <section id="contacto" className="py-32 bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-[#003366]/5 skew-x-12 translate-x-20"></div>
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
                <div className="space-y-12">
                        <h2 className="text-5xl font-black text-white tracking-tighter italic">
                            {clinicData.contact_title || "Estamos ubicados en el corazón de la ciudad."}
                        </h2>
                        <p className="text-slate-400 font-medium text-lg max-w-xl">
                            {clinicData.contact_subtitle || "Disponibles las 24 horas para emergencias críticas y citas preventivas de lunes a sábado."}
                        </p>
                    <div className="space-y-8 text-slate-400 font-medium">
                        <div className="flex gap-6 items-start">
                            <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white shrink-0">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dirección</span>
                                <p className="text-xl text-white font-bold">{clinicData.contact_address || clinicData.clinic.address || "Colonia Escalón, San Salvador, El Salvador."}</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start">
                            <div className="h-14 w-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white shrink-0">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Teléfono</span>
                                <p className="text-xl text-white font-bold">{clinicData.contact_phone || clinicData.clinic.phone || "+503 2200-0000"}</p>
                            </div>
                        </div>
                        {clinicData.contact_whatsapp && (
                            <div className="flex gap-6 items-start">
                                <div className="h-14 w-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
                                    <span className="font-black text-[10px]">WA</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">WhatsApp</span>
                                    <p className="text-xl text-white font-bold">{clinicData.contact_whatsapp}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="relative group">
                    <div className="absolute inset-0 bg-[#003366] rounded-[3rem] rotate-3 group-hover:rotate-6 transition-transform opacity-20"></div>
                    <div className="relative bg-slate-800 h-[500px] rounded-[3rem] border border-slate-700 flex items-center justify-center overflow-hidden">
                        {clinicData.map_coordinates ? (
                            <iframe 
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                scrolling="no" 
                                marginHeight={0} 
                                marginWidth={0} 
                                src={`https://maps.google.com/maps?q=${clinicData.map_coordinates}&z=${clinicData.map_zoom || 15}&t=${clinicData.map_type === 'satellite' ? 'k' : clinicData.map_type === 'hybrid' ? 'h' : clinicData.map_type === 'terrain' ? 'p' : 'm'}&ie=UTF8&output=embed`}
                                className="opacity-90 grayscale-[20%] contrast-[110%]"
                            ></iframe>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="h-20 w-20 bg-white/10 rounded-full mx-auto animate-pulse flex items-center justify-center">
                                    <Globe className="h-10 w-10 text-white opacity-20" />
                                </div>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Mapa no configurado</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-12 bg-white text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
             <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs uppercase">
                    {clinicData.clinic.name[0]}
                </div>
                <span className="text-sm font-black tracking-widest uppercase text-slate-900">
                    {clinicData.clinic.name}
                </span>
            </div>
            
            <nav className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em]">
                <a href="#" className="hover:text-[#003366] transition-colors">Términos</a>
                <a href="#" className="hover:text-[#003366] transition-colors">Privacidad</a>
                <a href="#" className="hover:text-[#003366] transition-colors">Seguridad</a>
            </nav>

            <div className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-right">
                SISTEMA INTEGRADO DE SALUD <br />
                © {new Date().getFullYear()} - {clinicData.clinic.name}
            </div>
        </div>
      </footer>
    </div>
  )
}
