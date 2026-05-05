'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { addMinutes, format, parseISO, isBefore } from 'date-fns'
import { sanitizeSlug } from '@/lib/utils'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function getClinicBySlug(slug: string) {
  const cleanSlug = sanitizeSlug(slug)
  const supabase = getServiceClient()
  
  // 1. Intentar buscar por settings públicos (Vista personalizada)
  let { data, error } = await supabase
    .from('public_clinic_settings')
    .select(`
      *,
      clinic:clinics (
        id,
        name,
        address,
        phone,
        services (
          id,
          name,
          description,
          price,
          duration_minutes,
          is_active,
          image_url
        )
      )
    `)
    .ilike('slug', cleanSlug) // Case-insensitive para evitar 404 por mayúsculas
    .maybeSingle()

  // 2. Si no hay settings o están inactivos, BUSCAR EL TENANT (Auto-generación / Fallback)
  if (!data || !data.is_active) {
    // Si data existe pero es inactivo, intentamos ver si el tenant existe para dar un placeholder
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, name, clinics(id, name, address, phone)')
      .ilike('slug', cleanSlug)
      .maybeSingle()

    if (tenant) {
      const clinic = tenant.clinics?.[0]
      // Simular un objeto de configuración por defecto para que la página cargue
      return {
        tenant_id: tenant.id,
        clinic_id: clinic?.id,
        slug: slug,
        is_active: true, // Forzamos activo para el fallback
        hero_title: tenant.name,
        hero_subtitle: 'Tu salud es nuestra prioridad',
        welcome_text: `Bienvenido a ${tenant.name}`,
        primary_color: '#0ea5e9',
        hero_layout: 'centered',
        clinic: clinic ? {
            ...clinic,
            services: [] // No hay servicios si no hay settings aún
        } : null
      }
    }
    
    return null
  }

  return data
}

export async function getAvailableSlots(clinicId: string, dateStr: string, serviceDuration: number) {
  const supabase = await createClient()
  const dayOfWeek = parseISO(dateStr).getDay()

  // 1. Get business hours for that day
  const { data: businessHours } = await supabase
    .from('business_hours')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('day_of_week', dayOfWeek)
    .single()

  if (!businessHours || businessHours.is_closed) return []

  // 2. Get existing appointments for that day
  const startDay = `${dateStr}T00:00:00Z`
  const endDay = `${dateStr}T23:59:59Z`
  const { data: existingAppointments } = await supabase
    .from('appointments')
    .select('start_time, end_time')
    .eq('clinic_id', clinicId)
    .neq('status', 'cancelled')
    .gte('start_time', startDay)
    .lte('start_time', endDay)

  // 3. Generate slots of 30 mins
  const slots = []
  let current = parseISO(`${dateStr}T${businessHours.open_time}`)
  const end = parseISO(`${dateStr}T${businessHours.close_time}`)
  const now = new Date()

  while (isBefore(current, end)) {
    const slotStart = current
    const slotEnd = addMinutes(current, serviceDuration)

    // Check if slot falls within business hours and doesn't overlap with existing appointments
    if (isBefore(slotEnd, end) || format(slotEnd, 'HH:mm') === format(end, 'HH:mm')) {
      const isOccupied = existingAppointments?.some(app => {
        const appStart = new Date(app.start_time)
        const appEnd = new Date(app.end_time)
        // Overlap logic: (StartA < EndB) and (EndA > StartB)
        return (slotStart < appEnd && slotEnd > appStart)
      })

      // Also check if slot is in the past if date is today
      const isPast = isBefore(slotStart, now)

      if (!isOccupied && !isPast) {
        slots.push(format(slotStart, 'HH:mm'))
      }
    }
    current = addMinutes(current, 30) // Always move in 30min steps for the list
  }

  return slots
}

export async function createPublicAppointment(formData: any) {
  // 1. Validate real tenant_id from DB securely
  const publicSupabase = await createClient()
  const { data: clinicMeta } = await publicSupabase.from('clinics').select('tenant_id').eq('id', formData.clinic_id).single()
  
  if (!clinicMeta) return { success: false, error: 'Clínica no válida o no encontrada' }

  // 2. Find a staff member
  const { data: staff } = await publicSupabase
    .from('staff_members')
    .select('id')
    .eq('clinic_id', formData.clinic_id)
    .limit(1)
    .single()

  if (!staff) return { success: false, error: 'No hay personal disponible en este momento.' }

  // 3. Create the appointment using Service Key to bypass RLS, ensuring strictly valid input
  const serviceClient = getServiceClient()
  const { data, error } = await serviceClient
    .from('appointments')
    .insert([{
      tenant_id: clinicMeta.tenant_id, // Forzamos el backend real
      clinic_id: formData.clinic_id,
      service_id: formData.service_id,
      staff_id: staff.id,
      start_time: formData.start_time,
      end_time: formData.end_time,
      patient_name: formData.patient_name,
      patient_phone: formData.patient_phone,
      patient_dui: formData.patient_dui,
      patient_email: formData.patient_email,
      status: 'pending',
      notes: 'Reserva desde sitio público'
    }])
    .select('*, service:services(*), clinic:clinics(*)')
    .single()

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/agenda')
  
  return { success: true, data }
}
