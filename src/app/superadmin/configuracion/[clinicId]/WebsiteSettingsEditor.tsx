'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { updateWebsiteSettings } from './websiteActions'

export function WebsiteSettingsEditor({ initialSettings }: { initialSettings: any }) {
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    const result = await updateWebsiteSettings(settings)
    if (result.success) {
      toast.success('Configuración de sitio web actualizada')
    } else {
      toast.error('Error al actualizar: ' + result.error)
    }
    setIsSaving(false)
  }

  return (
    <div className="space-y-12 max-w-4xl animate-none">
      {/* HERO SECTION */}
      <section className="bg-white p-5 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 md:space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-4 md:pb-6">
            <div className="h-9 w-9 md:h-10 md:w-10 bg-[#003366] rounded-xl flex items-center justify-center text-white shrink-0">
                <span className="font-bold text-sm md:text-base">H</span>
            </div>
            <div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Portada</h3>
                <p className="text-[9px] md:text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">Configura la primera impresión</p>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8">
          <div className="space-y-3 md:space-y-4">
            <Label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">Título Principal</Label>
            <Input 
              value={settings.hero_title || ''} 
              onChange={e => setSettings({...settings, hero_title: e.target.value})}
              placeholder="Atención médica de primer nivel"
              className="bg-slate-50 border-none h-12 md:h-14 rounded-xl md:rounded-2xl focus-visible:ring-[#003366] px-4 md:px-6 font-bold text-sm md:text-base"
            />
          </div>
          <div className="space-y-3 md:space-y-4">
            <Label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">Subtítulo (Bienvenida)</Label>
            <textarea 
              value={settings.hero_subtitle || ''} 
              onChange={e => setSettings({...settings, hero_subtitle: e.target.value})}
              placeholder="Describe lo que hace especial a tu clínica..."
              className="w-full bg-slate-50 border-none min-h-[100px] md:min-h-[120px] rounded-xl md:rounded-2xl focus-visible:ring-[#003366] p-4 md:p-6 font-medium text-slate-600 text-sm md:text-base outline-none"
            />
          </div>
          <div className="space-y-3 md:space-y-4">
            <Label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">URL Imagen de Fondo</Label>
            <Input 
              value={settings.hero_image_url || ''} 
              onChange={e => setSettings({...settings, hero_image_url: e.target.value})}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="bg-slate-50 border-none h-12 md:h-14 rounded-xl md:rounded-2xl focus-visible:ring-[#003366] px-4 md:px-6 font-bold text-sm md:text-base"
            />
          </div>
        </div>
      </section>

      {/* SECTION TOGGLES */}
      <section className="bg-white p-5 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 md:space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-4 md:pb-6">
            <div className="h-9 w-9 md:h-10 md:w-10 bg-[#003366] rounded-xl flex items-center justify-center text-white shrink-0">
                <span className="font-bold text-sm md:text-base">S</span>
            </div>
            <div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Secciones</h3>
                <p className="text-[9px] md:text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">Módulos activos</p>
            </div>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-1 pr-4">
            <span className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight">Mostrar Servicios</span>
            <p className="text-[10px] md:text-xs text-slate-400 font-medium">Lista de servicios con precios.</p>
          </div>
          <Switch 
            checked={settings.show_services} 
            onCheckedChange={val => setSettings({...settings, show_services: val})}
          />
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="bg-white p-5 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 md:space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-4 md:pb-6">
            <div className="h-9 w-9 md:h-10 md:w-10 bg-[#003366] rounded-xl flex items-center justify-center text-white shrink-0">
                <span className="font-bold text-sm md:text-base">C</span>
            </div>
            <div>
                <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Contacto</h3>
                <p className="text-[9px] md:text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">Datos públicos</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-3 md:space-y-4">
            <Label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">Teléfono</Label>
            <Input 
              value={settings.contact_phone || ''} 
              onChange={e => setSettings({...settings, contact_phone: e.target.value})}
              placeholder="+503 2200-0000"
              className="bg-slate-50 border-none h-12 md:h-14 rounded-xl md:rounded-2xl focus-visible:ring-[#003366] px-4 md:px-6 font-bold text-sm md:text-base"
            />
          </div>
          <div className="space-y-3 md:space-y-4">
            <Label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">WhatsApp</Label>
            <Input 
              value={settings.contact_whatsapp || ''} 
              onChange={e => setSettings({...settings, contact_whatsapp: e.target.value})}
              placeholder="+503 7000-0000"
              className="bg-slate-50 border-none h-12 md:h-14 rounded-xl md:rounded-2xl focus-visible:ring-[#003366] px-4 md:px-6 font-bold text-sm md:text-base"
            />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-3 md:space-y-4">
            <Label className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">Dirección Física</Label>
            <Input 
              value={settings.contact_address || ''} 
              onChange={e => setSettings({...settings, contact_address: e.target.value})}
              placeholder="San Salvador..."
              className="bg-slate-50 border-none h-12 md:h-14 rounded-xl md:rounded-2xl focus-visible:ring-[#003366] px-4 md:px-6 font-bold text-sm md:text-base"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <Button 
          disabled={isSaving}
          onClick={handleSave}
          className="w-full md:w-auto bg-[#003366] hover:bg-[#002244] text-white h-14 md:h-16 px-8 md:px-12 rounded-xl md:rounded-[2rem] font-black text-sm md:text-lg uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/20 transition-all active:scale-95"
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  )
}
