'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function login(prevState: any, formData: FormData) {
  let redirectUrl = ''

  try {
    const supabase = await createClient()

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      console.error('DEBUG: Login auth error:', JSON.stringify(error, null, 2))
      return { error: 'Credenciales inválidas o error de autenticación' }
    }

      // We query BOTH profiles and tenant_users in parallel to save time and make login faster
      const supabaseAdmin = createAdminClient()
      
      const [profileResponse, tenantUserResponse] = await Promise.all([
        supabaseAdmin.from('profiles').select('role').eq('id', authData.user.id).maybeSingle(),
        supabaseAdmin.from('tenant_users').select('role').eq('user_id', authData.user.id).maybeSingle()
      ])

      if (profileResponse.error && profileResponse.error.code !== 'PGRST116') {
        console.error('DEBUG: Profile error:', profileResponse.error)
      }

      let role = profileResponse.data?.role?.toString().trim()

      // Fallback: If profile role is missing but user exists, check tenant_users
      if (!role && tenantUserResponse.data?.role) {
        role = tenantUserResponse.data.role
      }

      if (!role) {
        console.error('DEBUG: No role found for user:', authData.user.id)
        return { error: 'Su cuenta no tiene un perfil configurado o un rol asignado.' }
      }

      // REDIRECTION LOGIC
      if (role === 'superadmin') {
        redirectUrl = '/superadmin'
      } else if (['admin', 'receptionist', 'doctor', 'staff'].includes(role)) {
        redirectUrl = '/admin'
      } else if (role === 'patient') {
        redirectUrl = '/' // Landing or patient portal
      } else {
        console.error('DEBUG: Invalid role value:', role)
        return { error: `Rol no reconocido: ${role}` }
      }
  } catch (err: any) {
    console.error('Unexpected error:', err)
    return { error: err.message || 'Error inesperado al iniciar sesión' }
  }

  // Redirect must be outside try-catch to avoid swallowing NEXT_REDIRECT error
  if (redirectUrl) {
    redirect(redirectUrl)
  }
}
