export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'
import { WebsiteVisualEditor } from './WebsiteVisualEditor'

export default async function ClinicSiteEditorPage({ params }: { params: Promise<{ clinicId: string }> }) {
  const { clinicId } = await params
  const supabase = await createClient()

  // 2. Use admin client to fetch clinic (SSR bypasses RLS for speed as superadmin route is protected by Middleware)
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch clinic, its services and public settings
  const { data: clinic } = await supabaseAdmin
    .from('clinics')
    .select('*, public_clinic_settings(*), services(*)')
    .eq('id', clinicId)
    .single()

  if (!clinic) notFound()

  const publicSettings = clinic.public_clinic_settings?.[0] || {
    clinic_id: clinicId,
    tenant_id: clinic.tenant_id,
    slug: clinic.name.toLowerCase().replace(/\s+/g, '-'),
    is_active: false   // Start disabled - superadmin must explicitly enable
  }

  return (
    <div className="h-full -m-6 flex flex-col overflow-hidden">
      <WebsiteVisualEditor
        clinic={clinic}
        initialSettings={publicSettings}
        exitUrl="/superadmin/clinicas"
      />
    </div>
  )
}
