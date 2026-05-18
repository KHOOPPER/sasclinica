'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { addMinutes, format, parseISO, startOfDay, isBefore } from 'date-fns'

export async function getClinicBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('public_clinic_settings')
    .select(`
      *,
      clinic:clinics (
        id,
        name,
        logo_url,
        address,
        phone,
        services (
          id,
          name,
          description,
          price,
          duration_minutes,
          image_url,
          is_active
        )
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
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
  const supabase = await createClient()

  // 1. Find a staff member for this clinic (defaulting to the first one for now)
  const { data: staff } = await supabase
    .from('staff_members')
    .select('id')
    .eq('clinic_id', formData.clinic_id)
    .limit(1)
    .single()

  if (!staff) return { success: false, error: 'No hay personal disponible en este momento.' }

  // 2. Create the appointment
  const { data, error } = await supabase
    .from('appointments')
    .insert([{
      tenant_id: formData.tenant_id,
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

  // Revalidate admin views
  revalidatePath('/admin/agenda')
  
  return { success: true, data }
}
