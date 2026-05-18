'use client'
export const dynamic = 'force-dynamic'


import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { User, Mail, Shield, Lock, Save, Camera, Globe, Stethoscope, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SuperadminPerfilPage() {
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    avatar_url: ''
  })
  const [branding, setBranding] = useState({
    name: 'Medicare',
    logo: ''
  })

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Load Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileData) {
          setProfile({
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            email: profileData.email || user.email || '',
            avatar_url: profileData.avatar_url || ''
          })
        }

        // Load Branding from LocalStorage for now (as per plan for immediate feedback)
        const savedBranding = localStorage.getItem('superadmin_branding')
        if (savedBranding) {
          setBranding(JSON.parse(savedBranding))
        }
      }
      setLoading(false)
    }
    loadProfile()
  }, [])

  async function handleSave() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error('Error: Sesión expirada')
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
      })
      .eq('id', user.id)

    if (error) {
      toast.error('Error: ' + error.message)
    } else {
      toast.success('Perfil actualizado correctamente')
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)
      const toastId = toast.loading('Subiendo imagen...')
      
      const file = event.target.files?.[0]
      if (!file) {
        toast.dismiss(toastId)
        setUploading(false)
        return
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.error('Error: Sesión no válida', { id: toastId })
        return
      }

      // 1. Upload to storage bucket "avatars" with timestamp suffix for cache busting
      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Get public url
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // 3. Update profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      // 4. Update local state
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }))
      toast.success('Foto actualizada correctamente', { id: toastId })

    } catch (error: any) {
      toast.error(`Error: ${error.message}`, { id: 'error_avatar' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = '' // Reset input
      }
    }
  }

  async function handleSaveBranding() {
     localStorage.setItem('superadmin_branding', JSON.stringify(branding))
     window.dispatchEvent(new Event('storage')) // Notify layout
     toast.success('Marca de plataforma actualizada')
  }

  if (loading) return null

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-instant">
      <div>
        <h2 className="text-4xl font-black text-text-main tracking-tighter uppercase leading-none">Mi Perfil</h2>
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mt-4">Configura tu cuenta de Super-Administrador</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Left Col: Avatar */}
        <div className="md:col-span-1 bg-card-bg rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 border border-slate-200/50 dark:border-white/10 shadow-card flex flex-col items-center justify-center space-y-6 md:space-y-8 transition-all">
           <div className="relative group">
              <input 
                 type="file" 
                 ref={fileInputRef} 
                 className="hidden" 
                 accept="image/*" 
                 onChange={uploadAvatar} 
                 disabled={uploading}
              />
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl md:rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-center justify-center text-slate-300 transition-all duration-500 overflow-hidden relative">
                 {profile.avatar_url && !uploading ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                    <User className="h-16 w-16 md:h-20 md:w-20" />
                 )}
                 {uploading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
                       <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                    </div>
                 )}
              </div>
              <button 
                 onClick={() => fileInputRef.current?.click()}
                 disabled={uploading}
                 className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 h-10 w-10 md:h-12 md:w-12 bg-slate-900 rounded-full border-4 border-white text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                 title="Subir foto de perfil"
              >
                 <Camera className="h-[16px] w-[16px]" strokeWidth={1.5} />
              </button>
           </div>
           <div className="text-center">
              <p className="font-black text-text-main uppercase tracking-tight text-lg md:text-xl leading-tight">{profile.first_name} {profile.last_name}</p>
              <div className="flex items-center justify-center gap-2 mt-2 md:mt-3 p-1.5 px-3 md:p-2 md:px-4 bg-emerald-500/5 rounded-full border border-emerald-500/10">
                 <Shield className="h-3 w-3 text-emerald-500" />
                 <span className="text-[8px] md:text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">Superadmin Global</span>
              </div>
           </div>
        </div>

        {/* Right Col: Form */}
        <div className="md:col-span-2 bg-card-bg rounded-2xl md:rounded-[2.5rem] border border-slate-200/50 dark:border-white/10 shadow-card overflow-hidden transition-all">
          <div className="p-6 md:p-10 border-b border-slate-100/50 dark:border-white/5 bg-slate-50/10 dark:bg-white/5">
             <h3 className="text-lg md:text-xl font-black text-text-main uppercase tracking-tight">Datos Personales</h3>
             <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Información de contacto y nombre</p>
          </div>
          <div className="p-6 md:p-10 space-y-6 md:space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-3">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                   <input 
                      type="text" 
                      value={profile.first_name}
                      onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-[12px] md:text-[13px] font-bold text-slate-900 outline-none focus:bg-slate-100 transition-all"
                   />
                </div>
                <div className="space-y-3">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellido</label>
                   <input 
                      type="text" 
                      value={profile.last_name}
                      onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                      className="w-full bg-slate-50 border-transparent rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-[12px] md:text-[13px] font-bold text-slate-900 outline-none focus:bg-slate-100 transition-all"
                   />
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico (Solo Lectura)</label>
                <div className="relative">
                   <Mail className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                   <input 
                      type="email" 
                      value={profile.email}
                      disabled
                      className="w-full bg-slate-50/50 border-transparent rounded-xl md:rounded-2xl px-12 md:px-14 py-3 md:py-4 text-[12px] md:text-[13px] font-bold text-slate-400 cursor-not-allowed uppercase tracking-tight opacity-70"
                   />
                </div>
             </div>

              <div className="pt-6 md:pt-8 border-t border-slate-50 flex justify-end">
                 <Button 
                    onClick={handleSave}
                    className="h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] shadow-lg flex items-center gap-3 transition-all cursor-pointer active:scale-95"
                 >
                    <Save className="h-[16px] w-[16px]" strokeWidth={2} />
                    Guardar Perfil
                 </Button>
              </div>
           </div>
        </div>
      </div>

      {/* Global Branding Section */}
      <div className="bg-card-bg rounded-2xl md:rounded-[2.5rem] border-2 border-emerald-500/10 shadow-card overflow-hidden transition-all">
        <div className="p-6 md:p-10 border-b border-slate-100 dark:border-white/10 bg-emerald-500/5/30">
           <div className="flex items-center gap-4 md:gap-6">
              <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-emerald-500 flex items-center justify-center text-white dark:text-black shadow-lg">
                 <Globe className="h-5 w-5 md:h-7 md:w-7" />
              </div>
              <div>
                 <h3 className="text-lg md:text-xl font-black text-text-main uppercase tracking-tight leading-tight">Capa de Marca (Branding)</h3>
                 <p className="text-[9px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1.5 leading-none">Personaliza la identidad del panel superadmin</p>
              </div>
           </div>
        </div>
        <div className="p-6 md:p-10 space-y-8 md:space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de la Plataforma</label>
                 <input 
                    type="text" 
                    placeholder="Ej: Medicare Elite"
                    value={branding.name}
                    onChange={(e) => setBranding({...branding, name: e.target.value})}
                    className="w-full bg-slate-50 border-transparent rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-[12px] md:text-[13px] font-bold text-slate-900 outline-none focus:bg-slate-100 transition-all"
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">URL del Logo (Icono)</label>
                 <input 
                    type="text" 
                    placeholder="https://tu-logo.png"
                    value={branding.logo}
                    onChange={(e) => setBranding({...branding, logo: e.target.value})}
                    className="w-full bg-slate-50 border-transparent rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-[12px] md:text-[13px] font-bold text-slate-900 outline-none focus:bg-slate-100 transition-all"
                 />
              </div>
           </div>

           <div className="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 md:gap-6">
                 <div className="h-12 w-12 md:h-14 md:w-14 bg-bg-main rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-white/10">
                    {branding.logo ? <img src={branding.logo} className="h-6 w-6 md:h-8 md:w-8 object-contain" /> : <Stethoscope className="h-5 w-5 md:h-6 md:w-6 text-emerald-500" />}
                 </div>
                 <div>
                    <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Vista previa</p>
                    <p className="text-sm md:text-base font-black text-text-main uppercase">{branding.name || 'Admin Panel'}</p>
                 </div>
              </div>
              <Button 
                onClick={handleSaveBranding}
                className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] shadow-lg transition-all cursor-pointer active:scale-95"
              >
                Actualizar Marca
              </Button>
           </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-card-bg p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 border border-slate-200/50 dark:border-white/10 shadow-card rounded-2xl md:rounded-[2.5rem] transition-all">
         <div className="flex items-center gap-4 md:gap-8 text-center md:text-left">
            <div className="h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center text-emerald-500">
               <Lock className="h-5 w-5 md:h-[20px] md:w-[20px]" strokeWidth={1.5} />
            </div>
            <div>
               <p className="font-black text-slate-900 uppercase tracking-tight text-lg md:text-xl leading-tight">Seguridad</p>
               <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 leading-none">Mantén tu cuenta protegida</p>
            </div>
         </div>
         <Button 
            variant="outline" 
            onClick={() => toast.info('Seguridad: Se te enviará un enlace mágico para restaurar la contraseña a tu correo registrado.', { id: 'pwd' })}
            className="w-full md:w-auto h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95"
         >
            Cambiar Contraseña
         </Button>
      </div>
    </div>
  )
}
