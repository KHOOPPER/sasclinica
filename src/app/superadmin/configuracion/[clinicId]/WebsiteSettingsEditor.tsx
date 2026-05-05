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
      <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="h-10 w-10 bg-[#003366] rounded-xl flex items-center justify-center text-white">
                <span className="font-bold">H</span>
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Sección Hero (Portada)</h3>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Configura la primera impresión de tu sitio</p>
            </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Título Principal</Label>
            <Input 
              value={settings.hero_title || ''} 
              onChange={e => setSettings({...settings, hero_title: e.target.value})}
              placeholder="Atención médica de primer nivel"
              className="bg-slate-50 border-none h-14 rounded-2xl focus-visible:ring-[#003366] px-6 font-bold"
            />
          </div>
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Subtítulo (Bienvenida)</Label>
            <textarea 
              value={settings.hero_subtitle || ''} 
              onChange={e => setSettings({...settings, hero_subtitle: e.target.value})}
              placeholder="Describe lo que hace especial a tu clínica..."
              className="w-full bg-slate-50 border-none min-h-[120px] rounded-2xl focus-visible:ring-[#003366] p-6 font-medium text-slate-600 outline-none"
            />
          </div>
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">URL Imagen de Fondo (Hero)</Label>
            <Input 
              value={settings.hero_image_url || ''} 
              onChange={e => setSettings({...settings, hero_image_url: e.target.value})}
              placeholder="https://ejemplo.com/imagen-clinica.jpg"
              className="bg-slate-50 border-none h-14 rounded-2xl focus-visible:ring-[#003366] px-6 font-bold"
            />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Hint: Si dejas vacío, se usará la imagen por defecto.</p>
          </div>
        </div>
      </section>

      {/* SECTION TOGGLES */}
      <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="h-10 w-10 bg-[#003366] rounded-xl flex items-center justify-center text-white">
                <span className="font-bold">S</span>
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Secciones y Contenido</h3>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Activa o desactiva módulos en tu landing page</p>
            </div>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-50">
          <div className="space-y-1">
            <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Mostrar Sección de Servicios</span>
            <p className="text-xs text-slate-400 font-medium">Muestra la lista de servicios con sus precios y duración.</p>
          </div>
          <Switch 
            checked={settings.show_services} 
            onCheckedChange={val => setSettings({...settings, show_services: val})}
          />
        </div>
      </section>

      {/* CONTACT INFO */}
      <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="h-10 w-10 bg-[#003366] rounded-xl flex items-center justify-center text-white">
                <span className="font-bold">C</span>
            </div>
            <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Información de Contacto Pública</h3>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Estos datos aparecerán en el pie de página</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Teléfono de Contacto</Label>
            <Input 
              value={settings.contact_phone || ''} 
              onChange={e => setSettings({...settings, contact_phone: e.target.value})}
              placeholder="+503 2200-0000"
              className="bg-slate-50 border-none h-14 rounded-2xl focus-visible:ring-[#003366] px-6 font-bold"
            />
          </div>
          <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">WhatsApp de Confirmación</Label>
            <Input 
              value={settings.contact_whatsapp || ''} 
              onChange={e => setSettings({...settings, contact_whatsapp: e.target.value})}
              placeholder="+503 7000-0000"
              className="bg-slate-50 border-none h-14 rounded-2xl focus-visible:ring-[#003366] px-6 font-bold"
            />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Dirección Física</Label>
            <Input 
              value={settings.contact_address || ''} 
              onChange={e => setSettings({...settings, contact_address: e.target.value})}
              placeholder="Colonia Escalón, San Salvador..."
              className="bg-slate-50 border-none h-14 rounded-2xl focus-visible:ring-[#003366] px-6 font-bold"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <Button 
          disabled={isSaving}
          onClick={handleSave}
          className="bg-[#003366] hover:bg-[#002244] text-white h-16 px-12 rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] shadow-2xl shadow-blue-900/20 transition-all"
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios del Sitio'}
        </Button>
      </div>
    </div>
  )
}
