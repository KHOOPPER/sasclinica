'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateClinicSettings } from './actions'
import { toast } from 'sonner'
import { Building2, Globe, Phone, MapPin, Coins, Image as ImageIcon, Calendar } from 'lucide-react'

export function ClinicProfileForm({ clinic }: { clinic: any }) {
  const [logoUrl, setLogoUrl] = useState(clinic.logo_url || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('logoUrl', logoUrl)
      
      const result = await updateClinicSettings(formData)
      if (result.success) {
        toast.success('¡Configuración actualizada con éxito!')
        // Force a refresh to update the sidebar/header logo and name
        window.location.reload()
      } else {
        toast.error(result.error || 'Ocurrió un error al guardar')
        setIsSaving(false)
      }
    } catch (error: any) {
      console.error('Submit Error:', error)
      toast.error('Error de red o archivo muy pesado. Intenta con un logo más pequeño (menor a 2MB).')
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <input type="hidden" name="id" value={clinic.id} />
      
      {/* SECCIÓN IDENTIDAD */}
      <div className="space-y-6">
        <div className="border-b border-slate-100 dark:border-white/5 pb-4">
          <h3 className="font-black text-text-main uppercase tracking-tight text-xl">Identidad</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Nombre y Logotipo principal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial</Label>
            <Input id="name" name="name" defaultValue={clinic.name} required className="h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-none rounded-2xl px-6 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm" />
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Logotipo Oficial (PNG/JPG)</Label>
            
            <div className="flex gap-4 items-start">
              <div className="flex-1 space-y-3">
                <div className="relative">
                  <Input 
                    type="file" 
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          const img = new Image()
                          img.onload = () => {
                            const canvas = document.createElement('canvas')
                            const MAX_SIZE = 512 // Max width/height for logo
                            let width = img.width
                            let height = img.height

                            if (width > height && width > MAX_SIZE) {
                              height *= MAX_SIZE / width
                              width = MAX_SIZE
                            } else if (height > MAX_SIZE) {
                              width *= MAX_SIZE / height
                              height = MAX_SIZE
                            }

                            canvas.width = width
                            canvas.height = height
                            const ctx = canvas.getContext('2d')
                            if (ctx) {
                              ctx.drawImage(img, 0, 0, width, height)
                              const compressedBase64 = canvas.toDataURL(file.type || 'image/png', 0.8)
                              setLogoUrl(compressedBase64)
                              toast.success('Imagen optimizada y cargada correctamente')
                            }
                          }
                          img.src = reader.result as string
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-none rounded-2xl px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all shadow-sm cursor-pointer" 
                  />
                </div>
                <p className="text-[10px] font-bold text-slate-400 ml-2">Selecciona la imagen desde tu dispositivo. Se guardará internamente para evitar errores en las recetas.</p>
              </div>

              {/* Vista Previa */}
              {logoUrl && (
                <div className="h-32 w-32 shrink-0 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-2 flex items-center justify-center shadow-md">
                  <img src={logoUrl} alt="Preview" className="max-h-full max-w-full object-contain" onError={() => toast.error('Error al cargar la vista previa del logo')} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN CONTACTO Y LOCALIZACIÓN */}
      <div className="space-y-6">
        <div className="border-b border-slate-100 dark:border-white/5 pb-4">
          <h3 className="font-black text-text-main uppercase tracking-tight text-xl">Contacto y Ubicación</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Información que verán tus trabajadores</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono de Atención</Label>
            <Input id="phone" name="phone" defaultValue={clinic.phone} placeholder="2200-0000" className="h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-none rounded-2xl px-6 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Física Completa</Label>
            <Input id="address" name="address" defaultValue={clinic.address} placeholder="Calle Principal, Edificio Médico, Nivel 2..." className="h-14 bg-white dark:bg-white/5 border border-slate-200 dark:border-none rounded-2xl px-6 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-blue-600/5 transition-all shadow-sm" />
          </div>
        </div>
      </div>

      {/* SECCIÓN SUSCRIPCIÓN */}
      <div className="space-y-6">
        <div className="border-b border-slate-100 dark:border-white/5 pb-4">
          <h3 className="font-black text-text-main uppercase tracking-tight text-xl">Plan de Suscripción</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Detalles de tu arquitectura contratada</p>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-[2rem] p-8 border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
              <Coins className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Actual</p>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {clinic.tenants?.plan || 'Básico'}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-slate-50 dark:bg-white/5 px-8 py-4 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Próximo Vencimiento</p>
              <h4 className="text-lg font-black text-emerald-500 uppercase tracking-tighter">
                {clinic.tenants?.plan_expires_at 
                  ? new Date(clinic.tenants.plan_expires_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                  : 'Sin fecha establecida'}
              </h4>
            </div>
            <div className="h-10 w-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        <p className="text-[10px] font-bold text-slate-400 italic text-center px-8">
          Para realizar cambios en tu plan o extender tu suscripción, por favor contacta con soporte técnico.
        </p>
      </div>

      <div className="flex justify-end pt-10">
        <Button 
          type="submit" 
          disabled={isSaving} 
          className="h-16 px-12 bg-slate-900 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-900/10 hover:shadow-blue-600/30 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSaving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </form>
  )
}

