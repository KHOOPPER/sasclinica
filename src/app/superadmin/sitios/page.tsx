export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { Layout } from 'lucide-react'
import { redirect } from 'next/navigation'
import SitiosClient from './SitiosClient'

export default async function SitiosPage() {
  const supabase = await createClient()
  
  // Verify superadmin status
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_superadmin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_superadmin) {
    redirect('/')
  }

  // Use service role for robust fetching in superadmin dashboard
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: clinics } = await supabaseAdmin
    .from('clinics')
    .select('*, tenants(id, name, slug, plan, plan_expires_at), public_clinic_settings(is_active, slug, logo_url, hero_image_url, primary_color)')
    .order('name')

  return (
    <div className="space-y-12 animate-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-text-main uppercase tracking-tighter leading-none">Gestión de Sitios Web</h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-3">Personalización visual y presencia pública de las clínicas</p>
        </div>
        <div className="bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 rounded-2xl px-6 py-3 flex items-center gap-3">
           <Layout className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
           <span className="text-xs font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">{clinics?.length || 0} Sitios registrados</span>
        </div>
      </div>

      <SitiosClient clinics={clinics || []} />
    </div>
  )
}
