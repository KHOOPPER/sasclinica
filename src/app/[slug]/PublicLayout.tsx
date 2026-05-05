'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Phone, Globe, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookingPortal } from './BookingPortal'
import { LandingHeader } from './LandingHeader'
import { LandingHero } from './LandingHero'
import { LandingServices } from './LandingServices'
import { LandingContact } from './LandingContact'
import { LandingAbout } from './LandingAbout'
import { LandingSpecialties } from './LandingSpecialties'
import { LandingTestimonials } from './LandingTestimonials'
import { LandingPromotions } from './LandingPromotions'
import { LandingFooter } from './LandingFooter'

export function PublicLayout({ clinicData }: { clinicData: any }) {
  const [showBooking, setShowBooking] = useState(false)
  const bookingRef = useRef<HTMLDivElement>(null)

  // Auto scroll to top on load/reload
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }, [])

  const handleBookClick = () => {
    setShowBooking(true)
  }

  const headlineWeight = clinicData.font_headline_weight || 800
  const bodyWeight = clinicData.font_body_weight || 400
  const entryAnim = clinicData.entry_animation || 'fade-up'
  const animDuration = clinicData.animation_duration || 800

  return (
    <div 
      className="min-h-screen bg-white selection:bg-[#003366] selection:text-white pb-20 overflow-x-hidden"
      style={{ 
        '--headline-weight': headlineWeight,
        '--body-weight': bodyWeight,
        '--entry-duration': `${animDuration}ms`
      } as React.CSSProperties}
    >
      <style jsx global>{`
        h1, h2, h3, h4, .font-headline {
          font-weight: var(--headline-weight) !important;
        }
        p, span, .font-body {
          font-weight: var(--body-weight) !important;
        }
        .animate-entry {
          animation: ${entryAnim} var(--entry-duration) cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoom-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
      
      {/* SECCIONES DINÁMICAS (Ordenadas por activación) */}
      {(clinicData.active_sections || ['header', 'hero', 'promos', 'about', 'specialties', 'services', 'testimonials', 'contact', 'footer']).map((sectionId: string) => {
        switch (sectionId) {
          case 'header':
            return (
              <LandingHeader 
                key="header"
                clinicName={clinicData.clinic.name} 
                logoUrl={clinicData.logo_url} 
                onBookClick={handleBookClick} 
                primaryColor={clinicData.primary_color}
                settings={clinicData}
              />
            )
          case 'hero':
            return (
              <LandingHero 
                key="hero"
                clinicData={clinicData} 
                onBookClick={handleBookClick} 
              />
            )
          case 'about':
            return (
              <LandingAbout 
                key="about"
                clinicData={clinicData} 
                primaryColor={clinicData.primary_color} 
              />
            )
          case 'specialties':
            return (clinicData.show_specialties !== false || clinicData.active_sections?.includes('specialties')) && (
                <LandingSpecialties key="specialties" clinicData={clinicData} primaryColor={clinicData.primary_color} />
            )
          case 'services':
            return (clinicData.show_services || clinicData.active_sections?.includes('services')) && (
                <LandingServices 
                    key="services"
                    services={clinicData.clinic.services} 
                    primaryColor={clinicData.primary_color}
                    title={clinicData.services_title}
                    subtitle={clinicData.services_subtitle}
                    servicesLayout={clinicData.services_layout}
                    clinicData={clinicData}
                />
            )
          case 'promos':
            return (clinicData.show_promotions !== false || clinicData.active_sections?.includes('promos')) && (
                <LandingPromotions key="promos" clinicData={clinicData} />
            )
          case 'testimonials':
            return (clinicData.show_testimonials !== false || clinicData.active_sections?.includes('testimonials')) && (
                <LandingTestimonials key="testimonials" clinicData={clinicData} />
            )
          case 'contact':
            return (
                <LandingContact key="contact" clinicData={clinicData} onBookClick={handleBookClick} />
            )
          case 'footer':
            return (
                <LandingFooter key="footer" clinicData={clinicData} onBookClick={handleBookClick} />
            )
          default:
            return null
        }
      })}

      {/* Booking Modal Overlay */}
      <AnimatePresence>
        {showBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBooking(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
            >
                {/* Close Button */}
                <button 
                  onClick={() => setShowBooking(false)}
                  className="absolute top-8 right-8 z-50 h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-xl shadow-black/5"
                >
                    <X size={24} />
                </button>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                    <div className="max-w-4xl mx-auto">
                        <BookingPortal clinicData={clinicData} />
                    </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
