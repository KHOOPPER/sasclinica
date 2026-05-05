export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User, Phone, Image as ImageIcon, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { updateProfile } from './actions'
import ProfileForm from './ProfileForm'

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400">
            <ArrowLeft className="h-6 w-6" />
          </button>
        </Link>
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Ajustes del Perfil</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Gestiona tu información personal y foto de perfil</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="bg-slate-50/50 p-8 border-b border-slate-50 flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center relative group">
            {profile?.image_url ? (
              <img src={profile.image_url} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-slate-200" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              {profile?.first_name} {profile?.last_name}
            </h3>
            <p className="text-sm font-bold text-[#003366] uppercase tracking-widest opacity-60">
              {user.email}
            </p>
          </div>
        </div>

        <div className="p-10">
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  )
}
