'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'No autorizado' }

  const { data: tenantUserData } = await supabase.from('tenant_users').select('tenant_id, role').eq('user_id', user.id).single()
  const { data: staffMember } = await supabase.from('staff_members').select('clinic_id, role').eq('user_id', user.id).maybeSingle()

  const effectiveRole = tenantUserData?.role === 'admin' ? 'admin' : (staffMember?.role || tenantUserData?.role)
  if (effectiveRole !== 'admin') return { success: false, error: 'Permisos insuficientes' }

  const clinicId = staffMember?.clinic_id
  const tenantId = tenantUserData?.tenant_id

  const settings = {
    contact_layout: formData.get('contact_layout'),
    map_style: formData.get('map_style'),
    contact_bg_color: formData.get('contact_bg_color') || null,
    contact_text_color: formData.get('contact_text_color') || null,
    contact_title: formData.get('contact_title'),
    contact_subtitle: formData.get('contact_subtitle'),
  }

  const orFilter = clinicId 
    ? `clinic_id.eq.${clinicId},tenant_id.eq.${tenantId}`
    : `tenant_id.eq.${tenantId}`

  const { data: existingSettings } = await supabase
    .from('public_clinic_settings')
    .select('id')
    .or(orFilter)
    .limit(1)
    .maybeSingle()

  if (!existingSettings) return { success: false, error: 'Configuración no encontrada para actualizar' }

  const { error } = await supabase
    .from('public_clinic_settings')
    .update(settings)
    .eq('id', existingSettings.id)

  if (error) {
    console.error('Error updating site settings:', error)
    return { success: false, error: 'Error al actualizar la configuración' }
  }

  revalidatePath('/admin/sitio')
  revalidatePath('/') 
  return { success: true }
}

export async function initializeSiteSettings() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'No autorizado' }

  const { data: tenantUserData } = await supabase.from('tenant_users').select('tenant_id, role').eq('user_id', user.id).single()
  const { data: staffMember } = await supabase.from('staff_members').select('clinic_id, role').eq('user_id', user.id).maybeSingle()

  const effectiveRole = tenantUserData?.role === 'admin' ? 'admin' : (staffMember?.role || tenantUserData?.role)
  if (effectiveRole !== 'admin') return { success: false, error: 'Solo los administradores pueden inicializar el sitio' }

  const clinicId = staffMember?.clinic_id
  const tenantId = tenantUserData?.tenant_id

  if (!tenantId || !clinicId) return { success: false, error: 'No se pudo identificar la clínica asociada' }

  const adminClient = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: clinic } = await adminClient
    .from('clinics')
    .select('name')
    .eq('id', clinicId)
    .single()

  const clinicName = clinic?.name || 'mi-clinica'
  const baseSlug = clinicName.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const randomSuffix = Math.floor(Math.random() * 1000)
  const finalSlug = `${baseSlug}-${randomSuffix}`

  const { error } = await adminClient
    .from('public_clinic_settings')
    .insert({
      tenant_id: tenantId,
      clinic_id: clinicId,
      slug: finalSlug,
      contact_layout: 'split',
      map_style: 'standard',
      contact_title: 'Nuestra Sede',
      contact_subtitle: 'Horarios de atención e información de contacto.',
      is_active: true
    })

  if (error) {
    console.error('Initialization error:', error)
    return { success: false, error: 'Error al inicializar la base de datos de sitio' }
  }

  revalidatePath('/admin/sitio')
  return { success: true }
}

// Internal helper, not a public Server Action
export async function internalLinkSite(slug: string, tenantId: string, clinicId?: string) {
  const adminClient = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const finalClinicId = clinicId || (await adminClient.from('clinics').select('id').eq('tenant_id', tenantId).limit(1).single()).data?.id

  const { error } = await adminClient
    .from('public_clinic_settings')
    .update({ 
       tenant_id: tenantId,
       clinic_id: finalClinicId,
       is_active: true 
    })
    .eq('slug', slug)

  if (error) throw error
}

export async function linkExistingSiteSettings(slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'No autorizado' }

  const { data: tenantUserData } = await supabase.from('tenant_users').select('tenant_id, role').eq('user_id', user.id).single()
  const { data: staffMember } = await supabase.from('staff_members').select('clinic_id, role').eq('user_id', user.id).maybeSingle()

  const effectiveRole = tenantUserData?.role === 'admin' ? 'admin' : (staffMember?.role || tenantUserData?.role)
  if (effectiveRole !== 'admin') return { success: false, error: 'Solo los administradores pueden vincular sitios' }

  const tenantId = tenantUserData?.tenant_id
  const clinicId = staffMember?.clinic_id

  if (!tenantId) return { success: false, error: 'No se pudo identificar la clínica' }

  try {
    await internalLinkSite(slug, tenantId, clinicId)
    revalidatePath('/admin/sitio')
    return { success: true, redirect: true }
  } catch (err) {
    console.error('Link Error:', err)
    return { success: false, error: 'Error al vincular el sitio' }
  }
}
