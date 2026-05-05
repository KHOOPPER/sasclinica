'use client'

import { useState } from 'react'
import { User, Phone, Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react'
import { updateProfile } from './actions'
import { toast } from 'sonner'

export default function ProfileForm({ profile }: { profile: any }) {
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)
    
    setIsPending(false)
    
    if (result.success) {
      toast.success('Perfil actualizado correctamente')
    } else {
      toast.error(result.error || 'Error al actualizar el perfil')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#003366] transition-colors" />
            <input 
              name="firstName"
              defaultValue={profile?.first_name || ''}
              className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-12 pr-6 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#003366]/10 transition-all"
              placeholder="Tu nombre"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellido</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#003366] transition-colors" />
            <input 
              name="lastName"
              defaultValue={profile?.last_name || ''}
              className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-12 pr-6 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#003366]/10 transition-all"
              placeholder="Tu apellido"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#003366] transition-colors" />
            <input 
              name="phone"
              defaultValue={profile?.phone || ''}
              className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-12 pr-6 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#003366]/10 transition-all"
              placeholder="+503 0000 0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL de Foto de Perfil</label>
          <div className="relative group">
            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#003366] transition-colors" />
            <input 
              name="imageUrl"
              defaultValue={profile?.image_url || ''}
              className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-12 pr-6 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#003366]/10 transition-all"
              placeholder="https://ejemplo.com/mifoto.jpg"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button 
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto px-10 h-14 bg-[#003366] hover:bg-[#002244] disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10 transition-all"
        >
          {isPending ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>
    </form>
  )
}
