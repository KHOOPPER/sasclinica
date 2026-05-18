'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { Laptop, Tablet, Smartphone, Monitor, Menu, X, Save, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
// Animaciones deshabilitadas por solicitud de rendimiento (Zero-Lag)
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
import { LandingGallery } from '@/app/[slug]/LandingGallery'
import { LandingTeam } from '@/app/[slug]/LandingTeam'
import { useRouter } from 'next/navigation'
import { EditorSidebar } from './EditorSidebar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const VIEWPORT_WIDTHS = { desktop: 1440, laptop: 1024, tablet: 768, mobile: 375 }
const BREAKPOINT_MD = 768 // px — sidebar open by default above this

function AnimatedSection({ children }: { children: React.ReactNode, animation?: string, enabled?: boolean, delay?: number, duration?: number }) {
  // Retornamos directamente los hijos sin ningún wrapper de animación
  return <>{children}</>
}

export function WebsiteVisualEditor({ clinic, initialSettings, exitUrl }: { clinic: any, initialSettings: any, exitUrl?: string }) {
  const router = useRouter()

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
    entry_animation: 'fade-up',
    animation_duration: 800,
    layout_density: 'relaxed',
    container_max_width: 1200,
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
    footer_show_info: true,
    footer_info_title: null,
    footer_info_desc: 'Ofreciendo servicios de salud de alta calidad con un enfoque humano y tecnológico.',
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
    show_whatsapp: true,
    whatsapp_number: '',
    whatsapp_message: 'Hola! Me gustaría agendar una cita...',
    whatsapp_position: 'bottom-right',
    ...initialSettings
  })

  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [servicesData, setServicesData] = useState(clinic.services || [])
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [viewport, setViewport] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile'>('desktop')
  const [sidebarOpen, setSidebarOpen] = useState(true)  // controlled by hamburger
  const [isMobile, setIsMobile] = useState(false)
  const [scale, setScale] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  // ── Detect screen size → auto-toggle sidebar ─────────────────────────────
  useEffect(() => {
    const checkBreakpoint = () => {
      const mobile = window.innerWidth < BREAKPOINT_MD
      setIsMobile(mobile)
      // On mobile: sidebar closed by default; on desktop: open by default
      setSidebarOpen(!mobile)
    }
    checkBreakpoint()
    window.addEventListener('resize', checkBreakpoint)
    return () => window.removeEventListener('resize', checkBreakpoint)
  }, [])

  // ── Auto-scale preview frame ───────────────────────────────────────────────
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return
      const available = containerRef.current.offsetWidth - 32
      const target = VIEWPORT_WIDTHS[viewport]
      setScale(available < target ? available / target : 1)
    }
    const timer = setTimeout(updateScale, 150)
    window.addEventListener('resize', updateScale)
    return () => { window.removeEventListener('resize', updateScale); clearTimeout(timer) }
  }, [viewport, sidebarOpen])

  // ── Save handler ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true)
    setIsSaved(false)
    const toastId = toast.loading('Publicando cambios...')
    try {
      const result = await updateWebsiteSettings({ ...settings, is_active: true })
      await Promise.all(servicesData.map((s: any) => updateServiceImage(s.id, s.image_url)))
      await new Promise(r => setTimeout(r, 1500))
      if (result.success) {
        setIsSaved(true)
        if (result.data) {
          setSettings(result.data)
        }
        toast.success('Sitio publicado exitosamente', { id: toastId })
        setTimeout(() => setIsSaved(false), 3000)
      } else {
        toast.error('Error al guardar: ' + result.error, { id: toastId })
      }
    } catch (err: any) {
      toast.error('Error inesperado: ' + (err?.message || String(err)), { id: toastId })
    } finally {
      setIsSaving(false)
    }
  }

  // ── Debounce settings for preview performance ──────────────────────────
  const [debouncedSettings, setDebouncedSettings] = useState(settings)
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSettings(settings)
    }, 400)
    return () => clearTimeout(handler)
  }, [settings])

  const previewData = React.useMemo(() => ({ 
    ...debouncedSettings, 
    clinic: { ...clinic, services: servicesData } 
  }), [debouncedSettings, clinic, servicesData])

  const brandingStyles = React.useMemo(() => ({
    '--bg-main': debouncedSettings.bg_main,
    '--bg-secondary': debouncedSettings.bg_secondary,
    '--text-main': debouncedSettings.text_main,
    '--text-secondary': debouncedSettings.text_secondary,
    '--primary-color': debouncedSettings.primary_color,
    '--accent-color': debouncedSettings.accent_color,
    '--font-headlines': debouncedSettings.font_headlines,
    '--font-body': debouncedSettings.font_body,
    '--base-font-size': `${debouncedSettings.font_size_base}px`,
    '--line-height': debouncedSettings.line_height,
  } as React.CSSProperties), [debouncedSettings])

  const frameWidth = VIEWPORT_WIDTHS[viewport]

  // ── Viewport buttons config ───────────────────────────────────────────────
  const viewports = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'laptop',  icon: Laptop,  label: 'Laptop'  },
    { id: 'tablet',  icon: Tablet,  label: 'Tablet'  },
    { id: 'mobile',  icon: Smartphone, label: 'Mobile' },
  ] as const

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f0f11] font-sans">


      {/* ══════════════════ MOBILE FLOATING TRIGGER ══════════════════ */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-3 left-3 w-12 h-12 rounded-2xl bg-emerald-500 text-white shadow-2xl shadow-emerald-500/40 flex items-center justify-center z-[1100] md:hidden active:scale-90 transition-transform"
        >
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-5 h-1 bg-white rounded-full" />
            <div className="w-3 h-1 bg-white/70 rounded-full ml-auto" />
            <div className="w-5 h-1 bg-white rounded-full" />
          </div>
        </button>
      )}

      {/* ══════════════════ BODY ══════════════════ */}
      <main className="flex flex-1 overflow-hidden relative">

        {/* ── SIDEBAR OVERLAY on mobile ── */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-[1900] backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── SIDEBAR ── */}
        {sidebarOpen && (
          <aside
            className={cn(
              'shrink-0 h-full overflow-hidden bg-[#0f0f11] transition-all duration-200',
              isMobile ? 'fixed inset-y-0 left-0 shadow-2xl z-[2000]' : 'relative border-r border-white/5 z-50'
            )}
          >
            <div className={cn("h-full", isMobile ? "w-[85vw] max-w-[320px]" : "w-[380px]")}>
              <EditorSidebar
                settings={settings}
                setSettings={setSettings}
                clinic={clinic}
                onSave={handleSave}
                isSaving={isSaving}
                isSaved={isSaved}
                onBack={() => router.push(exitUrl ?? '/superadmin/sitios')}
                onClose={() => setSidebarOpen(false)}
                expandedSectionExternal={activeSection}
              />
            </div>
          </aside>
        )}

        <main
          ref={containerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden bg-[#1a1a1e] p-3 md:p-6"
        >
          <div
            className="relative shadow-2xl overflow-hidden rounded-xl w-full"
            style={{
              ...brandingStyles,
              backgroundColor: debouncedSettings.bg_main || '#0f172a',
              minHeight: '100vh',
            }}
          >
            {settings.custom_css && (
              <style dangerouslySetInnerHTML={{ __html: settings.custom_css }} />
            )}
            <style>{`
              section {
                padding-top: var(--section-spacing) !important;
                padding-bottom: var(--section-spacing) !important;
              }
              .max-w-6xl {
                max-width: var(--container-width) !important;
              }
            `}</style>
            <div
              className="flex flex-col"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--base-font-size)',
                lineHeight: String(settings.line_height),
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-main)',
                '--section-spacing': (settings.layout_density === 'compact' ? '40px' : settings.layout_density === 'loose' ? '140px' : '80px'),
                '--container-width': `${settings.container_max_width || 1200}px`
              } as React.CSSProperties}
            >
              {(settings.active_sections || ['header','hero','promos','about','specialties','services','testimonials','contact','footer','booking']).map((sectionId: string) => {
                let sectionContent = null;
                switch (sectionId) {
                  case 'header':
                    sectionContent = (
                      <LandingHeader
                        key="header"
                        clinicName={clinic.name}
                        logoUrl={settings.logo_url}
                        onBookClick={() => toast.info('La reserva se abrirá en la página pública.')}
                        primaryColor={settings.primary_color}
                        settings={previewData}
                        isPreview={true}
                      />
                    )
                    break;
                  case 'hero':
                    sectionContent = (
                      <LandingHero
                        key="hero"
                        clinicData={previewData}
                        onBookClick={() => toast.info('La reserva se abrirá en la página pública.')}
                        isPreview={true}
                      />
                    )
                    break;
                  case 'about':
                    if (settings.show_about !== false || settings.active_sections?.includes('about')) {
                        sectionContent = <LandingAbout key="about" clinicData={previewData} primaryColor={settings.primary_color} />
                    }
                    break;
                  case 'specialties':
                    if (settings.show_specialties !== false || settings.active_sections?.includes('specialties')) {
                        sectionContent = <LandingSpecialties key="specialties" clinicData={previewData} primaryColor={settings.primary_color} />
                    }
                    break;
                  case 'services':
                    if (settings.show_services || settings.active_sections?.includes('services')) {
                        sectionContent = (
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
                    }
                    break;
                  case 'promos':
                    if (settings.show_promotions !== false || settings.active_sections?.includes('promos')) {
                        sectionContent = <LandingPromotions key="promos" clinicData={previewData} />
                    }
                    break;
                  case 'testimonials':
                    if (settings.show_testimonials !== false || settings.active_sections?.includes('testimonials')) {
                        sectionContent = <LandingTestimonials key="testimonials" clinicData={previewData} />
                    }
                    break;
                  case 'contact':
                    if (settings.show_contact !== false || settings.active_sections?.includes('contact')) {
                        sectionContent = (
                          <LandingContact
                            key="contact"
                            clinicData={previewData}
                            onBookClick={() => toast.info('La reserva se abrirá en la página pública.')}
                          />
                        )
                    }
                    break;
                  case 'gallery':
                    if (settings.active_sections?.includes('gallery')) {
                        sectionContent = <LandingGallery key="gallery" clinicData={previewData} />
                    }
                    break;
                  case 'team':
                    if (settings.active_sections?.includes('team')) {
                        sectionContent = <LandingTeam key="team" clinicData={previewData} />
                    }
                    break;
                  case 'footer':
                    if (settings.show_footer !== false || settings.active_sections?.includes('footer')) {
                        sectionContent = (
                          <LandingFooter
                            key="footer"
                            clinicData={previewData}
                            onBookClick={() => toast.info('La reserva se abrirá en la página pública.')}
                          />
                        )
                    }
                    break;
                }

                if (!sectionContent) return null;

                if (['header', 'footer'].includes(sectionId)) return sectionContent;

                return (
                  <div 
                    key={sectionId} 
                    className="group relative cursor-pointer"
                    onClick={() => setActiveSection(sectionId)}
                  >
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-slate-900/20 z-10 pointer-events-none transition-all rounded-xl" />
                    {activeSection === sectionId && (
                      <div className="absolute top-2 right-2 bg-slate-900 text-white text-[8px] font-bold px-2 py-1 rounded-full z-20 shadow-xl animate-in zoom-in duration-200">
                        EDITANDO: {sectionId.toUpperCase()}
                      </div>
                    )}
                    <AnimatedSection 
                      animation={settings.entry_animation || 'fade-up'} 
                      enabled={settings.enable_animations !== false}
                      duration={settings.animation_duration || 800}
                    >
                      {sectionContent}
                    </AnimatedSection>
                  </div>
                )
              })}
            </div>

            {/* WhatsApp Floating Button */}
            {settings.show_whatsapp && settings.whatsapp_number && (
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(settings.whatsapp_message || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: settings.primary_color || '#25D366',
                  ...((settings.whatsapp_position || 'bottom-right').includes('bottom') ? { bottom: '24px' } : { top: '80px' }),
                  ...((settings.whatsapp_position || 'bottom-right').includes('right') ? { right: '24px' } : { left: '24px' }),
                }}
                title="Contactar por WhatsApp"
              >
                {/* WhatsApp SVG icon */}
                <svg viewBox="0 0 24 24" fill="white" width="26" height="26">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            )}
          </div>
        </main>
      </main>
    </div>
  )
}
