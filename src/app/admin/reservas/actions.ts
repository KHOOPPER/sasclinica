'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createAppointment(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'No autenticado' }

    // Get tenant
    const { data: tenantUser } = await supabase
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', user.id)
      .single()

    if (!tenantUser) return { success: false, error: 'Sin acceso a clínica' }

    const patientId = formData.get('patientId') as string
    const staffId = formData.get('staffId') as string // doctor_id
    const serviceId = formData.get('serviceId') as string
    const startTimeStr = formData.get('startTime') as string
    const notes = formData.get('notes') as string

    if (!patientId || !staffId || !serviceId || !startTimeStr) {
      return { success: false, error: 'Todos los campos son obligatorios' }
    }

    const startTime = new Date(startTimeStr)
    
    // 1. Get service duration and clinic_id
    const { data: service } = await supabase
      .from('services')
      .select('duration_minutes, clinic_id')
      .eq('id', serviceId)
      .single()

    if (!service) return { success: false, error: 'Servicio no encontrado. Por favor seleccione un servicio válido.' }
    
    const clinicId = service.clinic_id
    const durationMinutes = service.duration_minutes
    const finalServiceId = serviceId

    const endTime = new Date(startTime.getTime() + durationMinutes * 60000)

    // 2. Business Hours Validation
    const dayOfWeek = startTime.getDay()
    const { data: businessHour } = await supabase
      .from('business_hours')
      .select('*')
      .eq('clinic_id', clinicId)
      .eq('day_of_week', dayOfWeek)
      .maybeSingle()

    if (businessHour) {
      if (businessHour.is_closed) {
        return { success: false, error: 'La clínica está cerrada este día' }
      }
      
      const openTime = businessHour.open_time // 'HH:MM:SS'
      const closeTime = businessHour.close_time

      const startTimeOnly = startTime.toTimeString().slice(0, 8)
      const endTimeOnly = endTime.toTimeString().slice(0, 8)

      if (startTimeOnly < openTime || endTimeOnly > closeTime) {
        return { success: false, error: `La clínica atiende de ${openTime.slice(0, 5)} a ${closeTime.slice(0, 5)}` }
      }
    }

    // 3. Conflict Check (Overlap)
    const { data: conflict } = await supabase
      .from('appointments')
      .select('id')
      .eq('staff_id', staffId)
      .or(`and(start_time.lt.${endTime.toISOString()},end_time.gt.${startTime.toISOString()})`)
      .limit(1)
      .maybeSingle()

    if (conflict) {
      return { success: false, error: 'El doctor ya tiene una cita programada en este horario' }
    }

    // 3. Insert Appointment
    const { error } = await supabase.from('appointments').insert({
      tenant_id: tenantUser.tenant_id,
      clinic_id: clinicId,
      patient_id: patientId,
      staff_id: staffId,
      service_id: finalServiceId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'pending', // maps to scheduled usually
      notes: notes || null
    })

    if (error) return { success: false, error: 'Error guardando cita: ' + error.message }

    revalidatePath('/admin/reservas')
    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: 'Error inesperado del servidor' }
  }
}

export async function deleteAppointment(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'No autenticado' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const allowedRoles = ['admin', 'superadmin']
    if (!profile || !allowedRoles.includes(profile.role)) {
      return { success: false, error: 'No tienes permisos para eliminar citas' }
    }

    const { error } = await supabase.from('appointments').delete().eq('id', id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/admin/reservas')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: 'Error inesperado' }
  }
}


export async function markAsNotified(id: string) {
  try {
    // Verify the caller is authenticated before using service role
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'No autenticado' }

    const supabaseAdmin = createAdminClient()
    const { error } = await supabaseAdmin
      .from('appointments')
      .update({ notified: true })
      .eq('id', id)
    
    if (error) {
      console.error('NOTIFY ERROR:', error)
      return { success: false, error: error.message }
    }
    
    revalidatePath('/admin/reservas')
    return { success: true }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: 'Error al marcar como notificado' }
  }
}

