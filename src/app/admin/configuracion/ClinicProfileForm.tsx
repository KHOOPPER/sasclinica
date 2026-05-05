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
    const formData = new FormData(e.currentTarget)
    formData.append('logoUrl', logoUrl)
    
    const result = await updateClinicSettings(formData)
    if (result.success) {
      toast.success('¡Configuración actualizada con éxito!')
      // Force a refresh to update the sidebar/header logo and name
      window.location.reload()
    } else {
      toast.error(result.error || 'Ocurrió un error al guardar')
    }
    setIsSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <input type="hidden" name="id" value={clinic.id} />
      
      {/* SECCIÓN IDENTIDAD */}
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-black text-slate-900 uppercase tracking-tight text-xl">Identidad</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Nombre y Logotipo principal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial</Label>
            <Input id="name" name="name" defaultValue={clinic.name} required className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-600/5 transition-all" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL del Logotipo (PNG/SVG)</Label>
            <div className="flex gap-4">
              <Input 
                id="logo_url" 
                value={logoUrl} 
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://tu-sitio.com/logo.png" 
                className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-600/5 transition-all flex-1" 
              />
              {logoUrl && (
                <div className="h-14 w-14 rounded-2xl bg-white border border-slate-100 p-2 flex items-center justify-center shadow-sm">
                  <img src={logoUrl} alt="Preview" className="max-h-full max-w-full object-contain" onError={() => toast.error('Error al cargar la vista previa del logo')} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN CONTACTO Y LOCALIZACIÓN */}
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-black text-slate-900 uppercase tracking-tight text-xl">Contacto y Ubicación</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Información que verán tus trabajadores</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono de Atención</Label>
            <Input id="phone" name="phone" defaultValue={clinic.phone} placeholder="2200-0000" className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-600/5 transition-all" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Física Completa</Label>
            <Input id="address" name="address" defaultValue={clinic.address} placeholder="Calle Principal, Edificio Médico, Nivel 2..." className="h-14 bg-slate-50 border-none rounded-2xl px-6 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-blue-600/5 transition-all" />
          </div>
        </div>
      </div>

      {/* SECCIÓN SUSCRIPCIÓN */}
      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-black text-slate-900 uppercase tracking-tight text-xl">Plan de Suscripción</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Detalles de tu arquitectura contratada</p>
        </div>

        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100/50 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
              <Coins className="h-8 w-8" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Actual</p>
              <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                {clinic.tenants?.plan || 'Básico'}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-white dark:bg-slate-900/50 px-8 py-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Próximo Vencimiento</p>
              <h4 className="text-lg font-black text-blue-600 uppercase tracking-tighter">
                {clinic.tenants?.plan_expires_at 
                  ? new Date(clinic.tenants.plan_expires_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                  : 'Sin fecha establecida'}
              </h4>
            </div>
            <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
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
          className="h-16 px-12 bg-slate-900 hover:bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-900/10 hover:shadow-blue-600/30 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSaving ? 'Guardando...' : 'Guardar Configuración'}
        </Button>
      </div>
    </form>
  )
}

