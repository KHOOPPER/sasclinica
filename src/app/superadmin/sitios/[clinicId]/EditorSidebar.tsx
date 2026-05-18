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
  Navigation,
  Minimize,
  ArrowUp,
  ArrowDown,
  GripVertical,
  ArrowLeft,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

import { VariantSelector } from '@/components/editor/VariantSelector'
import { ImageUploader } from '@/components/editor/ImageUploader'

type EditorTab = 'content' | 'design' | 'structure' | 'advanced'

interface EditorSidebarProps {
  settings: any
  setSettings: (settings: any) => void
  clinic: any
  onSave: () => void
  isSaving: boolean
  isSaved: boolean
  onBack: () => void
  onClose?: () => void
  expandedSectionExternal?: string | null
}

export function EditorSidebar({ settings, setSettings, clinic, onSave, isSaving, isSaved, onBack, onClose, expandedSectionExternal }: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('content')
  const [expandedSection, setExpandedSection] = useState<string | null>('header')
  const [currentPage, setCurrentPage] = useState('inicio')

  React.useEffect(() => {
    if (expandedSectionExternal) {
      setExpandedSection(expandedSectionExternal)
      setActiveTab('content')
    }
  }, [expandedSectionExternal])

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
    { id: 'gradient', label: 'Left Aligned', icon: PanelTop, description: 'Texto a la izquierda con degradado.' },
    { id: 'apple', label: 'Apple Pro Style', icon: Monitor, description: 'Tipografía masiva y animaciones profundas.' },
    { id: 'minimal', label: 'Split Modern', icon: Maximize, description: 'Imagen lateral y texto limpio.' },
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
    { id: 'minimal', label: 'Modern Minimal', icon: PanelTop, description: 'Minimalismo de alto contraste.' },
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
    { id: 'grid', label: 'Grid Modern', icon: Layout },
    { id: 'list', label: 'Lista Clean', icon: Layers },
    { id: 'elite', label: 'Elite Cards', icon: Sparkles },
    { id: 'minimal', label: 'Minimal Dot', icon: Square },
  ]

  const serviceVariants = [
    { id: 'grid', label: 'Cards Modern', icon: Layout },
    { id: 'list', label: 'List Clean', icon: Layers },
    { id: 'elite-dark', label: 'Elite Dark', icon: Monitor },
    { id: 'minimal', label: 'Minimalist', icon: Square },
  ]

  const galleryVariants = [
    { id: 'grid', label: 'Grid', icon: Layout },
    { id: 'masonry', label: 'Masonry', icon: Layers },
    { id: 'carousel', label: 'Carrusel', icon: ChevronRight },
    { id: 'lightbox', label: 'Lightbox', icon: Maximize },
  ]

  const teamVariants = [
    { id: 'cards', label: 'Modern Cards', icon: Component },
    { id: 'horizontal', label: 'Row List', icon: Layers },
    { id: 'elite', label: 'Elite Profiles', icon: Sparkles },
    { id: 'minimal', label: 'Minimal Circles', icon: Square },
  ]

  const animationVariants = [
    { id: 'fade-up', label: 'Arriba', icon: ChevronUp },
    { id: 'fade-in', label: 'Fundido', icon: Eye },
    { id: 'zoom-in', label: 'Zoom In', icon: Maximize },
    { id: 'slide-left', label: 'Izquierda', icon: ChevronLeft },
    { id: 'slide-right', label: 'Derecha', icon: ChevronRight },
  ]

  const spacingVariants = [
    { id: 'compact', label: 'Compacto', icon: Minimize },
    { id: 'relaxed', label: 'Relajado', icon: Layout },
    { id: 'loose', label: 'Espacioso', icon: Maximize },
  ]

  const fontFamilies = [
    { id: 'Manrope', name: 'Manrope', category: 'Moderno' },
    { id: 'Inter', name: 'Inter', category: 'UI / Clean' },
    { id: 'Outfit', name: 'Outfit', category: 'Geométrico' },
    { id: 'Plus Jakarta Sans', name: 'Jakarta Sans', category: 'Editorial' },
    { id: 'DM Sans', name: 'DM Sans', category: 'Humanista' },
    { id: 'Sora', name: 'Sora', category: 'Tecnológico' },
    { id: 'Raleway', name: 'Raleway', category: 'Elegante' },
    { id: 'Nunito', name: 'Nunito', category: 'Amigable' },
  ]

  // Professional color palettes for clinics
  const colorPalettes = [
    { id: 'cobalt',    name: 'Cobalt',    primary: '#2563eb', accent: '#60a5fa', bg: '#ffffff', text: '#0f172a' },
    { id: 'emerald',   name: 'Esmeralda', primary: '#059669', accent: '#34d399', bg: '#ffffff', text: '#0f172a' },
    { id: 'violet',    name: 'Violeta',   primary: '#7c3aed', accent: '#a78bfa', bg: '#ffffff', text: '#0f172a' },
    { id: 'rose',      name: 'Rosa',      primary: '#e11d48', accent: '#fb7185', bg: '#ffffff', text: '#0f172a' },
    { id: 'amber',     name: 'Ámbar',     primary: '#d97706', accent: '#fbbf24', bg: '#ffffff', text: '#0f172a' },
    { id: 'teal',      name: 'Teal',      primary: '#0d9488', accent: '#2dd4bf', bg: '#ffffff', text: '#0f172a' },
    { id: 'slate',     name: 'Pizarra',   primary: '#334155', accent: '#64748b', bg: '#f8fafc', text: '#0f172a' },
    { id: 'navy',      name: 'Navy',      primary: '#1e3a8a', accent: '#3b82f6', bg: '#ffffff', text: '#0f172a' },
    { id: 'forest',    name: 'Bosque',    primary: '#166534', accent: '#22c55e', bg: '#f0fdf4', text: '#14532d' },
    { id: 'midnight',  name: 'Midnight',  primary: '#6d28d9', accent: '#8b5cf6', bg: '#0f0f1a', text: '#e2e8f0' },
  ]

  const applyPalette = (palette: typeof colorPalettes[0]) => {
    setSettings({
      ...settings,
      primary_color: palette.primary,
      accent_color: palette.accent,
      bg_main: palette.bg,
      text_main: palette.text,
    })
  }

  const whatsappPositions = [
    { id: 'bottom-right', label: 'Inferior derecha' },
    { id: 'bottom-left',  label: 'Inferior izquierda' },
    { id: 'top-right',    label: 'Superior derecha' },
    { id: 'top-left',     label: 'Superior izquierda' },
  ]
  return (
    <aside className="w-full h-full bg-[#0f0f11] border-r border-white/5 flex flex-col z-20 overflow-hidden relative text-white">
       {/* Mobile Close Button */}
       {onClose && (
         <button 
           onClick={onClose}
           className="md:hidden absolute top-6 right-6 z-50 w-10 h-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all shadow-2xl"
         >
           <X size={20} />
         </button>
       )}
      <div className="h-20 px-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#161618]">
         <div className="flex items-center gap-2 mt-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              title="Salir"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-[11px] font-black text-white shadow-lg shadow-emerald-500/20">B</div>
         </div>

         <div className="flex items-center gap-2 mt-4">
            <button
              onClick={onSave}
              disabled={isSaving}
              className={cn(
                'h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all',
                isSaved
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white text-black hover:bg-slate-100'
              )}
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> :
               isSaved  ? <CheckCircle2 size={14} /> :
                          <Save size={14} />}
              {isSaving ? '...' : isSaved ? 'OK' : 'Publicar'}
            </button>
            {onClose && (
              <button 
                onClick={onClose}
                className="md:hidden w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white"
              >
                <X size={18} />
              </button>
            )}
         </div>
      </div>

      <div className="flex border-b border-white/5 bg-[#161618] shrink-0 px-2 md:px-4 overflow-x-auto scrollbar-hide">
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
              "flex-1 py-5 text-[8px] font-black uppercase tracking-[0.2em] flex flex-col items-center justify-center gap-2 transition-all relative",
              activeTab === tab.id ? "text-emerald-400" : "text-slate-500 hover:text-slate-300"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all",
              activeTab === tab.id ? "bg-emerald-500/10" : "bg-transparent"
            )}>
              <tab.icon size={16} />
            </div>
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-emerald-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        
        {/* ===================== TAB: CONTENT ===================== */}
        {activeTab === 'content' && (
          <div className="px-4 py-4 md:px-8 md:py-6 space-y-3 md:space-y-4">
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
                  <div className="space-y-3 md:space-y-4 pt-4 border-t border-slate-100">
                    <ImageUploader
                       label="Logo de la Clinica"
                       value={settings.logo_url || ''}
                       onChange={(url: string) => setSettings({...settings, logo_url: url})}
                       bucket="clinic-assets"
                       folder="logos"
                       aspectRatio="landscape"
                       hint="PNG/SVG con fondo transparente"
                     />
                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <SliderControl label="Ancho Logo" value={settings.logo_width || 150} min={40} max={250} onChange={(v: number) => setSettings({...settings, logo_width: v})} />
                        <SliderControl label="Margen Y" value={settings.logo_padding_top || 0} min={-40} max={40} onChange={(v: number) => setSettings({...settings, logo_padding_top: v})} />
                    </div>
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="space-y-1.5">
                        <Label className="text-[9px] font-bold uppercase text-slate-500">Texto Botón</Label>
                        <Input value={settings.header_cta_text || ''} onChange={(e) => setSettings({...settings, header_cta_text: e.target.value})} className="h-8 bg-slate-50 border-none text-[10px] text-slate-900" placeholder="Agendar Cita" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[9px] font-bold uppercase text-slate-500">Enlaces de Navegación</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input value={settings.nav_link_1 || ''} onChange={(e) => setSettings({...settings, nav_link_1: e.target.value})} className="h-7 bg-slate-50 border-none text-[9px] text-slate-900" placeholder="Link 1" />
                          <Input value={settings.nav_link_2 || ''} onChange={(e) => setSettings({...settings, nav_link_2: e.target.value})} className="h-7 bg-slate-50 border-none text-[9px] text-slate-900" placeholder="Link 2" />
                          <Input value={settings.nav_link_3 || ''} onChange={(e) => setSettings({...settings, nav_link_3: e.target.value})} className="h-7 bg-slate-50 border-none text-[9px] text-slate-900" placeholder="Link 3" />
                          <Input value={settings.nav_link_4 || ''} onChange={(e) => setSettings({...settings, nav_link_4: e.target.value})} className="h-7 bg-slate-50 border-none text-[9px] text-slate-900" placeholder="Link 4" />
                        </div>
                      </div>
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
                    <ImageUploader
                       label="Imagen de Fondo del Hero"
                       value={settings.hero_image_url || ''}
                       onChange={(url: string) => setSettings({...settings, hero_image_url: url})}
                       bucket="clinic-assets"
                       folder="hero"
                       aspectRatio="landscape"
                       hint="Recomendado 1920x1080px"
                     />
                     <div className="space-y-1.5">
                        <Label className="text-[9px] font-bold uppercase text-slate-500">Título Principal</Label>
                        <textarea 
                          value={settings.hero_title || ''} 
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({...settings, hero_title: e.target.value})} 
                          className="w-full min-h-[60px] p-3 text-xs bg-slate-50 border-none rounded-xl text-slate-900" 
                          placeholder="Usa * para resaltar..."
                        />
                     </div>
                     <div className="space-y-1.5">
                        <Label className="text-[9px] font-bold uppercase text-slate-500">Subtítulo</Label>
                        <textarea 
                          value={settings.hero_subtitle || ''} 
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({...settings, hero_subtitle: e.target.value})} 
                          className="w-full min-h-[80px] p-3 text-xs bg-slate-50 border-none rounded-xl text-slate-900" 
                        />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <Input value={settings.hero_badge || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, hero_badge: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px] text-slate-900" placeholder="Badge" />
                        <Input value={settings.hero_cta_text || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, hero_cta_text: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px] text-slate-900" placeholder="Botón" />
                     </div>
                     
                     <div className="space-y-2 pt-3 border-t border-slate-100">
                        <Label className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Insignias de Confianza</Label>
                        <Input value={settings.trust_badge_1 || ''} onChange={(e: any) => setSettings({...settings, trust_badge_1: e.target.value})} className="h-8 bg-slate-50 border-none text-[10px] text-slate-900" placeholder="Insignia 1" />
                        <Input value={settings.trust_badge_2 || ''} onChange={(e: any) => setSettings({...settings, trust_badge_2: e.target.value})} className="h-8 bg-slate-50 border-none text-[10px] text-slate-900" placeholder="Insignia 2" />
                        <Input value={settings.trust_badge_3 || ''} onChange={(e: any) => setSettings({...settings, trust_badge_3: e.target.value})} className="h-8 bg-slate-50 border-none text-[10px] text-slate-900" placeholder="Insignia 3" />
                     </div>
                  </div>
               </div>
            </AccordionSection>

            {/* nosotros */}
            <AccordionSection 
              title="Sobre Nosotros" 
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
                        <Input value={settings.about_badge || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, about_badge: e.target.value})} className="h-9 bg-slate-50 border-none text-[10px] text-slate-900" placeholder="Experiencia" />
                        <Input value={settings.about_badge_subtext || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, about_badge_subtext: e.target.value})} className="h-9 bg-slate-50 border-none text-[10px] text-slate-900" placeholder="Texto" />
                     </div>
                     <textarea value={settings.about_description || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({...settings, about_description: e.target.value})} className="w-full min-h-[80px] p-3 text-[11px] bg-slate-50 border-none rounded-xl text-slate-900" />
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
                        <Input value={settings.promotions_title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, promotions_title: e.target.value})} className="h-8 bg-slate-50 border-none text-[10px] text-slate-900" placeholder="Título" />
                        <Input value={settings.promotions_badge || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, promotions_badge: e.target.value})} className="h-8 bg-slate-50 border-none text-[10px] text-slate-900" placeholder="Badge" />
                     </div>
                     <div className="space-y-2">
                        {(settings.promotions_data || []).map((p: any, i: number) => (
                           <div key={i} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg group">
                              <Input value={p.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                 const nd = [...settings.promotions_data]; nd[i].title = e.target.value; setSettings({...settings, promotions_data: nd})
                              }} className="h-7 bg-transparent border-none text-[10px] font-bold text-slate-900" />
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
                           }} className="h-8 bg-slate-50 border-none text-[10px] text-slate-900" />
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
                     <Input value={settings.services_title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, services_title: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px] text-slate-900" placeholder="Título" />
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
                  <Input value={settings.contact_address || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, contact_address: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px] text-slate-900" placeholder="Dirección" />
                  <Input value={settings.contact_phone || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, contact_phone: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px] text-slate-900" placeholder="Teléfono" />
                  <Input value={settings.contact_email || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, contact_email: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px] text-slate-900" placeholder="Email" />
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
                  
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <Label className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Información Principal</Label>
                      <Switch checked={settings.footer_show_info !== false} onCheckedChange={(v) => setSettings({...settings, footer_show_info: v})} className="scale-50" />
                    </div>
                    {settings.footer_show_info !== false && (
                      <div className="space-y-2">
                        <Input value={settings.footer_info_title || ''} onChange={(e) => setSettings({...settings, footer_info_title: e.target.value})} className="h-8 bg-slate-50 border-none text-[10px] text-slate-900" placeholder="Título de info..." />
                        <textarea value={settings.footer_info_desc || ''} onChange={(e) => setSettings({...settings, footer_info_desc: e.target.value})} className="w-full min-h-[50px] p-2 text-[10px] bg-slate-50 border-none rounded-lg text-slate-900" placeholder="Descripción breve..." />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <Label className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Navegación</Label>
                      <Switch checked={settings.footer_show_nav !== false} onCheckedChange={(v) => setSettings({...settings, footer_show_nav: v})} className="scale-50" />
                    </div>
                    {settings.footer_show_nav !== false && (
                      <div className="space-y-2">
                        <Input value={settings.footer_nav_title || ''} onChange={(e) => setSettings({...settings, footer_nav_title: e.target.value})} className="h-8 bg-slate-50 border-none text-[10px] text-slate-900 font-bold" placeholder="Título Navegación" />
                        <div className="grid grid-cols-2 gap-2">
                          <Input value={settings.footer_nav_1_label || ''} onChange={(e) => setSettings({...settings, footer_nav_1_label: e.target.value})} className="h-7 bg-slate-50 border-none text-[9px] text-slate-900" placeholder="Link 1" />
                          <Input value={settings.footer_nav_2_label || ''} onChange={(e) => setSettings({...settings, footer_nav_2_label: e.target.value})} className="h-7 bg-slate-50 border-none text-[9px] text-slate-900" placeholder="Link 2" />
                          <Input value={settings.footer_nav_3_label || ''} onChange={(e) => setSettings({...settings, footer_nav_3_label: e.target.value})} className="h-7 bg-slate-50 border-none text-[9px] text-slate-900" placeholder="Link 3" />
                          <Input value={settings.footer_nav_4_label || ''} onChange={(e) => setSettings({...settings, footer_nav_4_label: e.target.value})} className="h-7 bg-slate-50 border-none text-[9px] text-slate-900" placeholder="Link 4" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <Label className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Horarios y Citas</Label>
                      <Switch checked={settings.footer_show_schedule !== false} onCheckedChange={(v) => setSettings({...settings, footer_show_schedule: v})} className="scale-50" />
                    </div>
                    {settings.footer_show_schedule !== false && (
                      <div className="space-y-2">
                        <Input value={settings.footer_schedule_title || ''} onChange={(e) => setSettings({...settings, footer_schedule_title: e.target.value})} className="h-8 bg-slate-50 border-none text-[10px] text-slate-900 font-bold" placeholder="Título Horarios" />
                        <Input value={settings.footer_schedule_weekdays_label || ''} onChange={(e) => setSettings({...settings, footer_schedule_weekdays_label: e.target.value})} className="h-7 bg-slate-50 border-none text-[9px] text-slate-900" placeholder="L-V..." />
                        <Input value={settings.footer_schedule_weekends_label || ''} onChange={(e) => setSettings({...settings, footer_schedule_weekends_label: e.target.value})} className="h-7 bg-slate-50 border-none text-[9px] text-slate-900" placeholder="Sábados..." />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <Input value={settings.footer_text || ''} onChange={(e) => setSettings({...settings, footer_text: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px] text-slate-900" placeholder="© 2026..." />
                  </div>
                </div>
            </AccordionSection>

            {/* WhatsApp Button */}
            <AccordionSection 
              title="WhatsApp" 
              isOpen={expandedSection === 'whatsapp'} 
              onToggle={() => toggleSection('whatsapp')}
              icon={MessageCircle}
              isActive={settings.show_whatsapp === true}
              onActiveChange={(v: boolean) => setSettings({...settings, show_whatsapp: v})}
            >
               <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Número (con código país)</Label>
                    <Input 
                      value={settings.whatsapp_number || ''} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, whatsapp_number: e.target.value})} 
                      className="h-9 bg-slate-50 border-none text-[11px] text-slate-900" 
                      placeholder="+506 8888-8888" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Mensaje de bienvenida</Label>
                    <textarea 
                      value={settings.whatsapp_message || ''} 
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({...settings, whatsapp_message: e.target.value})} 
                      className="w-full min-h-[60px] p-3 text-[11px] bg-slate-50 border-none rounded-xl outline-none text-slate-900" 
                      placeholder="Hola! Me gustaría agendar una cita..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Posición del botón</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {whatsappPositions.map(pos => (
                         <button
                           key={pos.id}
                           onClick={() => setSettings({...settings, whatsapp_position: pos.id})}
                           className={cn(
                             'py-2 px-3 rounded-lg text-[9px] font-bold border transition-all',
                             (settings.whatsapp_position || 'bottom-right') === pos.id
                               ? 'bg-slate-900 text-white border-slate-900'
                               : 'border-slate-200 text-slate-500 hover:border-slate-400'
                           )}
                         >
                           {pos.label}
                         </button>
                       ))}
                     </div>
                   </div>
                </div>
             </AccordionSection>

            {/* GALERÍA */}
            <AccordionSection 
              title="Galería" 
              isOpen={expandedSection === 'gallery'} 
              onToggle={() => toggleSection('gallery')}
              icon={ImageIcon}
              isActive={settings.active_sections ? settings.active_sections.includes('gallery') : false}
              onActiveChange={(v: boolean) => toggleSectionActivation('gallery', v)}
            >
               <div className="space-y-4">
                  <VariantSelector 
                    options={galleryVariants}
                    selected={settings.gallery_variant || 'grid'}
                    onChange={(id: string) => setSettings({...settings, gallery_variant: id})}
                  />
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <Input value={settings.gallery_title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, gallery_title: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px] text-slate-900" placeholder="Nuestras Instalaciones" />
                    <Input value={settings.gallery_subtitle || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, gallery_subtitle: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px] text-slate-900" placeholder="Subtítulo..." />
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Imágenes</p>
                    <div className="space-y-2">
                      {(settings.gallery_images || []).map((img: any, i: number) => (
                        <div key={i} className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl group">
                          {img.url && <img src={img.url} alt="" className="w-10 h-8 object-cover rounded-lg shrink-0" />}
                          <Input value={img.url || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => { const nd = [...(settings.gallery_images || [])]; nd[i] = {...nd[i], url: e.target.value}; setSettings({...settings, gallery_images: nd}) }} className="h-7 bg-transparent border-none text-[10px] flex-1 text-slate-900" placeholder="URL de imagen..." />
                          <button onClick={() => { const nd = [...(settings.gallery_images || [])]; nd.splice(i, 1); setSettings({...settings, gallery_images: nd}) }} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all shrink-0"><Trash2 size={10}/></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setSettings({...settings, gallery_images: [...(settings.gallery_images || []), {url: '', caption: ''}]})} className="w-full py-2 border border-dashed border-slate-200 rounded-xl text-[9px] font-bold uppercase text-slate-400 hover:border-slate-400 transition-all">
                      + Añadir imagen
                    </button>
                  </div>
               </div>
            </AccordionSection>

            <AccordionSection 
              title="Equipo Médico" 
              isOpen={expandedSection === 'team'} 
              onToggle={() => toggleSection('team')}
              icon={Stethoscope}
              isActive={settings.active_sections ? settings.active_sections.includes('team') : false}
              onActiveChange={(v: boolean) => toggleSectionActivation('team', v)}
            >
               <div className="space-y-4">
                  <VariantSelector 
                    options={teamVariants}
                    selected={settings.team_variant || 'cards'}
                    onChange={(id: string) => setSettings({...settings, team_variant: id})}
                  />
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <Input value={settings.team_title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, team_title: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px] text-slate-900" placeholder="Nuestro Equipo" />
                    <Input value={settings.team_subtitle || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, team_subtitle: e.target.value})} className="h-9 bg-slate-50 border-none text-[11px] text-slate-900" placeholder="Subtítulo..." />
                    <p className="text-[9px] text-slate-400 italic px-1">El equipo se carga automáticamente desde el panel de staff de la clínica.</p>
                  </div>
               </div>
            </AccordionSection>
          </div>
        )}

        {/* ===================== TAB: DESIGN (BRANDING) ===================== */}
        {activeTab === 'design' && (
          <div className="px-4 py-6 md:px-8 space-y-8">
            
            {/* COLOR PALETTES */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Temas Predefinidos</h4>
              <div className="grid grid-cols-5 gap-2">
                {colorPalettes.map(p => (
                  <button
                    key={p.id}
                    onClick={() => applyPalette(p)}
                    title={p.name}
                    className={cn(
                      'group relative h-10 rounded-xl border-2 overflow-hidden transition-all hover:scale-105 active:scale-95',
                      settings.primary_color === p.primary ? 'border-slate-900 shadow-md' : 'border-transparent'
                    )}
                    style={{ background: `linear-gradient(135deg, ${p.primary} 50%, ${p.accent} 100%)` }}
                  >
                    {settings.primary_color === p.primary && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check size={12} className="text-white drop-shadow" />
                      </div>
                    )}
                    <span className="sr-only">{p.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-slate-400 text-center">Haz clic en un tema o personaliza abajo</p>
            </div>

            {/* CUSTOM COLORS */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Colores Personalizados</h4>
               <div className="grid grid-cols-1 gap-3">
                 <ColorPicker label="Color Principal" value={settings.primary_color || '#2563eb'} onChange={(c: string) => setSettings({...settings, primary_color: c})} />
                 <ColorPicker label="Color Acento" value={settings.accent_color || '#60a5fa'} onChange={(c: string) => setSettings({...settings, accent_color: c})} />
                 <ColorPicker label="Fondo Página" value={settings.bg_main || '#ffffff'} onChange={(c: string) => setSettings({...settings, bg_main: c})} />
                 <ColorPicker label="Color Texto" value={settings.text_main || '#0f172a'} onChange={(c: string) => setSettings({...settings, text_main: c})} />
               </div>
            </div>

            {/* TYPOGRAPHY */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
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
                        <option key={f.id} value={f.id}>{f.name} — {f.category}</option>
                      ))}
                    </select>
                    {/* Live Preview */}
                    <div 
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                      style={{ fontFamily: settings.font_headlines || 'Manrope' }}
                    >
                      <p className="text-base font-black text-slate-900 leading-tight">Título de Ejemplo</p>
                      <p className="text-[10px] text-slate-400">Vista previa del titular</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Fuente Cuerpo</Label>
                    <select 
                      value={settings.font_body || 'Inter'} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSettings({...settings, font_body: e.target.value})}
                      className="w-full h-9 border border-slate-200 bg-slate-50 rounded-lg px-3 text-[11px] outline-none"
                    >
                      {fontFamilies.map(f => (
                        <option key={f.id} value={f.id}>{f.name} — {f.category}</option>
                      ))}
                    </select>
                    {/* Live Preview */}
                    <div 
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                      style={{ fontFamily: settings.font_body || 'Inter' }}
                    >
                      <p className="text-xs text-slate-700 leading-relaxed">
                        El equipo médico de nuestra clínica está comprometido con tu bienestar.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <SliderControl label="Tamaño base" value={settings.font_size_base || 16} min={12} max={22} onChange={(v: number) => setSettings({...settings, font_size_base: v})} />
                    <SliderControl label="Interlineado" value={Math.round((settings.line_height || 1.6) * 10)} min={12} max={20} onChange={(v: number) => setSettings({...settings, line_height: v / 10})} />
                  </div>
               </div>
            </div>

            {/* ANIMATIONS */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Animaciones</h4>
                  <Switch checked={settings.enable_animations !== false} onCheckedChange={(v: boolean) => setSettings({...settings, enable_animations: v})} className="scale-75 data-[state=checked]:bg-slate-900" />
               </div>
               {settings.enable_animations !== false && (
                 <div className="grid grid-cols-2 gap-2">
                   {[
                     { id: 'fade-up',  label: 'Fade Up' },
                     { id: 'zoom-in',  label: 'Zoom In' },
                     { id: 'fade-in',  label: 'Fade In' },
                     { id: 'slide-in', label: 'Slide In' },
                   ].map(a => (
                     <button
                       key={a.id}
                       onClick={() => setSettings({...settings, entry_animation: a.id})}
                       className={cn(
                         'py-2 rounded-xl text-[9px] font-bold border transition-all',
                         (settings.entry_animation || 'fade-up') === a.id
                           ? 'bg-slate-900 text-white border-slate-900'
                           : 'border-slate-200 text-slate-500 hover:border-slate-400'
                       )}
                     >
                       {a.label}
                     </button>
                   ))}
                 </div>
               )}
            </div>
          </div>
        )}

        {/* ===================== TAB: STRUCTURE (ORDER) ===================== */}
        {activeTab === 'structure' && (
          <div className="px-6 py-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Orden de Secciones</h4>
                <p className="text-[9px] text-slate-400 italic">Arrastra o usa las flechas para reordenar la estructura visual.</p>
              </div>
              
              <div className="space-y-2">
                {(settings.active_sections || ['header', 'hero', 'promos', 'about', 'services', 'specialties', 'testimonials', 'contact', 'footer', 'gallery', 'team']).map((id: string, index: number, arr: string[]) => {
                  const sectionLabels: Record<string, string> = {
                    header: 'Navegación',
                    hero: 'Portada / Hero',
                    promos: 'Promociones',
                    about: 'Sobre Nosotros',
                    services: 'Servicios Médicos',
                    specialties: 'Especialidades',
                    testimonials: 'Testimonios',
                    contact: 'Contacto / Mapa',
                    footer: 'Pie de Página',
                    gallery: 'Galería de Fotos',
                    team: 'Nuestro Equipo'
                  }
                  
                  return (
                    <div 
                      key={id} 
                      className={cn(
                        "flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl group transition-all",
                        "hover:border-slate-300 hover:shadow-sm"
                      )}
                    >
                      <GripVertical size={12} className="text-slate-300 cursor-grab active:cursor-grabbing" />
                      <span className="flex-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        {sectionLabels[id] || id}
                      </span>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          disabled={index === 0}
                          onClick={() => {
                            const newOrder = [...arr]
                            const [moved] = newOrder.splice(index, 1)
                            newOrder.splice(index - 1, 0, moved)
                            setSettings({...settings, active_sections: newOrder})
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 disabled:opacity-20"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button 
                          disabled={index === arr.length - 1}
                          onClick={() => {
                            const newOrder = [...arr]
                            const [moved] = newOrder.splice(index, 1)
                            newOrder.splice(index + 1, 0, moved)
                            setSettings({...settings, active_sections: newOrder})
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 disabled:opacity-20"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[9px] text-slate-500 leading-relaxed font-medium">
                 <span className="font-bold text-slate-900 block mb-1">PRO TIP:</span>
                 El orden que definas aquí se reflejará instantáneamente en el menú de navegación y en el flujo del sitio.
               </p>
            </div>
          </div>
        )}
        {activeTab === 'advanced' && (
          <div className="px-10 py-6 space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Configuración URL y SEO</h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-emerald-500">Slug de la URL (Ej: clinica-perez)</Label>
                    <Input 
                      value={settings.slug || ''} 
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} 
                      className="h-9 rounded-lg bg-white border border-emerald-100 text-[11px] text-slate-900 font-bold" 
                      placeholder="slug-de-la-clinica" 
                    />
                    <p className="text-[8px] text-slate-400">Esta es la dirección de tu sitio web.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Meta Title</Label>
                    <Input value={settings.meta_title || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, meta_title: e.target.value})} className="h-9 rounded-lg bg-slate-50 border-none text-[11px] text-slate-900" placeholder="Título para buscadores..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Meta Description</Label>
                    <textarea 
                      value={settings.meta_description || ''} 
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSettings({...settings, meta_description: e.target.value})} 
                      className="w-full min-h-[80px] p-3 text-[11px] bg-slate-50 border-none rounded-xl text-slate-700 outline-none focus:ring-1 focus:ring-slate-200 text-slate-900"
                      placeholder="Descripción para Google..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-slate-500">Favicon URL</Label>
                    <Input value={settings.favicon_url || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSettings({...settings, favicon_url: e.target.value})} className="h-9 rounded-lg bg-slate-50 border-none text-[11px] text-slate-900" placeholder="https://..." />
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

    </aside>
  )
}

function AccordionSection({ title, isOpen, onToggle, children, icon: Icon, isActive, onActiveChange }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode, icon: any, isActive?: boolean, onActiveChange?: (v: boolean) => void }) {
  return (
    <div className={cn(
      "border border-slate-100 rounded-xl transition-all overflow-hidden",
      isOpen ? "bg-slate-50/50" : "bg-white"
    )}>
      <div className="flex items-center px-3 md:px-4 h-11 md:h-12 bg-white">
        {onActiveChange && (
            <Switch 
              checked={!!isActive} 
              onCheckedChange={(v: boolean) => onActiveChange(v)} 
              className="scale-[0.65] md:scale-75 data-[state=checked]:bg-slate-900 shrink-0"
            />
        )}
        <button 
          onClick={onToggle}
          className={cn(
            "flex-1 flex items-center justify-between pl-2 md:pl-3 text-left",
            !isActive && onActiveChange && "opacity-40"
          )}
        >
          <div className="flex items-center gap-2 md:gap-3">
             <Icon size={13} className={isOpen ? "text-slate-900" : "text-slate-400"} />
             <span className={cn(
               "text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-colors",
               isOpen ? "text-slate-900" : "text-slate-500"
             )}>
               {title}
             </span>
          </div>
          <ChevronDown size={13} className={cn("transition-transform", isOpen ? "rotate-180" : "")} />
        </button>
      </div>
      {isOpen && (
        <div className="p-3 md:p-5 border-t border-slate-100">
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
          className="h-9 rounded-lg bg-slate-50 border-none text-[10px] font-mono uppercase text-slate-900"
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
