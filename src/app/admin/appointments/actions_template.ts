'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * REGLA DE ORO PARA DOCTORES:
 * Cuando el rol sea doctor, la consulta a la base de datos SIEMPRE debe filtrar 
 * las reservas para que solo devuelva aquellas donde el doctor_id coincida 
 * con el ID del doctor logueado.
 */

export async function getAppointments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'No autenticado' }

  // 1. Obtener el perfil y rol del usuario actual
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, id')
    .eq('id', user.id)
    .single()

  let query = supabase.from('appointments').select('*')

  // 2. APLICAR REGLA DE AISLAMIENTO
  if (profile?.role === 'doctor') {
    // Si es doctor, solo puede ver sus propias citas
    // Se asume que staff_members.user_id = profile.id y staff_members.id es el que va en la cita
    
    // Primero buscamos el ID de staff del doctor
    const { data: staff } = await supabase
      .from('staff_members')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (staff) {
      query = query.eq('staff_id', staff.id)
    } else {
      // Si no es un registro de staff válido, no devolvemos nada por seguridad
      return { data: [] }
    }
  }

  const { data, error } = await query

  return { data, error }
}
