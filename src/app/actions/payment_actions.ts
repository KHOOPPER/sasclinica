'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActionState = {
  success?: boolean
  error?: string | null
}

export async function createPayment(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  
  const appointmentId = formData.get('appointmentId') as string
  const amount = parseFloat(formData.get('amount') as string)
  const method = formData.get('method') as string
  const notes = formData.get('notes') as string
  const tenantId = formData.get('tenantId') as string

  if (!appointmentId || isNaN(amount) || !method || !tenantId) {
    return { error: 'Faltan datos obligatorios para procesar el pago.' }
  }

  try {
    // 1. Create the payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        appointment_id: appointmentId,
        tenant_id: tenantId,
        amount,
        payment_method: method,
        notes
      })

    if (paymentError) throw paymentError

    // 2. Update the appointment status to 'completed'
    const { error: appointmentError } = await supabase
      .from('appointments')
      .update({ status: 'completed' })
      .eq('id', appointmentId)

    if (appointmentError) throw appointmentError

    revalidatePath('/admin/reservas')
    revalidatePath('/admin') // Update dashboard
    
    return { success: true }
  } catch (error: any) {
    console.error('Error creating payment:', error)
    return { error: error.message || 'Error al procesar el pago.' }
  }
}

export async function markAsAttended(appointmentId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('appointments')
    .update({ status: 'attended_pending_payment' as any })
    .eq('id', appointmentId)

  if (error) {
    console.error('Error marking as attended:', error)
    return { error: 'No se pudo actualizar el estado de la cita.' }
  }

  revalidatePath('/admin/reservas')
  return { success: true }
}
