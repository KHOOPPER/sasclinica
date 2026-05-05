'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Laptop, Tablet, Smartphone, Monitor } from 'lucide-react'
import { updateWebsiteSettings, updateServiceImage } from '../../actions'
import { LandingHero } from '@/app/[slug]/LandingHero'
import { LandingHeader } from '@/app/[slug]/LandingHeader'
import { LandingServices } from '@/app/[slug]/LandingServices'
import { LandingContact } from '@/app/[slug]/LandingContact'
import { LandingAbout } from '@/app/[slug]/LandingAbout'
import { LandingPromotions } from '@/app/[slug]/LandingPromotions'
import { LandingTestimonials } from '@/app/[slug]/LandingTestimonials'
import { LandingSpecialties } from '@/app/[slug]/LandingSpecialties'
import { LandingFooter } from '@/app/[slug]/LandingFooter'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { EditorSidebar } from './EditorSidebar'
import { cn } from '@/lib/utils'

export function WebsiteVisualEditor({ clinic, initialSettings, exitUrl }: { clinic: any, initialSettings: any, exitUrl?: string }) {
  // Auto scroll to top on load/reload
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0)
    }
  }, [])

  const [settings, setSettings] = useState({
    primary_color: '#2563eb',
    accent_color: '#60a5fa',
    bg_main: '#ffffff',
    bg_secondary: '#f8fafc',
    text_main: '#0f172a',
    text_secondary: '#64748b',
    navbar_bg: '#ffffff',
    footer_bg: '#f8fafc',
    font_headlines: 'Manrope',
    font_body: 'Inter',
    font_size_base: 16,
    line_height: 1.6,
    header_variant: 'classic',
    hero_variant: 'centered',
    footer_variant: 'classic',
    logo_width: 150,
    logo_padding_top: 10,
    logo_offset_x: 0,
    enable_animations: true,
    show_services: true,
    show_about: true,
    about_variant: 'split',
    about_badge: '+10 Años',
    about_badge_subtext: 'Experiencia Clínica',
    about_accent_color: null,
    about_bg_opacity: 10,
    about_blur: 20,
    about_overlay_opacity: 70,
    show_promotions: false,
    promo_variant: 'grid',
    promotions_title: 'Ofertas Especiales',
    promotions_subtitle: 'Oportunidades Únicas',
    promotions_badge: 'Limitado',
    promotions_cta_text: 'Ver Detalles',
    promo_text_color: '#ffffff',
    promo_bg_color: 'rgba(15, 23, 42, 0.4)',
    promo_section_bg: '#ffffff',
    promo_accent_color: null,
    promo_cta_bg_color: null,
    promo_cta_text_color: null,
    testimonials_variant: 'grid',
    promotions_data: [
      { title: 'Consulta General', old_price: '$50', new_price: '$25', image_url: 'https://images.unsplash.com/photo-1576091160550-217359f481e3?q=80&w=2000&auto=format&fit=crop' }
    ],
    testimonials_data: [
      { name: 'Juan Pérez', content: 'Excelente atención y profesionalismo.', specialty: 'Paciente de Cardiología' }
    ],
    show_specialties: true,
    show_contact: true,
    hero_cta_text: 'Agendar Consulta Ahora',
    header_cta_text: 'Agendar Consulta',
    nav_link_1: 'Inicio',
    nav_link_2: 'Servicios',
    nav_link_3: 'Aseguradoras',
    nav_link_4: 'Contacto',
    hero_badge: 'Atención Médica de Excelencia',
    hero_image_url: '',
    trust_badge_1: 'Seguros Médicos',
    trust_badge_2: 'ISO 9001:2015',
    trust_badge_3: 'Certificada',
    navbar_opacity: 90,
    navbar_text_color: '#0f172a',
    navbar_border_color: 'rgba(255,255,255,0.1)',
    navbar_border_width: 1,
    show_navbar_border: true,
    // Footer Defaults
    footer_show_info: true,
    footer_info_title: null,
    footer_info_desc: 'Ofreciendo servicios de salud de alta calidad con un enfoque humano y tecnológico. Comprometidos con tu bienestar integral.',
    footer_show_nav: true,
    footer_nav_title: 'Navegación',
    footer_nav_1_label: 'Inicio',
    footer_nav_2_label: 'Nuestro Equipo',
    footer_nav_3_label: 'Servicios',
    footer_nav_4_label: 'Blog',
    footer_nav_5_label: 'Preguntas Frecuentes',
    footer_show_schedule: true,
    footer_schedule_title: 'Horarios',
    footer_schedule_weekdays_label: 'Lunes a Viernes',
    footer_schedule_weekends_label: 'Sábados',
    footer_show_contact: true,
    footer_contact_title: 'Ubicación & Citas',
    contact_layout: 'split',
    map_style: 'standard',
    contact_title: 'Nuestra Sede',
    contact_subtitle: 'Estamos aquí para cuidar de ti.',
    contact_bg_color: null,
    contact_text_color: null,
    footer_address_label: null,
    footer_phone_label: null,
    footer_cta_text: 'Agendar Cita',
    meta_title: '',
    meta_description: '',
    favicon_url: '',
    custom_css: '',
    head_scripts: '',
    ...initialSettings
  })
  
  const [servicesData, setServicesData] = useState(clinic.services || [])
  const [isSaving, setIsSaving] = useState(false)
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isSaved, setIsSaved] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setIsSaving(true)
    setIsSaved(false)
    

    const toastId = toast.loading('Publicando cambios...')

    try {
      // Forzar is_active: true para que la página pública no ignore estos ajustes y muestre el fallback
      const result = await updateWebsiteSettings({ ...settings, is_active: true })
      
      const servicePromises = servicesData.map((s: any) => updateServiceImage(s.id, s.image_url))
      await Promise.all(servicePromises)

      // Artificial delay for premium feel and to show loading state (2 seconds as requested)
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (result.success) {
        setIsSaved(true)
        toast.success('Sitio publicado exitosamente', { id: toastId })
        setTimeout(() => setIsSaved(false), 3000)
      } else {
        toast.error('Error al guardar: ' + result.error, { id: toastId })
      }
    } catch (err: any) {
      toast.error('Error inesperado: ' + (err?.message || String(err)), { id: toastId })
      console.error('Save error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const previewData = {
    ...settings,
    clinic: { ...clinic, services: servicesData }
  }

  // Generate dynamic CSS variables for the preview
  const brandingStyles = {
    '--bg-main': settings.bg_main,
    '--bg-secondary': settings.bg_secondary,
    '--text-main': settings.text_main,
    '--text-secondary': settings.text_secondary,
    '--primary-color': settings.primary_color,
    '--accent-color': settings.accent_color,
    '--font-headlines': settings.font_headlines,
    '--font-body': settings.font_body,
    '--base-font-size': `${settings.font_size_base}px`,
    '--line-height': settings.line_height,
  } as React.CSSProperties

  return (
    <div className="flex h-full overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900 bg-slate-50">
      
      {/* SIDEBAR */}
      <EditorSidebar 
        settings={settings}
        setSettings={setSettings}
        clinic={clinic}
        onSave={handleSave}
        isSaving={isSaving}
        isSaved={isSaved}
        onBack={() => {
          // Use server-determined exitUrl to avoid middleware redirect loop (white flash)
          router.push(exitUrl ?? '/superadmin/sitios')
        }}
      />

      {/* LIVE PREVIEW AREA */}
      <main className="flex-1 bg-slate-100 relative group flex items-start justify-center p-12 overflow-y-auto">
        
        {/* VIEWPORT CONTROLS (Top Right) */}
        <div className="fixed top-6 right-10 z-50 flex gap-1 bg-white p-1.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
            {[
              { id: 'desktop', icon: Monitor, label: 'Desktop' },
              { id: 'laptop', icon: Laptop, label: 'Laptop' },
              { id: 'tablet', icon: Tablet, label: 'Tablet' },
              { id: 'mobile', icon: Smartphone, label: 'Mobile' }
            ].map(v => (
              <button 
                key={v.id}
                onClick={() => setViewport(v.id as any)} 
                className={cn(
                  "px-4 py-2 rounded-xl transition-all flex items-center gap-2",
                  viewport === v.id ? "bg-black text-white shadow-lg" : "text-slate-400 hover:bg-slate-50 hover:text-black"
                )}
              >
                <v.icon size={14} className={viewport === v.id ? "text-white" : "text-slate-400"} /> 
                <span className="text-[9px] font-bold uppercase tracking-widest">{v.label}</span>
              </button>
            ))}
        </div>

        {/* DEVICE FRAME */}
        <div 
          className={cn(
            "transition-all duration-500 bg-white shadow-2xl relative overflow-hidden",
            viewport === 'desktop' ? 'w-full min-h-full' : 
            viewport === 'tablet' ? 'w-[768px] min-h-[1024px] rounded-sm ring-8 ring-slate-900/5' : 
            'w-[375px] min-h-[667px] rounded-sm ring-8 ring-slate-900/5'
          )}
          style={{ ...brandingStyles, transform: 'translateZ(0)' }}
        >
            {/* Inject Custom CSS from settings */}
            {settings.custom_css && (
              <style dangerouslySetInnerHTML={{ __html: settings.custom_css }} />
            )}
            <div className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth bg-white custom-scrollbar-preview">
                <div 
                  className="flex flex-col min-h-full"
                  style={{ 
                    fontFamily: 'var(--font-body)', 
                    fontSize: 'var(--base-font-size)',
                    lineHeight: 'var(--line-height)',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-main)'
                  }}
                >
                    {(settings.active_sections || ['header', 'hero', 'promos', 'about', 'specialties', 'services', 'testimonials', 'contact', 'footer', 'booking']).map((sectionId: string) => {
                      switch (sectionId) {
                        case 'header':
                          return (
                            <LandingHeader 
                              key="header"
                              clinicName={clinic.name} 
                              logoUrl={settings.logo_url} 
                              onBookClick={() => toast.info('La reserva se abrirá en la página pública.')} 
                              primaryColor={settings.primary_color}
                              settings={previewData}
                            />
                          )
                        case 'hero':
                          return (
                            <LandingHero 
                              key="hero"
                              clinicData={previewData} 
                              onBookClick={() => toast.info('La reserva se abrirá en la página pública.')} 
                            />
                          )
                        case 'about':
                          return (settings.show_about || settings.active_sections?.includes('about')) && (
                            <LandingAbout 
                              key="about"
                              clinicData={previewData} 
                              primaryColor={settings.primary_color} 
                            />
                          )
                        case 'specialties':
                          return (settings.show_specialties !== false || settings.active_sections?.includes('specialties')) && (
                            <LandingSpecialties 
                              key="specialties"
                              clinicData={previewData} 
                              primaryColor={settings.primary_color} 
                            />
                          )
                        case 'services':
                          return (settings.show_services || settings.active_sections?.includes('services')) && (
                            <LandingServices 
                              key="services"
                              services={servicesData} 
                              primaryColor={settings.primary_color}
                              title={settings.services_title}
                              subtitle={settings.services_subtitle}
                              servicesLayout={settings.services_layout}
                              clinicData={previewData}
                            />
                          )
                        case 'promos':
                          return (settings.show_promotions !== false || settings.active_sections?.includes('promos')) && (
                            <LandingPromotions 
                              key="promos"
                              clinicData={previewData} 
                            />
                          )
                        case 'testimonials':
                          return (settings.show_testimonials !== false || settings.active_sections?.includes('testimonials')) && (
                            <LandingTestimonials 
                              key="testimonials"
                              clinicData={previewData} 
                            />
                          )
                        case 'contact':
                          return (settings.show_contact !== false || settings.active_sections?.includes('contact')) && (
                            <LandingContact 
                              key="contact"
                              clinicData={previewData} 
                              onBookClick={() => toast.info('La reserva se abrirá en la página pública.')} 
                            />
                          )
                        case 'footer':
                          return (settings.show_footer !== false || settings.active_sections?.includes('footer')) && (
                            <LandingFooter 
                              key="footer"
                              clinicData={previewData} 
                              onBookClick={() => toast.info('La reserva se abrirá en la página pública.')} 
                            />
                          )
                        default:
                          return null
                      }
                    })}
                </div>
            </div>
            
            {/* Mock Scroll Indicator */}
            <div className="absolute right-1 top-1/2 -translate-y-1/2 h-32 w-1 bg-slate-300/10 rounded-full" />
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar-preview::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-preview::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.02);
        }
        .custom-scrollbar-preview::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar-preview::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
