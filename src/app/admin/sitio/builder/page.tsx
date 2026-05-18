export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { WebsiteVisualEditor } from '@/app/superadmin/sitios/[clinicId]/WebsiteVisualEditor'

export default async function AdminBuilderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 1. Get user profile role (for smart exit routing)
  const adminClient = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [
    { data: tenantUserData },
    { data: profileData },
  ] = await Promise.all([
    supabase.from('tenant_users').select('tenant_id, role').eq('user_id', user.id).maybeSingle(),
    adminClient.from('profiles').select('role').eq('id', user.id).maybeSingle(),
  ])

  if (!tenantUserData) redirect('/login')

  const profileRole = profileData?.role ?? 'admin'
  const { data: staffMember } = await supabase.from('staff_members').select('role, clinic_id').eq('user_id', user.id).maybeSingle()
  const effectiveRole = tenantUserData.role === 'admin' ? 'admin' : (staffMember?.role || tenantUserData.role)

  if (effectiveRole !== 'admin') {
    redirect('/admin')
  }

  // 2. Fetch clinic data
  const clinicId = staffMember?.clinic_id

  const { data: clinic } = await adminClient
    .from('clinics')
    .select('*, public_clinic_settings(*), services(*)')
    .eq(clinicId ? 'id' : 'tenant_id', clinicId || tenantUserData.tenant_id)
    .limit(1)
    .maybeSingle()

  if (!clinic) redirect('/admin/sitio')

  const publicSettings = clinic.public_clinic_settings?.[0]
  if (!publicSettings) redirect('/admin/sitio')

  // Determine exit URL server-side — superadmin goes directly to /superadmin, no redirect loop
  const exitUrl = profileRole === 'superadmin' ? '/superadmin' : '/admin'

  return (
    <div className="h-screen -m-8 flex flex-col overflow-hidden bg-black">
      <WebsiteVisualEditor
        clinic={clinic}
        initialSettings={publicSettings}
        exitUrl={exitUrl}
      />
    </div>
  )
}
