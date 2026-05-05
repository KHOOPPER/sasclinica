'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function createService(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return { success: false, error: 'No autenticado' }

    // Get Admin's tenant
    const { data: tenantUser } = await supabase
      .from('tenant_users')
      .select('tenant_id, role')
      .eq('user_id', authData.user.id)
      .single()

    if (!tenantUser || tenantUser.role !== 'admin') {
      return { success: false, error: 'No tienes permisos de administrador' }
    }

    // Get clinic for this tenant
    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: clinic } = await supabaseAdmin
      .from('clinics')
      .select('id')
      .eq('tenant_id', tenantUser.tenant_id)
      .limit(1)
      .maybeSingle()

    let clinicId = clinic?.id
    if (!clinicId) {
      const { data: newClinic, error: clinicError } = await supabaseAdmin
        .from('clinics')
        .insert({ tenant_id: tenantUser.tenant_id, name: 'Sede Principal' })
        .select()
        .single()
      if (clinicError) return { success: false, error: 'Error creando sede: ' + clinicError.message }
      clinicId = newClinic.id
    }

    const name = (formData.get('name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const price = parseFloat(formData.get('price') as string)
    const duration = parseInt(formData.get('duration') as string)
    const image_url = (formData.get('image_url') as string)?.trim()
    const is_published = formData.get('is_published') === 'true'
    const specialty_id = formData.get('specialty_id') as string
    const is_offer = formData.get('is_offer') === 'true'
    const offer_price = parseFloat(formData.get('offer_price') as string)
    const offer_description = (formData.get('offer_description') as string)?.trim()

    if (!name || isNaN(price) || isNaN(duration)) {
      return { success: false, error: 'Nombre, precio y duración son obligatorios' }
    }

    const { error } = await supabaseAdmin.from('services').insert({
      tenant_id: tenantUser.tenant_id,
      clinic_id: clinicId,
      name,
      description: description || null,
      price,
      duration_minutes: duration,
      image_url: image_url || null,
      is_active: is_published,
      specialty_id: specialty_id || null,
      is_offer,
      offer_price: isNaN(offer_price) ? null : offer_price,
      offer_description: offer_description || null
    })

    if (error) return { success: false, error: 'Error creando servicio: ' + error.message }

    revalidatePath('/admin/servicios')
    return { success: true, error: undefined }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: 'Error inesperado del servidor' }
  }
}

export async function updateService(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return { success: false, error: 'No autenticado' }

    const id = formData.get('id') as string
    const name = (formData.get('name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const price = parseFloat(formData.get('price') as string)
    const duration = parseInt(formData.get('duration') as string)
    const image_url = (formData.get('image_url') as string)?.trim()
    const is_published = formData.get('is_published') === 'true'
    const specialty_id = formData.get('specialty_id') as string
    const is_offer = formData.get('is_offer') === 'true'
    const offer_price = parseFloat(formData.get('offer_price') as string)
    const offer_description = (formData.get('offer_description') as string)?.trim()

    if (!id || !name || isNaN(price) || isNaN(duration)) {
      return { success: false, error: 'Nombre, precio y duración son obligatorios' }
    }

    const { error } = await supabase
      .from('services')
      .update({
        name,
        description: description || null,
        price,
        duration_minutes: duration,
        image_url: image_url || null,
        is_active: is_published,
        specialty_id: specialty_id || null,
        is_offer,
        offer_price: isNaN(offer_price) ? null : offer_price,
        offer_description: offer_description || null
      })
      .eq('id', id)

    if (error) return { success: false, error: 'Error actualizando servicio: ' + error.message }

    revalidatePath('/admin/servicios')
    return { success: true, error: undefined }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: 'Error inesperado al actualizar' }
  }
}

export async function deleteService(serviceId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('services').delete().eq('id', serviceId)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/servicios')
    return { success: true, error: undefined }
  } catch (err: any) {
    return { success: false, error: 'Error inesperado al eliminar' }
  }
}
export async function createSpecialty(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return { success: false, error: 'No autenticado' }

    const { data: tenantUser } = await supabase
      .from('tenant_users')
      .select('tenant_id, role')
      .eq('user_id', authData.user.id)
      .single()

    if (!tenantUser || tenantUser.role !== 'admin') {
      return { success: false, error: 'No tienes permisos de administrador' }
    }

    const name = (formData.get('name') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()
    const icon_url = (formData.get('icon_url') as string)?.trim()

    if (!name) return { success: false, error: 'El nombre es obligatorio' }

    const { error } = await supabase.from('specialties').insert({
      tenant_id: tenantUser.tenant_id,
      name,
      description: description || null,
      icon_url: icon_url || null
    })

    if (error) return { success: false, error: 'Error creando especialidad: ' + error.message }

    revalidatePath('/admin/servicios')
    return { success: true, error: undefined }
  } catch (err: any) {
    return { success: false, error: 'Error inesperado' }
  }
}
