'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function createStaffMember(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()

    if (!authData.user) return { error: 'No autenticado' }

    // 1. Get Admin's tenant_id and role with Plan info
    const { data: tenantUser } = await supabase
      .from('tenant_users')
      .select(`
        tenant_id, 
        role, 
        tenants (
          plan
        )
      `)
      .eq('user_id', authData.user.id)
      .single()

    if (!tenantUser || tenantUser.role !== 'admin') {
      return { error: 'No tienes permisos de administrador para esta clínica' }
    }

    // --- CHECK STAFF LIMITS BY PLAN ---
    const currentPlan = (tenantUser.tenants as any)?.plan || 'basic'
    const limits: Record<string, number> = { 'basic': 2, 'professional': 4, 'elite': 999 }
    const maxWorkers = limits[currentPlan] || 2

    const { count, error: countError } = await supabase
      .from('staff_members')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantUser.tenant_id)

    if (countError) return { error: 'Error verificando límites: ' + countError.message }
    
    if (count !== null && count >= maxWorkers) {
      return { 
        error: `LÍMITE ALCANZADO: Tu plan ${currentPlan.toUpperCase()} solo permite ${maxWorkers} trabajadores. Por favor, contacta a soporte o mejora tu plan para agregar más personal.`,
        isLimitError: true 
      }
    }
    // ----------------------------------

    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string
    const imageUrl = formData.get('imageUrl') as string

    // Map roles to valid DB enum values ('superadmin', 'admin', 'staff', 'patient')
    const dbRole = (role === 'receptionist' || role === 'doctor') ? 'staff' : role;

    if (!firstName || !lastName || !email || !password || !role) {
      console.error('MISSING FIELDS: required fields for staff creation are missing')
      return { error: 'Todos los campos son obligatorios' }
    }

    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 2. Ensure a default clinic exists for the tenant (required by current schema)
    const { data: existingClinic } = await supabaseAdmin
      .from('clinics')
      .select('id')
      .eq('tenant_id', tenantUser.tenant_id)
      .limit(1)
      .maybeSingle()

    let clinicId = existingClinic?.id

    if (!clinicId) {
      const { data: newClinic, error: clinicError } = await supabaseAdmin
        .from('clinics')
        .insert({ 
          tenant_id: tenantUser.tenant_id, 
          name: 'Sede Principal'
        })
        .select()
        .single()
      
      if (clinicError) return { error: 'Error creando sede por defecto: ' + clinicError.message }
      clinicId = newClinic.id
    }

    if (!clinicId) return { error: 'No se pudo determinar la sede de la clínica' }

    // 3. Create Auth User
    const { data: newAuthUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name: firstName, last_name: lastName }
    })

    if (authError) return { error: 'Error creando credenciales: ' + authError.message }

    // 4. Create Profile & Staff Record
    if (newAuthUser.user) {
      const userId = newAuthUser.user.id

      try {
        // A. Profile
        const { error: profileError } = await supabaseAdmin.from('profiles').insert({
          id: userId,
          email,
          first_name: firstName,
          last_name: lastName,
          role: dbRole, // Use mapped role for db enum compliance
          tenant_id: tenantUser.tenant_id,
          image_url: imageUrl
        })

        if (profileError) {
          await supabaseAdmin.auth.admin.deleteUser(userId)
          return { error: 'Error creando perfil: ' + profileError.message }
        }

        // B. Staff Member
        const { error: staffError } = await supabaseAdmin.from('staff_members').insert({
          tenant_id: tenantUser.tenant_id,
          clinic_id: clinicId,
          user_id: userId,
          specialty: role,
          full_name: `${firstName} ${lastName}`,
          email: email
        })

        if (staffError) {
          await supabaseAdmin.from('profiles').delete().eq('id', userId)
          await supabaseAdmin.auth.admin.deleteUser(userId)
          return { error: 'Error vinculando trabajador: ' + staffError.message }
        }

        // C. Tenant User link
        const { error: tuError } = await supabaseAdmin.from('tenant_users').insert({
          tenant_id: tenantUser.tenant_id,
          user_id: userId,
          role: dbRole // Use mapped role
        })

        if (tuError) {
          // Cleanup
          await supabaseAdmin.from('staff_members').delete().eq('user_id', userId)
          await supabaseAdmin.from('profiles').delete().eq('id', userId)
          await supabaseAdmin.auth.admin.deleteUser(userId)
          return { error: 'Error al dar acceso a la clínica: ' + tuError.message }
        }

      } catch (dbError: any) {
        // Failsafe cleanup
        await supabaseAdmin.auth.admin.deleteUser(userId)
        throw dbError
      }
    }

    revalidatePath('/admin/trabajadores')
    return { success: true, error: undefined }

  } catch (err: any) {
    console.error(err)
    return { success: false, error: 'Error inesperado del servidor' }
  }
}

export async function deleteStaffMember(staffId: string, userId: string) {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return { success: false, error: 'No autenticado' }

    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Delete Staff Member
    const { error: staffError } = await supabaseAdmin
      .from('staff_members')
      .delete()
      .eq('id', staffId)
    
    if (staffError) return { success: false, error: 'Error eliminando registro: ' + staffError.message }

    // 2. Delete Tenant User link
    await supabaseAdmin.from('tenant_users').delete().eq('user_id', userId)

    // 3. Delete Profile
    await supabaseAdmin.from('profiles').delete().eq('id', userId)

    // 4. Delete Auth User
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (authError) console.error('Error deleting auth user:', authError.message)

    revalidatePath('/admin/trabajadores')
    return { success: true, error: undefined }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: 'Error inesperado al eliminar' }
  }
}

export async function updateStaffMember(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) return { success: false, error: 'No autenticado' }

    const id = formData.get('id') as string
    const userId = formData.get('userId') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const role = formData.get('role') as string
    const imageUrl = formData.get('imageUrl') as string
    const newPassword = formData.get('newPassword') as string

    // Map roles to valid DB enum values
    const dbRole = (role === 'receptionist' || role === 'doctor') ? 'staff' : role;

    if (!id || !userId || !firstName || !lastName || !role) {
      return { success: false, error: 'Todos los campos son obligatorios' }
    }

    // 1. Update profile (including role)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        first_name: firstName, 
        last_name: lastName, 
        image_url: imageUrl,
        role: dbRole // Update role with mapped DB enum
      })
      .eq('id', userId)

    if (profileError) return { success: false, error: 'Error actualizando perfil: ' + profileError.message }

    // 1.1 Update tenant_users role (using admin client to be safe)
    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    await supabaseAdmin
      .from('tenant_users')
      .update({ role: dbRole })
      .eq('user_id', userId)

    // 2. Update denormalized fields in staff_members
    await supabase
      .from('staff_members')
      .update({ specialty: role, full_name: `${firstName} ${lastName}` })
      .eq('id', id)

    // 3. Optional password change via admin client
    if (newPassword && newPassword.trim().length >= 6) {
      const supabaseAdmin = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { error: pwError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword.trim()
      })
      if (pwError) return { success: false, error: 'Error cambiando contraseña: ' + pwError.message }
    } else if (newPassword && newPassword.trim().length > 0 && newPassword.trim().length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' }
    }

    revalidatePath('/admin/trabajadores')
    return { success: true, error: undefined }
  } catch (err: any) {
    console.error(err)
    return { success: false, error: 'Error inesperado al actualizar' }
  }
}
