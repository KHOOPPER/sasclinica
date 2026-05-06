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

    // 2. Update clinics basic data (name, address, phone) + logo
    const { error: clinicError } = await supabaseAdmin
      .from('clinics')
      .update({ name, address, phone, logo_url: logoUrl || null, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (clinicError) {
      console.error('Clinic Update Error:', clinicError)
      return { success: false, error: 'Error actualizando clínica: ' + clinicError.message }
    }

    // 3. Upsert logo into public_clinic_settings
    const { data: existingSettings } = await supabaseAdmin
      .from('public_clinic_settings')
      .select('id')
      .eq('clinic_id', id)
      .maybeSingle()

    // ONLY update logo_url and clinic_logo — do NOT include columns that may not exist
    const logoData = {
      logo_url: logoUrl || null,
      clinic_logo: logoUrl || null,
      updated_at: new Date().toISOString(),
    }

    let sError
    if (existingSettings) {
      const { error } = await supabaseAdmin
        .from('public_clinic_settings')
        .update(logoData)
        .eq('id', existingSettings.id)
      sError = error
    } else {
      const { data: tenantData } = await supabaseAdmin
        .from('tenants').select('slug').eq('id', tenantId).single()
      const { error } = await supabaseAdmin
        .from('public_clinic_settings')
        .insert([{ ...logoData, clinic_id: id, tenant_id: tenantId, slug: tenantData?.slug || `clinica-${id}`, is_active: true }])
      sError = error
    }

    if (sError) {
      console.error('Settings Logo Save Error:', sError)
      return { success: false, error: `Error guardando logo: ${sError.message}` }
    }

    revalidatePath('/admin/configuracion', 'page')
    revalidatePath('/admin', 'layout')
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
