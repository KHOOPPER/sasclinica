export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth-utils'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { Globe, ArrowLeft, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import SiteSettingsForm from '@/app/admin/sitio/SiteSettingsForm'
import InitializeSiteForm from '@/app/admin/sitio/InitializeSiteForm'
import { internalLinkSite } from './actions'

export default async function SitioPage() {
  const { user, tenantId, clinicId } = await requireRole(['admin'])
  const supabase = await createClient()

  // 1. PRIMARY FETCH: search by IDs
  const orFilter = clinicId 
    ? `clinic_id.eq.${clinicId},tenant_id.eq.${tenantId}`
    : `tenant_id.eq.${tenantId}`

  let { data: settings } = await supabase.from('public_clinic_settings').select('*').or(orFilter).limit(1).maybeSingle()

  // 2. AUTOMATED FUZZY LINKING: if not found, look for keyword matches and link AUTOMATICALLY
  if (!settings) {
    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // A. Keywords from profile or email
    const { data: profile } = await supabase.from('profiles').select('last_name').eq('id', user.id).maybeSingle()
    const namePart = profile?.last_name?.toLowerCase() || user.email?.split('@')[0].toLowerCase() || 'portillo'

    // B. Clinic Name
    const { data: clinics } = await adminClient.from('clinics').select('name').eq('tenant_id', tenantId).limit(1).maybeSingle()
    const clinicKeyword = clinics?.name.toLowerCase().split(' ').pop() || 'portillo'

    // C. Aggressive search
    const { data: suggestion } = await adminClient
      .from('public_clinic_settings')
      .select('slug')
      .or(`slug.ilike.%${namePart}%,slug.ilike.%${clinicKeyword}%`)
      .limit(1)
      .maybeSingle()

    if (suggestion && tenantId) {
        // AUTO-LINK!
        await internalLinkSite(suggestion.slug, tenantId, clinicId || undefined)
        
        // RE-FETCH after linking
        const refreshFetch = await supabase.from('public_clinic_settings').select('*').or(orFilter).limit(1).maybeSingle()
        settings = refreshFetch.data
    }
  }

  // 3. Conditional Rendering
  if (!settings) {
    return <InitializeSiteForm />
  }

  // Redirect to the new Builder Pro editor
  redirect('/admin/sitio/builder')
}
