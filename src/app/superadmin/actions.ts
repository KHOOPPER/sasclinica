'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { sanitizeSlug } from '@/lib/utils'

export async function createTenant(prevState: any, formData: FormData) {
  let createdTenantId: string | null = null
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  console.log('--- INICIO PROCESO CREACIÓN TENANT ---')
  
  try {
    if (!serviceRoleKey || !supabaseUrl) {
      console.error('❌ ERROR CONFIG: Variables de entorno faltantes')
      return { error: 'Error de configuración: Faltan claves de Supabase en el servidor.' }
    }

    const supabase = await createClient()
    
    // First, securely verify the user is authenticated
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return { error: 'Sesión expirada o no autenticado.' }

    // Use admin client to verify role without RLS interference
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, serviceRoleKey)

    // Check if user is a superadmin using the ADMIN client
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_superadmin')
      .eq('id', authData.user.id)
      .single()

    if (!profile?.is_superadmin) {
      console.warn('⚠️ INTENTO NO AUTORIZADO: Usuario no es Superadmin', authData.user.id)
      return { error: 'No tienes permisos de Superadmin para realizar esta acción.' }
    }

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const plan = (formData.get('plan') as string) || 'profesional'
    const adminEmail = formData.get('adminEmail') as string
    const adminName = formData.get('adminName') as string
    const adminLastName = formData.get('adminLastName') as string
    const adminPassword = formData.get('adminPassword') as string

    console.log(`📝 VALIDANDO DATOS: Clinic: ${name}, Slug: ${slug}, Admin: ${adminEmail}`)

    if (!name || !slug) return { error: 'Nombre y slug son requeridos' }
    if (!adminEmail || !adminName || !adminPassword || !adminLastName) {
      return { error: 'Todos los campos del administrador son obligatorios.' }
    }

    // 0. Pre-flight Checks
    const { data: existingSlug } = await supabaseAdmin
      .from('tenants')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()
    if (existingSlug) return { error: `El slug "${slug}" ya está en uso.` }

    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', adminEmail)
      .maybeSingle()
    if (existingProfile) return { error: `El email "${adminEmail}" ya está registrado en la base de datos de perfiles.` }

    // 1. Create tenant
    console.log('🚀 PASO 1: Creando Tenant...')
    const { data: tenant, error: tenantError } = await supabaseAdmin
      .from('tenants')
      .insert({ name, slug, plan })
      .select()
      .single()

    if (tenantError) {
      console.error('❌ ERROR PASO 1 (Tenant):', tenantError)
      return { error: `DB Error [Tenant]: ${tenantError.message} (Code: ${tenantError.code})` }
    }

    createdTenantId = tenant.id

    // 2. Create the associated clinic
    console.log('🚀 PASO 2: Creando Clínica...')
    const { data: clinic, error: clinicError } = await supabaseAdmin
      .from('clinics')
      .insert({ 
        tenant_id: tenant.id, 
        name: name 
      })
      .select()
      .single()

    if (clinicError) {
      console.error('❌ ERROR PASO 2 (Clinic):', clinicError)
      throw new Error(`Error en Clínica: ${clinicError.message}`)
    }

    // 3. Create default public settings
    console.log('🚀 PASO 3: Creando Configuración Pública...')
    const { error: settingsError } = await supabaseAdmin
      .from('public_clinic_settings')
      .insert({
        tenant_id: tenant.id,
        clinic_id: clinic.id,
        slug: slug,
        is_active: true,
        welcome_text: `Bienvenido a ${name}`,
        hero_title: name,
        hero_subtitle: 'Tu salud es nuestra prioridad',
        primary_color: '#10b981',
        hero_layout: 'centered'
      })

    if (settingsError) {
      console.warn('⚠️ AVISO: Error no-crítico en settings:', settingsError.message)
    }

    // 4. Create auth user for this tenant
    console.log(`🚀 PASO 4: Creando Usuario Auth para ${adminEmail}...`)
    const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { first_name: adminName, last_name: adminLastName }
    })

    if (authError) {
      console.error('❌ ERROR CRÍTICO PASO 4 (Auth):', authError)
      // ROLLBACK: Delete the tenant (cascades to clinic and settings)
      console.log('↩️ EJECUTANDO ROLLBACK: Eliminando tenant parcial...')
      await supabaseAdmin.from('tenants').delete().eq('id', tenant.id)
      return { error: `Auth Error [${authError.status}]: ${authError.message}` }
    }

    if (newUser.user) {
      console.log('🚀 PASO 5: Creando Perfil y Vinculación...')
      // 5. Create profile for the admin
      const { error: profileError } = await supabaseAdmin.from('profiles').insert({
        id: newUser.user.id,
        email: adminEmail,
        role: 'admin',
        tenant_id: tenant.id,
        first_name: adminName,
        last_name: adminLastName
      })

      if (profileError) {
         console.error('❌ ERROR PASO 5 (Profile):', profileError)
         await supabaseAdmin.from('tenants').delete().eq('id', tenant.id)
         await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
         return { error: `Profile Error: ${profileError.message}` }
      }

      // 6. Link user to tenant
      const { error: linkError } = await supabaseAdmin.from('tenant_users').insert({
        tenant_id: tenant.id,
        user_id: newUser.user.id,
        role: 'admin'
      })

      if (linkError) {
         console.error('❌ ERROR PASO 6 (Link):', linkError)
         await supabaseAdmin.from('tenants').delete().eq('id', tenant.id)
         await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
         return { error: `Linking Error: ${linkError.message}` }
      }
    }

    console.log('✅ PROCESO COMPLETADO EXITOSAMENTE')
    revalidatePath('/superadmin')
    return { success: true }

  } catch (err: any) {
    console.error('💥 ERROR INESPERADO (Catch All):', err)
    // Attempt global rollback if tenant was created
    if (createdTenantId) {
      const supabaseAdmin = createSupabaseAdmin(supabaseUrl!, serviceRoleKey!)
      await supabaseAdmin.from('tenants').delete().eq('id', createdTenantId)
    }
    return { error: `Excepción Crítica: ${err.message || 'Error desconocido'}` }
  } finally {
    console.log('--- FIN PROCESO ---')
  }
}

export async function getPublicSettings(clinicId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('public_clinic_settings')
    .select('*')
    .eq('clinic_id', clinicId)
    .maybeSingle()
  
  if (!data) {
    return { clinic_id: clinicId, is_active: true }
  }
  return data
}

export async function updateWebsiteSettings(settings: any) {
  try {
    // First verify the caller is an authenticated user
    // Validar explícitamente usuario autenticado
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return { success: false, error: 'No autenticado' }

    // Admin client required — anon client blocked by RLS for profile reads
    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Extract ONLY the fields that belong to public_clinic_settings table
    const { 
      id, tenant_id, clinic_id, slug, is_active, 
      welcome_text, primary_color, secondary_color, 
      accent_color, animation_style, border_radius, 
      hero_layout, show_services, hero_badge, 
      hero_title, hero_subtitle, hero_image_url, 
      hero_title_italic, hero_subtitle_italic,
      logo_url, logo_height, logo_width, 
      logo_offset_y, logo_offset_x,
      trust_badge_1, trust_badge_2, trust_badge_3, 
      trust_badges_color, contact_title, contact_subtitle,
      contact_phone, contact_address, contact_whatsapp, contact_bg_color, contact_text_color,
      services_title, services_subtitle,
      map_coordinates, map_zoom, map_type, contact_layout, map_style,
      // V-Elite Fields
      hero_cta_text, hero_stat_1_value, hero_stat_1_text,
      hero_stat_2_value, hero_stat_2_text, hero_stat_3_value, hero_stat_3_text,
      show_top_banner, top_banner_text, top_banner_color,
      header_cta_text, nav_link_1, nav_link_2, nav_link_3, nav_link_4, nav_link_5,
      about_title, about_subtitle, about_description, about_image_url, show_about,
      about_variant, about_badge, about_badge_subtext, about_accent_color, about_bg_opacity, about_blur, about_overlay_opacity,
      show_specialties, specialties_title, specialties,
      insurance_text, schedule_weekdays, schedule_weekends, emergency_phone,
      // Premium Black & Gold Tokens
      header_variant, hero_variant, footer_variant, services_layout, footer_text,
      font_headlines, font_body, font_headline_weight, font_body_weight,
      bg_main, bg_secondary, text_main, text_secondary, navbar_bg, footer_bg,
      logo_padding_top, navbar_opacity, navbar_text_color,
      navbar_border_color, navbar_border_width, show_navbar_border,
      show_promotions, promo_variant, promotions_data,
      promotions_title, promotions_subtitle, promotions_badge, promotions_cta_text,
      promo_text_color, promo_bg_color, promo_section_bg, promo_accent_color,
      promo_cta_bg_color, promo_cta_text_color,
      show_testimonials, testimonials_variant, testimonials_data,
      active_sections,
      entry_animation, animation_duration, enable_animations,
      // Footer Expansion
      footer_show_info, footer_info_title, footer_info_desc,
      footer_show_nav, footer_nav_title,
      footer_nav_1_label, footer_nav_2_label, footer_nav_3_label, footer_nav_4_label, footer_nav_5_label,
      footer_show_schedule, footer_schedule_title, footer_schedule_weekdays_label, footer_schedule_weekends_label,
      footer_show_contact, footer_contact_title, footer_address_label, footer_phone_label, footer_cta_text,
    } = settings


    
    if (!clinic_id) {
      return { success: false, error: 'Falta el ID de la clínica' }
    }

    // --- DEFENSE IN DEPTH: GUARDA RBAC EXPLÍCITA ---
    let trueTenantId = tenant_id;
    // Must use admin client — anon client blocked by RLS returns null for is_superadmin
    const { data: profile } = await supabaseAdmin.from('profiles').select('is_superadmin, role').eq('id', authData.user.id).single()
    
    if (!profile?.is_superadmin) {
      // 1. Obtener a qué tenant le pertenece ESTA clínica realmente
      const { data: clinic } = await supabase.from('clinics').select('tenant_id').eq('id', clinic_id).single()
      if (!clinic) return { success: false, error: 'Clínica no encontrada o acceso denegado (Aislamiento Multi-Tenant activado)' }
      
      // 2. Comprobar que authData.user es un 'admin' de este tenant en particular
      const { data: membership } = await supabase.from('tenant_users')
        .select('role')
        .eq('tenant_id', clinic.tenant_id)
        .eq('user_id', authData.user.id)
        .single()

      if (membership?.role !== 'admin') {
        return { success: false, error: 'Permisos insuficientes para modificar el sitio de esta clínica' }
      }

      // 3. Sobreescribir el tenant_id del payload malicioso si intentaron inyectar otro
      trueTenantId = clinic.tenant_id;
    }
    // ---------------------------------------------

    const payload: any = {
      tenant_id: trueTenantId, clinic_id, slug, is_active, 
      welcome_text, primary_color, secondary_color, 
      accent_color, animation_style, border_radius, 
      hero_layout, show_services, hero_badge, 
      hero_title, hero_subtitle, hero_image_url, 
      hero_title_italic, hero_subtitle_italic,
      logo_url, logo_height, logo_width, 
      logo_offset_y, logo_offset_x,
      trust_badge_1, trust_badge_2, trust_badge_3, 
      trust_badges_color, contact_title, contact_subtitle,
      contact_phone, contact_address, contact_whatsapp, contact_bg_color, contact_text_color,
      services_title, services_subtitle,
      map_coordinates, map_zoom, map_type, contact_layout, map_style,
      hero_cta_text, hero_stat_1_value, hero_stat_1_text,
      hero_stat_2_value, hero_stat_2_text, hero_stat_3_value, hero_stat_3_text,
      show_top_banner, top_banner_text, top_banner_color,
      header_cta_text, nav_link_1, nav_link_2, nav_link_3, nav_link_4, nav_link_5,
      about_title, about_subtitle, about_description, about_image_url, show_about,
      about_variant, about_badge, about_badge_subtext, about_accent_color, about_bg_opacity, about_blur, about_overlay_opacity,
      show_specialties, specialties_title, specialties,
      insurance_text, schedule_weekdays, schedule_weekends, emergency_phone,
      header_variant, hero_variant, footer_variant, services_layout, footer_text,
      font_headlines, font_body, font_headline_weight, font_body_weight,
      bg_main, bg_secondary, text_main, text_secondary, navbar_bg, footer_bg,
      logo_padding_top, navbar_opacity, navbar_text_color,
      navbar_border_color, navbar_border_width, show_navbar_border,
      show_promotions, promo_variant, promotions_data,
      promotions_title, promotions_subtitle, promotions_badge, promotions_cta_text,
      promo_text_color, promo_bg_color, promo_section_bg, promo_accent_color,
      promo_cta_bg_color, promo_cta_text_color,
      show_testimonials, testimonials_variant, testimonials_data,
      active_sections,
      entry_animation, animation_duration, enable_animations,
      footer_show_info, footer_info_title, footer_info_desc,
      footer_show_nav, footer_nav_title,
      footer_nav_1_label, footer_nav_2_label, footer_nav_3_label, footer_nav_4_label, footer_nav_5_label,
      footer_show_schedule, footer_schedule_title, footer_schedule_weekdays_label, footer_schedule_weekends_label,
      footer_show_contact, footer_contact_title, footer_address_label, footer_phone_label, footer_cta_text,
      updated_at: new Date().toISOString()
    }

    // Remove undefined values
    Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k])

    // SANITIZACIÓN FINAL DEL SLUG
    if (payload.slug) {
      payload.slug = sanitizeSlug(payload.slug)
    }

    // --- UPSERT ATÓMICO (Insert or Update) ---
    const { data, error } = await supabaseAdmin
      .from('public_clinic_settings')
      .upsert(payload, { 
        onConflict: 'clinic_id',
        ignoreDuplicates: false 
      })
      .select()
      .single()

    if (error) {
      console.error('❌ ERROR SAVING SETTINGS:', JSON.stringify(error))
      return { success: false, error: error.message }
    }
    
    // Revalidate the public page (App Router requires exact matches or 'page' type)
    revalidatePath('/[slug]', 'page')
    if (payload.slug) {
      // Revalida exactamente la url ej: /dra-portillo
      revalidatePath(`/${payload.slug}`, 'page')
    }
    
    return { success: true }
  } catch (err: any) {
    console.error('❌ UNEXPECTED ERROR:', err)
    return { success: false, error: err?.message || 'Error inesperado al guardar' }
  }
}

export async function updateServiceImage(serviceId: string, imageUrl: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  const { error } = await supabase
    .from('services')
    .update({ image_url: imageUrl })
    .eq('id', serviceId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteTenant(id: string) {
  try {
    // Verify the caller is an authenticated superadmin
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return { error: 'No autenticado' }

    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_superadmin')
      .eq('id', authData.user.id)
      .single()
    if (!profile?.is_superadmin) return { error: 'No tienes permisos de Superadmin' }
    
    const { error } = await supabaseAdmin
      .from('tenants')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting tenant:', error)
      return { error: error.message || 'Error al eliminar la clínica' }
    }

    revalidatePath('/superadmin')
    return { success: true }
  } catch (err: any) {
    console.error('Unexpected error during delete:', err)
    return { error: err.message || 'Error inesperado' }
  }
}

export async function updateTenant(id: string, name: string, slug: string) {
  try {
    // Verify the caller is an authenticated superadmin
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return { error: 'No autenticado' }

    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_superadmin')
      .eq('id', authData.user.id)
      .single()
    if (!profile?.is_superadmin) return { error: 'No tienes permisos de Superadmin' }
    
    const { error: tenantError } = await supabaseAdmin
      .from('tenants')
      .update({ name, slug })
      .eq('id', id)

    if (tenantError) {
      console.error('Error updating tenant:', tenantError)
      return { error: tenantError.message || 'Error al actualizar la clínica' }
    }

    await supabaseAdmin
      .from('clinics')
      .update({ name })
      .eq('tenant_id', id)

    await supabaseAdmin
      .from('public_clinic_settings')
      .update({ slug })
      .eq('tenant_id', id)

    revalidatePath('/superadmin')
    return { success: true }
  } catch (err: any) {
    console.error('Unexpected error during update:', err)
    return { error: err.message || 'Error inesperado' }
  }
}

export async function updateTenantPlan(tenantId: string, plan: string, expiryDate: string, mrr: number) {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return { error: 'No autenticado' }

    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_superadmin')
      .eq('id', authData.user.id)
      .single()
    if (!profile?.is_superadmin) return { error: 'No tienes permisos de Superadmin' }

    // Calcular meses aproximados para el log de pagos (solo para métricas)
    const d1 = new Date()
    const d2 = new Date(expiryDate)
    const months = Math.max(1, (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()))

    // Update tenant
    const { error: tenantError } = await supabaseAdmin
      .from('tenants')
      .update({ 
        plan, 
        plan_expires_at: new Date(expiryDate + 'T23:59:59').toISOString(), 
        plan_mrr: mrr,
        subscription_status: 'active'
      })
      .eq('id', tenantId)

    if (tenantError) return { error: tenantError.message }

    // Log manual payment for metrics
    await supabaseAdmin.from('manual_payments').insert({
      tenant_id: tenantId,
      amount: mrr * months,
      months,
      plan_type: plan
    })

    revalidatePath('/superadmin')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Error inesperado' }
  }
}
