'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Globe, Save, Pencil } from 'lucide-react'
import { updateWebsiteSettings, getPublicSettings } from './actions'
import { Modal } from '@/components/ui/modal'

export function WebsiteConfigModal({ clinicId, tenantId, clinicName }: { clinicId: string, tenantId: string, clinicName: string }) {
  const [settings, setSettings] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const loadSettings = async () => {
    const data = await getPublicSettings(clinicId)
    setSettings(data)
  }

  useEffect(() => {
    if (isOpen) {
      loadSettings()
    }
  }, [isOpen])

  const handleSave = async () => {
    setIsSaving(true)
    const result = await updateWebsiteSettings(settings)
    if (result.success) {
      toast.success('Configuración actualizada con éxito')
      setIsOpen(false)
    } else {
      toast.error('Error: ' + result.error)
    }
    setIsSaving(false)
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)} 
        className="h-11 px-6 rounded-2xl border-slate-100 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest gap-2 shadow-sm transition-all"
      >
        <Pencil className="h-4 w-4" />
        Editar
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title={`Configurar Sitio Web: ${clinicName}`}
      >
        {settings ? (
            <div className="space-y-8 py-4">
                {/* HERO SECTION */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#003366]">Portada</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Título Principal</Label>
                            <Input 
                                value={settings.hero_title || ''} 
                                onChange={e => setSettings({...settings, hero_title: e.target.value})}
                                className="h-10 rounded-lg font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Subtítulo</Label>
                            <textarea 
                                value={settings.hero_subtitle || ''} 
                                onChange={e => setSettings({...settings, hero_subtitle: e.target.value})}
                                className="w-full border border-slate-200 min-h-[80px] rounded-lg p-3 text-sm font-medium text-slate-600 outline-none focus:ring-1 focus:ring-[#003366]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Image URL</Label>
                            <Input 
                                value={settings.hero_image_url || ''} 
                                onChange={e => setSettings({...settings, hero_image_url: e.target.value})}
                                className="h-10 rounded-lg font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* VISIBILITY */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="space-y-1">
                        <Label className="text-sm font-bold">Mostrar Servicios</Label>
                        <p className="text-[10px] text-slate-400 font-medium">Habilita la sección de servicios pública.</p>
                    </div>
                    <Switch 
                        checked={settings.show_services} 
                        onCheckedChange={val => setSettings({...settings, show_services: val})}
                    />
                </div>

                {/* CONTACT */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#003366]">Contacto</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Teléfono</Label>
                            <Input 
                                value={settings.contact_phone || ''} 
                                onChange={e => setSettings({...settings, contact_phone: e.target.value})}
                                className="h-10 rounded-lg font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">WhatsApp</Label>
                            <Input 
                                value={settings.contact_whatsapp || ''} 
                                onChange={e => setSettings({...settings, contact_whatsapp: e.target.value})}
                                className="h-10 rounded-lg font-bold"
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400">Dirección</Label>
                            <Input 
                                value={settings.contact_address || ''} 
                                onChange={e => setSettings({...settings, contact_address: e.target.value})}
                                className="h-10 rounded-lg font-bold"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-50">
                    <Button 
                        disabled={isSaving}
                        onClick={handleSave}
                        className="bg-[#003366] hover:bg-[#002244] text-white h-12 px-8 rounded-lg font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
                    >
                        <Save className="h-4 w-4" />
                        {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </div>
        ) : (
            <div className="py-20 text-center animate-pulse text-slate-300 font-black uppercase tracking-widest text-xs">Cargando...</div>
        )}
      </Modal>
    </>
  )
}
