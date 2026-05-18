'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { updateClinicSettings } from './actions'
import { toast } from 'sonner'

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
      toast.success('Configuración actualizada correctamente')
    } else {
      toast.error(result.error)
    }
    setIsSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={clinic.id} />
      
      <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Identidad Visual Centralizada (Modo Superadmin)</p>
        <p className="text-[10px] text-slate-400">Estas gestionando la identidad visual de esta clínica como administrador del sistema.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo_url">URL del Logo de la Clínica</Label>
        <Input 
          id="logo_url" 
          value={logoUrl} 
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://ejemplo.com/logo.png" 
          className="text-gray-900" 
        />
        <p className="text-[10px] text-gray-400 mt-1 italic">Ingresa la URL pública del logo. Se gestionará centralizadamente mediante enlaces.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre Comercial de la Clínica</Label>
          <Input id="name" name="name" defaultValue={clinic.name} required className="text-gray-900" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="moneda">Moneda del Sistema</Label>
          <select name="moneda" defaultValue={clinic.moneda || 'USD'} className="w-full border rounded-md p-2 text-gray-900 bg-white">
            <option value="USD">Dólar Estadounidense (USD)</option>
            <option value="SVC">Colón Salvadoreño (SVC)</option>
            <option value="EUR">Euro (EUR)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono de Atención</Label>
          <Input id="phone" name="phone" defaultValue={clinic.phone} placeholder="2200-0000" className="text-gray-900" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Dirección Física</Label>
          <Input id="address" name="address" defaultValue={clinic.address} placeholder="Calle Principal, #123" className="text-gray-900" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
          {isSaving ? 'Guardando Cambios...' : 'Actualizar Perfil de Clínica'}
        </Button>
      </div>
    </form>
  )
}
