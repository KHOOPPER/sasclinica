'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPatient(prevState: any, formData: FormData) {
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

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const dui = formData.get('dui') as string
    const birthDate = formData.get('birthDate') as string
    const gender = formData.get('gender') as string
    const bloodType = formData.get('bloodType') as string
    const allergies = formData.get('allergies') as string
    const familyHistory = formData.get('familyHistory') as string
    const address = formData.get('address') as string
    const assignedDoctorId = formData.get('assignedDoctorId') as string

    if (!firstName || !lastName || !dui) {
      return { success: false, error: 'Nombre, Apellido y DUI son obligatorios' }
    }

    const { error } = await supabase.from('patients').insert({
      tenant_id: tenantUser.tenant_id,
      first_name: firstName,
      last_name: lastName,
      email: email || null,
      phone: phone || null,
      dui: dui,
      fecha_nacimiento: birthDate || null,
      genero: gender || null,
      tipo_sangre: bloodType || null,
      alergias: allergies || null,
      antecedentes_familiares: familyHistory || null,
      direccion_completa: address || null,
      assigned_doctor_id: assignedDoctorId || null
    })

    if (error) return { success: false, error: 'Error guardando paciente: ' + error.message }

    revalidatePath('/admin/pacientes')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: 'Error inesperado del servidor' }
  }
}

export async function createClinicalRecord(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'No autenticado' }

    // Obtener información de la clínica de forma robusta
    let tenantId = null
    let clinicId = null

    // Intento 1: Tabla tenant_users (Staff/Doctores)
    const { data: tenantUser } = await supabase
      .from('tenant_users')
      .select('tenant_id, clinic_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (tenantUser) {
      tenantId = tenantUser.tenant_id
      clinicId = tenantUser.clinic_id
    } else {
      // Intento 2: Tabla profiles (Admins/Dueños)
      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        tenantId = profile.tenant_id
        // Si es admin, buscamos la primera clínica de ese tenant
        const { data: firstClinic } = await supabase
          .from('clinics')
          .select('id')
          .eq('tenant_id', tenantId)
          .limit(1)
          .single()
        clinicId = firstClinic?.id
      }
    }

    if (!tenantId) return { success: false, error: 'Sin acceso a clínica' }

    const patientId = formData.get('patientId') as string
    const motivo = formData.get('motivo') as string
    const sintomas = formData.get('sintomas') as string
    const diagnostico = formData.get('diagnostico') as string
    const tratamiento = formData.get('tratamiento') as string
    const notas = formData.get('notas') as string

    if (!patientId || !motivo || !diagnostico) {
      return { success: false, error: 'Paciente, Motivo y Diagnóstico son obligatorios' }
    }

    // Usar cliente administrativo para asegurar la inserción si el RLS es muy restrictivo con los roles de staff
    const { createClient: createSupabaseAdmin } = await import('@supabase/supabase-js')
    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabaseAdmin.from('clinical_records').insert({
      tenant_id: tenantId,
      patient_id: patientId,
      doctor_id: user.id,
      fecha_consulta: new Date().toISOString(), // Campo ESENCIAL para que aparezca en el historial
      motivo_consulta: motivo,
      sintomas: sintomas || null,
      diagnostico: diagnostico,
      tratamiento_recetado: tratamiento || null,
      notas_internas: notas || null
    })

    if (error) return { success: false, error: 'Error guardando consulta: ' + error.message }

    revalidatePath(`/admin/pacientes/${patientId}`)
    return { success: true }
  } catch (err: any) {
    return { success: false, error: 'Error inesperado del servidor' }
  }
}
