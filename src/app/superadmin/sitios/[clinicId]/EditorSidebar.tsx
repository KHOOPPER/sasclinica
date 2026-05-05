'use client'

import React, { useState } from 'react'
import { 
  ChevronDown, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Type, 
  Palette, 
  Layers, 
  Globe, 
  Layout, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Save, 
  ChevronLeft,
  Sparkles,
  Check,
  PanelTop,
  Component,
  Square,
  Info,
  Maximize,
  Monitor,
  MessageSquare,
  HeartPulse,
  Percent,
  Map as MapIcon,
  Tag,
  Clock,
  ArrowRight,
  Hash,
  Shield,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ChevronRight,
  X,
  Plus as PlusIcon,
  Trash2 as TrashIcon,
  Eye,
  EyeOff,
  Search,
  Filter,
  Menu,
  MoreVertical,
  Activity,
  Heart,
  Stethoscope,
  Database,
  Lock,
  Zap,
  ExternalLink,
  ChevronUp,
  Navigation
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { VariantSelector } from '@/components/editor/VariantSelector'

type EditorTab = 'content' | 'design' | 'structure' | 'advanced'

interface EditorSidebarProps {
  settings: any
  setSettings: (settings: any) => void
  clinic: any
  onSave: () => void
  isSaving: boolean
  isSaved: boolean
  onBack: () => void
}

export function EditorSidebar({ settings, setSettings, clinic, onSave, isSaving, isSaved, onBack }: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('content')
  const [expandedSection, setExpandedSection] = useState<string | null>('header')
  const [currentPage, setCurrentPage] = useState('inicio')

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const toggleSectionActivation = (sectionId: string, isActive: boolean) => {
    // Standard section IDs that can be toggled
    const defaultOrder = ['header', 'hero', 'promos', 'about', 'services', 'specialties', 'testimonials', 'contact', 'footer']
    let activeSections = settings.active_sections ? [...settings.active_sections] : [...defaultOrder]
    
    if (isActive) {
      if (!activeSections.includes(sectionId)) {
        activeSections.push(sectionId)
      }
    } else {
      activeSections = activeSections.filter(id => id !== sectionId)
    }
    
    setSettings({
      ...settings,
      active_sections: activeSections,
      [`show_${sectionId}`]: isActive // Keep matching old show_xxx flags
    })
  }
  const pages = [
    { id: 'inicio', label: 'Página: Inicio' },
    { id: 'servicios', label: 'Página: Servicios' },
    { id: 'contacto', label: 'Página: Contacto' },
  ]

  const headerVariants = [
    { id: 'classic', label: 'Clásico', icon: PanelTop, description: 'Navbar tradicional superior.' },
    { id: 'minimal', label: 'Minimalista', icon: Square, description: 'Diseño limpio sin sombras.' },
    { id: 'floating', label: 'Flotante', icon: PanelTop, description: 'Barra flotante con bordes suaves.' },
    { id: 'glass', label: 'Elite Glass', icon: Sparkles, description: 'Cristal translúcido con desenfoque de fondo.' },
  ]

  const heroVariants = [
    { id: 'centered', label: 'Elite Centered', icon: Layout, description: 'Texto centrado con overlay premium.' },
    { id: 'gradient', label: 'Split Modern', icon: PanelTop, description: 'Texto a la izquierda con degradado.' },
    { id: 'apple', label: 'Apple Pro Style', icon: Monitor, description: 'Tipografía masiva y animaciones profundas.' },
    { id: 'split', label: 'Side-by-Side', icon: Maximize, description: 'Imagen y texto en balance perfecto.' },
  ]

  const aboutVariants = [
    { id: 'split', label: 'Elite Split', icon: Layout, description: 'Imagen a un lado con badge flotante.' },
    { id: 'glass', label: 'Glass Matrix', icon: Square, description: 'Tarjetas de cristal sobre fondo suave.' },
    { id: 'cinematic', label: 'Boutique Showcase', icon: Maximize, description: 'Elegancia editorial con tarjetas limpias.' },
    { id: 'minimal', label: 'Stitch Minimal', icon: PanelTop, description: 'Limpio, blanco y enfocado en el mensaje.' },
  ]
  const promoVariants = [
    { id: 'grid', label: 'Elite Grid', icon: Layout, description: '3 tarjetas limpias en cuadrícula.' },
    { id: 'glass', label: 'Glass Matrix', icon: Square, description: 'Efecto cristal sobre fondo oscuro.' },
    { id: 'overlap', label: 'Elite Overlap', icon: Maximize, description: 'Elegancia editorial flotante.' },
    { id: 'minimal', label: 'Split Modern', icon: PanelTop, description: 'Minimalismo de alto contraste.' },
  ]
  const testimonialVariants = [
    { id: 'grid', label: 'Elite Cards', icon: Layout, description: 'Tarjetas con estrellas de calificación.' },
    { id: 'glass', label: 'Glass Matrix', icon: Square, description: 'Historias de éxito sobre cristal.' },
    { id: 'minimal', label: 'Centered Focus', icon: Heart, description: 'Un testimonio central destacado.' },
    { id: 'modern', label: 'Clean Slider', icon: PanelTop, description: 'Carrusel suave y moderno.' },
  ]

  const footerVariants = [
    { id: 'classic', label: 'Clásico', icon: Layout },
    { id: 'minimal', label: 'Minimal', icon: Square },
    { id: 'impact', label: 'Impact', icon: Sparkles },
    { id: 'dark', label: 'Dark', icon: Monitor },
  ]

  const specialtyVariants = [
    { id: 'grid', label: 'Grid', icon: Layout },
    { id: 'list', label: 'Lista', icon: Layers },
  ]

  const serviceVariants = [
    { id: 'grid', label: 'Cuadrícula', icon: Layout },
    { id: 'list', label: 'Lista', icon: Layers },
  ]

  const fontFamilies = [
    { id: 'Manrope', name: 'Manrope (Moderno)' },
    { id: 'Inter', name: 'Inter (UI)' },
    { id: 'Outfit', name: 'Outfit (Geométrico)' },
    { id: 'Plus Jakarta Sans', name: 'Jakarta Sans' },
  ]
  return (
    <aside className="w-[420px] h-full bg-bg-main border-r border-slate-100 dark:border-white/5 flex flex-col z-20 overflow-hidden shrink-0 shadow-[20px_0_40px_rgba(0,0,0,0.1)] dark:shadow-[20px_0_40px_rgba(0,0,0,0.4)]">
      <div className="pt-8 pb-6 px-10 border-b border-slate-100 dark:border-white/5 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-black/20 sticky top-0 z-30">
        <div className="flex items-baseline gap-1.5 mb-2">
           <h3 className="text-xl font-black tracking-tighter text-text-main">Builder</h3>
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary">Pro</span>
        </div>
        <p className="text-[9px] font-black text-brand-primary/60 uppercase tracking-[0.2em] text-center w-full break-words py-1.5 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/5 px-4 shadow-sm">
           {clinic.name}
        </p>
      </div>

      <div className="flex border-b border-slate-100 bg-white shrink-0 px-6">
        {[
          { id: 'content', label: 'Contenido', icon: Tag },
          { id: 'design', label: 'Estilos', icon: Palette },
          { id: 'structure', label: 'Orden', icon: Layers },
          { id: 'advanced', label: 'Avanzado', icon: Shield },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as EditorTab)}
            className={cn(
              "flex-1 py-4 text-[9px] font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1.5 transition-all relative",
              activeTab === tab.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900" />
            )}
          </button>
        ))}
      </div>
      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        
        {/* ===================== TAB: CONTENT ===================== */}
        {activeTab === 'content' && (
          <div className="px-8 py-6 space-y-4">
            {/* Navbar */}
            <AccordionSection 
              title="Navbar" 
              isOpen={expandedSection === 'header'} 
              onToggle={() => toggleSection('header')}
              icon={Navigation}
              isActive={settings.active_sections ? settings.active_sections.includes('header') : true}
              onActiveChange={(v: boolean) => toggleSectionActivation('header', v)}
            >
               <div className="space-y-4">
                  <VariantSelector 
                    options={headerVariants}
                    selected={settings.header_variant || 'classic'}
                    onChange={(id: string) => setSettings({...settings, header_variant: id})}
                  />
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="space-y-1.5">
                       <Label className="text-[9px] font-bold uppercase text-slate-500">Logo URL</Label>
                       <Input value={settings.logo_url || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, logo_url: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <SliderControl label="Ancho Logo" value={settings.logo_width || 150} min={40} max={250} onChange={(v: number) => setSettings({...settings, logo_width: v})} />
                        <SliderControl label="Margen Y" value={settings.logo_padding_top || 0} min={-40} max={40} onChange={(v: number) => setSettings({...settings, logo_padding_top: v})} />
                    </div>
                  </div>
               </div>
            </AccordionSection>

            {/* Hero */}
            <AccordionSection 
              title="Hero" 
              isOpen={expandedSection === 'hero'} 
              onToggle={() => toggleSection('hero')}
              icon={Sparkles}
              isActive={settings.active_sections ? settings.active_sections.includes('hero') : true}
              onActiveChange={(v: boolean) => toggleSectionActivation('hero', v)}
            >
               <div className="space-y-4">
                  <VariantSelector 
                    options={heroVariants}
                    selected={settings.hero_variant || 'centered'}
                    onChange={(id: string) => setSettings({...settings, hero_variant: id})}
                  />
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="space-y-1.5">
                       <Label className="text-[9px] font-bold uppercase text-slate-500">Título Principal</Label>
                       <textarea value={settings.hero_title || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({...settings, hero_title: e.target.value})} className="w-full min-h-[60px] p-3 text-xs bg-slate-50 border-none rounded-xl" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <Input value={settings.hero_badge || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, hero_badge: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px]" placeholder="Badge" />
                       <Input value={settings.hero_cta_text || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, hero_cta_text: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px]" placeholder="Botón" />
                    </div>
                  </div>
               </div>
            </AccordionSection>

            {/* nosotros */}
            <AccordionSection 
              title="nosotros" 
              isOpen={expandedSection === 'about'} 
              onToggle={() => toggleSection('about')}
              icon={Info}
              isActive={settings.active_sections ? settings.active_sections.includes('about') : true}
              onActiveChange={(v: boolean) => toggleSectionActivation('about', v)}
            >
               <div className="space-y-4">
                  <VariantSelector options={aboutVariants} selected={settings.about_variant || 'split'} onChange={(id: string) => setSettings({...settings, about_variant: id})} />
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                     <div className="grid grid-cols-2 gap-3">
                        <Input value={settings.about_badge || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, about_badge: e.target.value})} className="h-9 bg-slate-50 border-none text-[10px]" placeholder="Experiencia" />
                        <Input value={settings.about_badge_subtext || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, about_badge_subtext: e.target.value})} className="h-9 bg-slate-50 border-none text-[10px]" placeholder="Texto" />
                     </div>
                     <textarea value={settings.about_description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({...settings, about_description: e.target.value})} className="w-full min-h-[80px] p-3 text-[11px] bg-slate-50 border-none rounded-xl" />
                  </div>
               </div>
            </AccordionSection>

            {/* Ofertas */}
            <AccordionSection 
              title="Ofertas" 
              isOpen={expandedSection === 'promos'} 
              onToggle={() => toggleSection('promos')}
              icon={Percent}
              isActive={settings.active_sections ? settings.active_sections.includes('promos') : (settings.show_promotions !== false)}
              onActiveChange={(v: boolean) => toggleSectionActivation('promos', v)}
            >
               <div className="space-y-4">
                  <VariantSelector options={promoVariants} selected={settings.promo_variant || 'grid'} onChange={(id: string) => setSettings({...settings, promo_variant: id})} />
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                     <div className="grid grid-cols-2 gap-2">
                        <Input value={settings.promotions_title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, promotions_title: e.target.value})} className="h-8 bg-slate-50 border-none text-[10px]" placeholder="Título" />
                        <Input value={settings.promotions_badge || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, promotions_badge: e.target.value})} className="h-8 bg-slate-50 border-none text-[10px]" placeholder="Badge" />
                     </div>
                     <div className="space-y-2">
                        {(settings.promotions_data || []).map((p: any, i: number) => (
                           <div key={i} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg group">
                              <Input value={p.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                 const nd = [...settings.promotions_data]; nd[i].title = e.target.value; setSettings({...settings, promotions_data: nd})
                              }} className="h-7 bg-transparent border-none text-[10px] font-bold" />
                              <button onClick={() => {
                                 const nd = [...settings.promotions_data]; nd.splice(i,1); setSettings({...settings, promotions_data: nd})
                              }} className="opacity-0 group-hover:opacity-100"><Trash2 size={10}/></button>
                           </div>
                        ))}
                     </div>
                     <button onClick={() => setSettings({...settings, promotions_data: [...(settings.promotions_data || []), {title: '', new_price: ''}]})} className="w-full py-2 border border-dashed border-slate-200 rounded-lg text-[9px] font-bold uppercase text-slate-400">+ Añadir Promo</button>
                  </div>
               </div>
            </AccordionSection>

            {/* Especialidades */}
            <AccordionSection 
              title="Especialidades" 
              isOpen={expandedSection === 'specialties'} 
              onToggle={() => toggleSection('specialties')}
              icon={Stethoscope}
              isActive={settings.active_sections ? settings.active_sections.includes('specialties') : true}
              onActiveChange={(v: boolean) => toggleSectionActivation('specialties', v)}
            >
               <div className="space-y-4">
                  <VariantSelector options={specialtyVariants} selected={settings.specialty_variant || 'grid'} onChange={(id: string) => setSettings({...settings, specialty_variant: id})} />
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                     {(settings.specialties_data || []).map((s: any, i: number) => (
                        <div key={i} className="flex gap-2">
                           <Input value={s.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const nd = [...settings.specialties_data]; nd[i].title = e.target.value; setSettings({...settings, specialties_data: nd})
                           }} className="h-8 bg-slate-50 border-none text-[10px]" />
                           <button onClick={() => {
                              const nd = [...settings.specialties_data]; nd.splice(i,1); setSettings({...settings, specialties_data: nd})
                           }}><Trash2 size={10}/></button>
                        </div>
                     ))}
                     <button onClick={() => setSettings({...settings, specialties_data: [...(settings.specialties_data || []), {title: ''}]})} className="w-full py-2 border border-dashed border-slate-200 rounded-lg text-[9px] font-bold uppercase text-slate-400">+ Especialidad</button>
                  </div>
               </div>
            </AccordionSection>

            {/* Servicios */}
            <AccordionSection 
              title="Servicios" 
              isOpen={expandedSection === 'services'} 
              onToggle={() => toggleSection('services')}
              icon={Activity}
              isActive={settings.active_sections ? settings.active_sections.includes('services') : true}
              onActiveChange={(v: boolean) => toggleSectionActivation('services', v)}
            >
               <div className="space-y-4">
                  <VariantSelector options={serviceVariants} selected={settings.service_variant || 'list'} onChange={(id: string) => setSettings({...settings, service_variant: id})} />
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                     <Input value={settings.services_title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, services_title: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px]" placeholder="Título" />
                     <p className="text-[10px] text-slate-400 italic px-1">Gestión individual en el menú principal.</p>
                  </div>
               </div>
            </AccordionSection>

            {/* Testimonios */}
            <AccordionSection 
              title="Testimonios" 
              isOpen={expandedSection === 'testimonials'} 
              onToggle={() => toggleSection('testimonials')}
              icon={MessageSquare}
              isActive={settings.active_sections ? settings.active_sections.includes('testimonials') : true}
              onActiveChange={(v: boolean) => toggleSectionActivation('testimonials', v)}
            >
               <div className="space-y-4">
                  <VariantSelector options={testimonialVariants} selected={settings.testimonial_variant || 'carousel'} onChange={(id: string) => setSettings({...settings, testimonial_variant: id})} />
                  <div className="pt-4 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sección Activa</p>
                  </div>
               </div>
            </AccordionSection>

            {/* Contacto */}
            <AccordionSection 
              title="Contacto" 
              isOpen={expandedSection === 'contact'} 
              onToggle={() => toggleSection('contact')}
              icon={Phone}
              isActive={settings.active_sections ? settings.active_sections.includes('contact') : true}
              onActiveChange={(v: boolean) => toggleSectionActivation('contact', v)}
            >
               <div className="space-y-3">
                  <Input value={settings.contact_address || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, contact_address: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px]" placeholder="Dirección" />
                  <Input value={settings.contact_phone || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, contact_phone: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px]" placeholder="Teléfono" />
                  <Input value={settings.contact_email || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, contact_email: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px]" placeholder="Email" />
               </div>
            </AccordionSection>

            {/* Pie de Página */}
            <AccordionSection 
              title="Pie de Página" 
              isOpen={expandedSection === 'footer'} 
              onToggle={() => toggleSection('footer')}
              icon={Layout}
              isActive={settings.active_sections ? settings.active_sections.includes('footer') : true}
              onActiveChange={(v: boolean) => toggleSectionActivation('footer', v)}
            >
               <div className="space-y-4">
                  <VariantSelector options={footerVariants} selected={settings.footer_variant || 'classic'} onChange={(id: string) => setSettings({...settings, footer_variant: id})} />
                  <Input value={settings.footer_text || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, footer_text: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px]" placeholder="© 2026..." />
               </div>
            </AccordionSection>
          </div>
        )}

        {/* ===================== TAB: DESIGN (BRANDING) ===================== */}
        {activeTab === 'design' && (
          <div className="px-10 py-6 space-y-8">
            <div className="space-y-4">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Paleta Técnica</h4>
               <div className="grid grid-cols-1 gap-4">
                 <ColorPicker label="Principal" value={settings.primary_color || '#2563eb'} onChange={(c: string) => setSettings({...settings, primary_color: c})} />
                 <ColorPicker label="Acento" value={settings.accent_color || '#60a5fa'} onChange={(c: string) => setSettings({...settings, accent_color: c})} />
                 <ColorPicker label="Fondo" value={settings.bg_main || '#ffffff'} onChange={(c: string) => setSettings({...settings, bg_main: c})} />
                 <ColorPicker label="Texto" value={settings.text_main || '#0f172a'} onChange={(c: string) => setSettings({...settings, text_main: c})} />
               </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tipografía</h4>
               <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Fuente Títulos</Label>
                    <select 
                      value={settings.font_headlines || 'Manrope'} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSettings({...settings, font_headlines: e.target.value})}
                      className="w-full h-9 border border-slate-200 bg-slate-50 rounded-lg px-3 text-[11px] font-bold outline-none"
                    >
                      {fontFamilies.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Fuente Cuerpo</Label>
                    <select 
                      value={settings.font_body || 'Inter'} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSettings({...settings, font_body: e.target.value})}
                      className="w-full h-9 border border-slate-200 bg-slate-50 rounded-lg px-3 text-[11px] outline-none"
                    >
                      {fontFamilies.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <SliderControl 
                      label="Peso Títulos" 
                      value={settings.font_headline_weight || 800} 
                      min={400} max={900} step={100}
                      onChange={(v: number) => setSettings({...settings, font_headline_weight: v})} 
                    />
                    <SliderControl 
                      label="Peso Cuerpo" 
                      value={settings.font_body_weight || 400} 
                      min={300} max={700} step={100}
                      onChange={(v: number) => setSettings({...settings, font_body_weight: v})} 
                    />
                  </div>
               </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Animaciones</h4>
                  <Switch checked={settings.enable_animations !== false} onCheckedChange={(v: boolean) => setSettings({...settings, enable_animations: v})} className="scale-75 data-[state=checked]:bg-slate-900" />
               </div>

               {settings.enable_animations !== false && (
                 <div className="space-y-4">
                    <div className="space-y-1.5">
                       <Label className="text-[9px] font-bold uppercase text-slate-500">Estilo</Label>
                       <select 
                         value={settings.entry_animation || 'fade-up'} 
                         onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSettings({...settings, entry_animation: e.target.value})}
                         className="w-full h-9 border border-slate-200 bg-slate-50 rounded-lg px-3 text-[11px] outline-none"
                       >
                         <option value="fade-up">Fade Up</option>
                         <option value="zoom-in">Zoom In</option>
                         <option value="fade-in">Fade In</option>
                       </select>
                    </div>
                    <SliderControl 
                       label="Duración (ms)" 
                       value={settings.animation_duration || 800} 
                       min={300} max={1500} step={100}
                       onChange={(v: number) => setSettings({...settings, animation_duration: v})} 
                    />
                 </div>
               )}
            </div>
          </div>
        )}

        {/* ===================== TAB: ADVANCED ===================== */}
        {activeTab === 'advanced' && (
          <div className="px-10 py-6 space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Configuración SEO</h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Meta Title</Label>
                    <Input value={settings.meta_title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, meta_title: e.target.value})} className="h-9 rounded-lg bg-slate-50 border-none text-[11px]" placeholder="Título para buscadores..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Meta Description</Label>
                    <textarea 
                      value={settings.meta_description || ''} 
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({...settings, meta_description: e.target.value})} 
                      className="w-full min-h-[80px] p-3 text-[11px] bg-slate-50 border-none rounded-xl text-slate-700 outline-none focus:ring-1 focus:ring-slate-200"
                      placeholder="Descripción para Google..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Favicon URL</Label>
                    <Input value={settings.favicon_url || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, favicon_url: e.target.value})} className="h-9 rounded-lg bg-slate-50 border-none text-[11px]" placeholder="https://..." />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Inyección de Código</h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Custom CSS</Label>
                    <textarea 
                      value={settings.custom_css || ''} 
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({...settings, custom_css: e.target.value})} 
                      className="w-full h-32 p-3 text-[10px] font-mono bg-slate-900 text-slate-300 border-none rounded-xl outline-none focus:ring-1 focus:ring-slate-700"
                      placeholder=".header { ... }"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Scripts &lt;head&gt;</Label>
                    <textarea 
                      value={settings.head_scripts || ''} 
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({...settings, head_scripts: e.target.value})} 
                      className="w-full h-32 p-3 text-[10px] font-mono bg-slate-900 text-slate-300 border-none rounded-xl outline-none focus:ring-1 focus:ring-slate-700"
                      placeholder="<script> ... </script>"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FIXED BOTTOM ACTION BAR */}
      <div className="px-8 py-6 border-t border-slate-100 bg-white shrink-0 flex items-center gap-4 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <Button 
            variant="outline"
            onClick={onBack}
            className="flex-[0.4] h-12 rounded-xl border-slate-200 text-slate-900 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all active:scale-95"
          >
            Salir
          </Button>
          
          <Button 
            onClick={onSave}
            disabled={isSaving}
            className={cn(
              "flex-[0.6] h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all",
              isSaved 
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                : "bg-slate-900 text-white hover:bg-black",
              "active:scale-95 shadow-lg shadow-black/5"
            )}
          >
            {isSaving ? 'Guardando...' : isSaved ? '✓ PUBLICADO' : 'PUBLICAR'}
          </Button>
      </div>


    </aside>
  )
}

function AccordionSection({ title, isOpen, onToggle, children, icon: Icon, isActive, onActiveChange }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode, icon: any, isActive?: boolean, onActiveChange?: (v: boolean) => void }) {
  return (
    <div className={cn(
      "border border-slate-100 rounded-xl transition-all overflow-hidden",
      isOpen ? "bg-slate-50/50" : "bg-white"
    )}>
      <div className="flex items-center px-4 h-12 bg-white">
        {onActiveChange && (
            <Switch 
              checked={!!isActive} 
              onCheckedChange={(v: boolean) => onActiveChange(v)} 
              className="scale-75 data-[state=checked]:bg-slate-900"
            />
        )}
        <button 
          onClick={onToggle}
          className={cn(
            "flex-1 flex items-center justify-between px-2 text-left",
            !isActive && onActiveChange && "opacity-40"
          )}
        >
          <div className="flex items-center gap-3">
             <Icon size={14} className={isOpen ? "text-slate-900" : "text-slate-400"} />
             <span className={cn(
               "text-[10px] font-bold uppercase tracking-wider transition-colors",
               isOpen ? "text-slate-900" : "text-slate-500"
             )}>
               {title}
             </span>
          </div>
          <ChevronDown size={14} className={cn("transition-transform", isOpen ? "rotate-180" : "")} />
        </button>
      </div>
      {isOpen && (
        <div className="p-5 border-t border-slate-100">
           {children}
        </div>
      )}
    </div>
  )
}

function ColorPicker({ label, value, onChange }: { label: string, value: string, onChange: (c: string) => void }) {
  return (
     <div className="space-y-2">
      <Label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</Label>
      <div className="flex gap-2">
        <div className="relative h-9 w-9 rounded-lg border border-slate-200 overflow-hidden shrink-0">
          <input 
            type="color" 
            value={value?.startsWith('#') ? value : '#000000'} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            className="absolute inset-0 h-[150%] w-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
          />
        </div>
        <Input 
          value={value || ''} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          className="h-9 rounded-lg bg-slate-50 border-none text-[10px] font-mono uppercase"
          placeholder="#HEX"
        />
      </div>
    </div>
  )
}

function SliderControl({ label, value, min, max, step = 1, onChange }: { label: string, value: number, min: number, max: number, step?: number, onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center px-1">
          <Label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</Label>
          <span className="text-[9px] font-bold text-slate-900">{value}</span>
       </div>
       <input 
          type="range" 
          min={min} max={max} step={step} value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-100 rounded-full appearance-none cursor-pointer accent-slate-900"
       />
    </div>
  )
}
