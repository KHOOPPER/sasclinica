'use client'

import { useState } from 'react'
import { Save, CheckCircle, Map as MapIcon, Layout, Palette, Type, Globe, AlertCircle } from 'lucide-react'
import { updateSiteSettings } from './actions'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function SiteSettingsForm({ settings }: { settings: any }) {
  const [isPending, setIsPending] = useState(false)
  
  // Defensive state initialization
  const [layout, setLayout] = useState(settings?.contact_layout || 'split')
  const [mapStyle, setMapStyle] = useState(settings?.map_style || 'standard')
  const [bgColor, setBgColor] = useState(settings?.contact_bg_color || '')
  const [textColor, setTextColor] = useState(settings?.contact_text_color || '')

  if (!settings) {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl">
        <AlertCircle size={20} />
        <span className="text-sm font-bold">Error: Datos de configuración no disponibles.</span>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    
    try {
        const formData = new FormData(e.currentTarget)
        // Add state-managed fields to formData
        formData.set('contact_layout', layout)
        formData.set('map_style', mapStyle)
        formData.set('contact_bg_color', bgColor)
        formData.set('contact_text_color', textColor)

        const result = await updateSiteSettings(formData)
        
        if (result.success) {
          toast.success('¡Configuración actualizada con éxito!')
        } else {
          toast.error(result.error || 'No se pudo guardar la configuración')
        }
    } catch (err) {
        console.error('Submit Error:', err)
        toast.error('Ocurrió un error inesperado al guardar')
    } finally {
        setIsPending(false)
    }
  }

  // Helper to get preview colors
  const getPreviewBg = () => bgColor || (layout === 'split' ? '#0f172a' : '#ffffff')
  const getPreviewText = () => textColor || (layout === 'split' ? '#ffffff' : '#0f172a')

  return (
    <form onSubmit={handleSubmit} className="space-y-16">
      {/* SECTION: TEXTOS */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/5">
                <Type size={24} />
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Identidad y Mensajes</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Personaliza cómo te presentas ante tus pacientes</p>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título Principal (Contacto)</Label>
                <Input 
                    name="contact_title"
                    defaultValue={settings.contact_title || 'Nuestra Sede'}
                    placeholder="Ej. Encuéntranos en..."
                    className="h-16 bg-slate-50 border-none rounded-[1.25rem] px-8 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-600/5 transition-all"
                />
            </div>
            <div className="space-y-3">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtítulo Descriptivo</Label>
                <Input 
                    name="contact_subtitle"
                    defaultValue={settings.contact_subtitle || 'Estamos aquí para cuidarte.'}
                    placeholder="Ej. Horarios de atención y ubicación exacta..."
                    className="h-16 bg-slate-50 border-none rounded-[1.25rem] px-8 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-600/5 transition-all"
                />
            </div>
        </div>
      </div>

      {/* SECTION: DISEÑO DE SECCIÓN */}
      <div className="pt-12 border-t border-slate-100/60 overflow-visible">
        <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/5">
                <Layout size={24} />
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Diseño de la Sección</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Elige el layout que mejor se adapte a tu marca</p>
            </div>
        </div>
        
        <div className="space-y-10">
            {/* Layout Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { id: 'split', label: 'Split Clásico', desc: 'Mapa a un lado, info al otro. Ideal para legibilidad máxima.' },
                    { id: 'fullmap', label: 'Elite Full Map', desc: 'El mapa llena el fondo con una tarjeta informativa flotante.' },
                    { id: 'centered', label: 'Centro Minimal', desc: 'Todo centrado y espacioso. Diseño muy moderno y limpio.' }
                ].map(l => (
                    <button
                        key={l.id}
                        type="button"
                        onClick={() => setLayout(l.id)}
                        className={cn(
                            "group p-8 rounded-[2rem] border-2 text-left transition-all duration-500 relative overflow-hidden",
                            layout === l.id 
                                ? "bg-amber-50 border-amber-500 shadow-2xl shadow-amber-500/10 scale-[1.03]" 
                                : "bg-white border-slate-100 hover:border-amber-200 hover:scale-[1.01]"
                        )}
                    >
                        <div className="flex h-10 items-center justify-between mb-4">
                            <p className={cn("text-[11px] font-black uppercase tracking-widest", layout === l.id ? "text-amber-600" : "text-slate-400 group-hover:text-amber-400")}>{l.label}</p>
                            {layout === l.id && <CheckCircle size={18} className="text-amber-500" />}
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 leading-relaxed pr-4">{l.desc}</p>
                    </button>
                ))}
            </div>

            {/* Map Styles Selector */}
            <div className="space-y-6 pt-6 bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50">
                <div className="flex items-center gap-3">
                    <MapIcon size={16} className="text-blue-500" />
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estilo Visual del Mapa (Google Maps API filters)</Label>
                </div>
                <div className="flex flex-wrap gap-3">
                    {[
                        { id: 'standard', label: 'Normal' },
                        { id: 'silver', label: 'Plata' },
                        { id: 'dark', label: 'Oscuro' },
                        { id: 'night', label: 'Noche' },
                        { id: 'retro', label: 'Retro' },
                        { id: 'aubergine', label: 'Berenjena' },
                        { id: 'minimal', label: 'Mínimo' }
                    ].map(s => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => setMapStyle(s.id)}
                            className={cn(
                                "px-6 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                mapStyle === s.id 
                                    ? "bg-slate-900 text-white shadow-xl shadow-slate-950/20 scale-110 z-10" 
                                    : "bg-white text-slate-400 border border-slate-100 hover:border-slate-200 hover:text-slate-600"
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* SECTION: COLORES */}
      <div className="pt-12 border-t border-slate-100/60">
        <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/5">
                <Palette size={24} />
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Colores Personalizados</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Ajusta los tonos para que combine con el logo de tu clínica</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Color de Fondo Seccíon</Label>
                <div className="flex items-center gap-6">
                    <div 
                        className="h-20 w-20 rounded-3xl border-8 border-white shadow-2xl shrink-0 transition-colors duration-500" 
                        style={{ backgroundColor: getPreviewBg() }}
                    />
                    <div className="flex-1 space-y-2">
                        <Input 
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            placeholder="Ej. #003366"
                            className="h-16 bg-slate-50 border-none rounded-[1.25rem] px-8 text-sm font-mono font-bold text-slate-700 uppercase focus:ring-4 focus:ring-purple-600/5 transition-all"
                        />
                        <p className="text-[9px] text-slate-400 font-bold ml-1">VACÍO = COLOR INTELIGENTE POR DEFECTO</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Color de Texto & Detalles</Label>
                <div className="flex items-center gap-6">
                    <div 
                        className="h-20 w-20 rounded-3xl border-8 border-white shadow-2xl shrink-0 transition-colors duration-500" 
                        style={{ backgroundColor: getPreviewText() }}
                    />
                    <div className="flex-1 space-y-2">
                        <Input 
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            placeholder="Ej. #FFFFFF"
                            className="h-16 bg-slate-50 border-none rounded-[1.25rem] px-8 text-sm font-mono font-bold text-slate-700 uppercase focus:ring-4 focus:ring-purple-600/5 transition-all"
                        />
                        <p className="text-[9px] text-slate-400 font-bold ml-1">VACÍO = COLOR INTELIGENTE POR DEFECTO</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="pt-8">
            <button 
                type="button"
                onClick={() => { setBgColor(''); setTextColor(''); }}
                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-all"
            >
                <div className="h-4 w-4 rounded-full border-2 border-slate-200 group-hover:border-blue-600 flex items-center justify-center p-0.5">
                    <div className="h-full w-full rounded-full bg-slate-200 group-hover:bg-blue-600 scale-0 group-hover:scale-100 transition-transform" />
                </div>
                Restablecer Colores Sugeridos
            </button>
        </div>
      </div>

      {/* SUBMIT AREA */}
      <div className="pt-12 border-t border-slate-100/60 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4 text-slate-400 bg-slate-50 py-4 px-8 rounded-3xl border border-slate-100/50">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Cambios visibles instantáneamente</span>
        </div>
        <button 
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto px-12 h-20 bg-blue-600 hover:bg-slate-900 disabled:opacity-50 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 shadow-2xl shadow-blue-600/30 hover:shadow-slate-900/40 transition-all duration-500 hover:scale-[1.05] active:scale-95"
        >
          {isPending ? (
            <div className="h-5 w-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="h-6 w-6" />
              Publicar Cambios al Sitio
            </>
          )}
        </button>
      </div>
    </form>
  )
}
