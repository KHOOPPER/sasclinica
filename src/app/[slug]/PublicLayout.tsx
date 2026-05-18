'use client'

import { useState, useRef, useEffect } from 'react'
import { MapPin, Phone, Globe, X } from 'lucide-react'
// Animaciones removidas - Zero-Lag
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
import { LandingGallery } from './LandingGallery'
import { LandingTeam } from './LandingTeam'

function AnimatedSection({ children }: { children: React.ReactNode, animation?: string, enabled?: boolean, delay?: number, duration?: number }) {
  // Animaciones desactivadas por requerimiento Zero-Lag
  return <>{children}</>
}


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
  
  const layoutDensity = clinicData.layout_density || 'relaxed'
  const spacingMap: Record<string, string> = {
    compact: '40px',
    relaxed: '80px',
    loose: '140px'
  }
  const sectionPadding = spacingMap[layoutDensity] || spacingMap.relaxed
  const containerMaxWidth = clinicData.container_max_width || 1200
  
  const headlineFont = clinicData.font_headlines || 'Manrope'
  const bodyFont = clinicData.font_body || 'Inter'
  const googleFontsUrl = `https://fonts.googleapis.com/css2?family=${headlineFont.replace(/ /g, '+')}:wght@400;500;700;800;900&family=${bodyFont.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`

  return (
    <div 
      className="min-h-screen bg-white selection:bg-[#003366] selection:text-white pb-20 overflow-x-hidden"
      style={{ 
        '--headline-weight': headlineWeight,
        '--body-weight': bodyWeight,
        '--entry-duration': `${animDuration}ms`,
        '--section-spacing': sectionPadding,
        '--container-width': `${containerMaxWidth}px`
      } as React.CSSProperties}
    >
      <link rel="stylesheet" href={googleFontsUrl} />
      <style jsx global>{`
        body {
          font-family: '${bodyFont}', sans-serif;
        }
        h1, h2, h3, h4, .font-headline {
          font-family: '${headlineFont}', sans-serif;
          font-weight: var(--headline-weight) !important;
        }
        p, span, .font-body {
          font-weight: var(--body-weight) !important;
        }
        section {
          padding-top: var(--section-spacing) !important;
          padding-bottom: var(--section-spacing) !important;
        }
        .max-w-6xl {
          max-width: var(--container-width) !important;
        }
      `}</style>
      
      {/* SECCIONES DINÁMICAS (Ordenadas por activación) */}
      {(clinicData.active_sections || ['header', 'hero', 'promos', 'about', 'specialties', 'services', 'testimonials', 'contact', 'footer']).map((sectionId: string) => {
        let content = null;
        
        switch (sectionId) {
          case 'header':
            content = (
              <LandingHeader 
                key="header"
                clinicName={clinicData.clinic?.name || clinicData.name || 'Clínica Médica'} 
                logoUrl={clinicData.logo_url} 
                onBookClick={handleBookClick} 
                primaryColor={clinicData.primary_color}
                settings={clinicData}
              />
            )
            break;
          case 'hero':
            content = (
              <LandingHero 
                key="hero"
                clinicData={clinicData} 
                onBookClick={handleBookClick} 
              />
            )
            break;
          case 'about':
            content = (
              <LandingAbout 
                key="about"
                clinicData={clinicData} 
                primaryColor={clinicData.primary_color} 
              />
            )
            break;
          case 'specialties':
            if (clinicData.show_specialties !== false || clinicData.active_sections?.includes('specialties')) {
                content = <LandingSpecialties key="specialties" clinicData={clinicData} primaryColor={clinicData.primary_color} />
            }
            break;
          case 'services':
            if (clinicData.show_services || clinicData.active_sections?.includes('services')) {
                content = (
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
            }
            break;
          case 'promos':
            if (clinicData.show_promotions !== false || clinicData.active_sections?.includes('promos')) {
                content = <LandingPromotions key="promos" clinicData={clinicData} />
            }
            break;
          case 'testimonials':
            if (clinicData.show_testimonials !== false || clinicData.active_sections?.includes('testimonials')) {
                content = <LandingTestimonials key="testimonials" clinicData={clinicData} />
            }
            break;
          case 'contact':
            content = <LandingContact key="contact" clinicData={clinicData} onBookClick={handleBookClick} />
            break;
          case 'gallery':
            if (clinicData.active_sections?.includes('gallery')) {
              content = <LandingGallery key="gallery" clinicData={clinicData} />
            }
            break;
          case 'team':
            if (clinicData.active_sections?.includes('team')) {
              content = <LandingTeam key="team" clinicData={clinicData} staff={clinicData.clinic?.staff || []} />
            }
            break;
          case 'footer':
            content = <LandingFooter key="footer" clinicData={clinicData} onBookClick={handleBookClick} />
            break;
        }

        if (!content) return null;

        // Don't animate header/footer with entry anim
        if (['header', 'footer'].includes(sectionId)) return content;

        return (
          <AnimatedSection 
            key={sectionId} 
            animation={entryAnim} 
            enabled={clinicData.enable_animations !== false}
            duration={animDuration}
          >
            {content}
          </AnimatedSection>
        )
      })}

      {/* WhatsApp Floating Button */}
      {clinicData.show_whatsapp && clinicData.whatsapp_number && (
        <a
          href={`https://wa.me/${clinicData.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(clinicData.whatsapp_message || '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
          style={{
            backgroundColor: clinicData.primary_color || '#25D366',
            ...((clinicData.whatsapp_position || 'bottom-right').includes('bottom') ? { bottom: '24px' } : { top: '80px' }),
            ...((clinicData.whatsapp_position || 'bottom-right').includes('right') ? { right: '24px' } : { left: '24px' }),
          }}
        >
          <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}

      {/* Booking Modal Overlay */}
      {showBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            onClick={() => setShowBooking(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <div 
            className="relative w-full max-w-4xl h-full md:h-auto max-h-[95vh] md:max-h-[90vh] bg-white rounded-[2rem] md:rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
              {/* Close Button */}
              <button 
                onClick={() => setShowBooking(false)}
                className="absolute top-4 right-4 md:top-8 md:right-8 z-50 h-10 w-10 md:h-12 md:w-12 rounded-full bg-slate-50/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-xl"
              >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
                  <div className="max-w-4xl mx-auto">
                      <BookingPortal clinicData={clinicData} />
                  </div>
              </div>
          </div>
        </div>
      )}
    </div>
  )
}
