'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { requireRole } from '@/lib/auth-utils'

export async function updateClinicSettings(formData: FormData) {
  try {
    // 1. Validate user role and clinic ownership
    const { tenantId } = await requireRole(['admin'])
    const supabase = await createClient()

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const phone = formData.get('phone') as string
    const logoUrl = formData.get('logoUrl') as string

    if (!id || !name) return { success: false, error: 'Nombre es obligatorio' }

    // Security check: Ensure the admin belongs to the clinic they are trying to update
    const { data: targetClinic } = await supabase
      .from('clinics')
      .select('tenant_id')
      .eq('id', id)
      .single()

    if (!targetClinic || targetClinic.tenant_id !== tenantId) {
      return { success: false, error: 'No tienes permisos para editar esta clínica' }
    }

    // 2. Use Admin Client to bypass RLS and potential schema cache issues
    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 2a. Update basic info in clinics (excluding logo_url to test if it's the culprit)
    const { error: clinicError } = await supabaseAdmin
      .from('clinics')
      .update({
        name,
        address,
        phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (clinicError) {
      console.error('Clinic Update Error:', clinicError)
      return { success: false, error: 'Error actualizando datos básicos: ' + clinicError.message }
    }

    // 2b. Try to update logo_url in clinics
    const { error: logoError } = await supabaseAdmin
      .from('clinics')
      .update({ logo_url: logoUrl || null })
      .eq('id', id)

    if (logoError && !logoError.message.includes('column')) {
      console.error('Logo Update Error (clinics):', logoError)
      // We don't return here yet, we try the alternative
    }

    // 2c. Robust Save in public_clinic_settings
    // We update both logo_url and clinic_logo to be sure, and use a safe upsert logic
    const { data: existingSettings } = await supabaseAdmin
      .from('public_clinic_settings')
      .select('id')
      .eq('clinic_id', id)
      .maybeSingle()

    const settingsData = {
      clinic_id: id,
      tenant_id: tenantId,
      logo_url: logoUrl || null,
      clinic_logo: logoUrl || null, // Double check if this is the one
      favicon_url: logoUrl || null, // Optional but helpful
      updated_at: new Date().toISOString(),
      is_active: true
    }

    let sError;
    if (existingSettings) {
      const { error } = await supabaseAdmin
        .from('public_clinic_settings')
        .update(settingsData)
        .eq('id', existingSettings.id)
      sError = error
    } else {
      // Necesitamos un slug para insertar ya que es NOT NULL
      const { data: tenantData } = await supabaseAdmin
        .from('tenants')
        .select('slug')
        .eq('id', tenantId)
        .single()

      const { error } = await supabaseAdmin
        .from('public_clinic_settings')
        .insert([{
          ...settingsData,
          slug: tenantData?.slug || `clinica-${id}`
        }])
      sError = error
    }

    if (sError) {
      console.error('Settings Save Error:', sError)
      return { success: false, error: `Error al guardar logo en BBDD: ${sError.message}` }
    }

    revalidatePath('/admin/configuracion', 'page')
    revalidatePath('/admin', 'layout')
    revalidatePath(`/[slug]`, 'layout') 
    return { success: true }
  } catch (err: any) {
    console.error('Fatal Error:', err)
    return { success: false, error: err.message || 'Error inesperado' }
  }
}



export async function updateBusinessHours(clinicId: string, hours: any[]) {
  try {
    const { tenantId } = await requireRole(['admin'])
    const supabase = await createClient()

    // Security check
    const { data: targetClinic } = await supabase
      .from('clinics')
      .select('tenant_id')
      .eq('id', clinicId)
      .single()

    if (!targetClinic || targetClinic.tenant_id !== tenantId) {
      return { success: false, error: 'No tienes permisos para editar esta clínica' }
    }

    // 1. Validation
    for (const day of hours) {
      if (!day.is_closed) {
        const open = day.open_time.slice(0, 5)
        const close = day.close_time.slice(0, 5)
        if (close <= open) {
          return { success: false, error: `La hora de cierre debe ser posterior a la de apertura (${day.day_of_week})` }
        }
      }
    }
    
    // 2. UPSERT business hours
    const { error } = await supabase
      .from('business_hours')
      .upsert(hours.map(h => ({
        ...h,
        clinic_id: clinicId,
        updated_at: new Date().toISOString()
      })), { onConflict: 'clinic_id, day_of_week' })

    if (error) return { success: false, error: 'Error guardando horarios: ' + error.message }

    revalidatePath('/admin/configuracion')
    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: 'Error inesperado' }
  }
}
