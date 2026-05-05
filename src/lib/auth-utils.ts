import { createClient } from './supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export type UserRole = 'superadmin' | 'admin' | 'doctor' | 'receptionist' | 'staff' | 'patient'

/**
 * Robust server-side role verification.
 * Optimized with Atomic Queries.
 */
export async function getEffectiveRole(): Promise<{
  user: any
  role: UserRole
  tenantId: string | null
  clinicId: string | null
  isSuperadmin: boolean
  profile: any
} | null> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) return null

    const supabaseAdmin = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !profile) {
      // If user exists but no profile, return minimal context to avoid loop
      return {
        user,
        role: 'patient',
        tenantId: null,
        clinicId: null,
        isSuperadmin: false,
        profile: null
      }
    }

    // Try to get staff data separately to avoid hard failures on relation errors
    let staff = null;
    try {
      const { data: staffData } = await supabaseAdmin
        .from('staff_members')
        .select('specialty, clinic_id, clinics(id, name, logo_url, public_clinic_settings(slug, logo_url, clinic_logo))')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle()
        
      if (staffData) staff = staffData;
    } catch {
      // Ignore relationship errors for staff
    }

    // Determine effective role
    let role: UserRole = (profile.role?.toString()?.trim() || 'patient') as UserRole
    let clinicId: string | null = null

    if (staff) {
      role = (staff.specialty || role) as UserRole
      clinicId = staff.clinic_id
    }

    return {
      user,
      role,
      tenantId: profile.tenant_id,
      clinicId,
      isSuperadmin: !!profile.is_superadmin || role === 'superadmin',
      profile: {
        ...profile,
        clinic: staff?.clinics || null
      }
    }
  } catch (err) {
    console.error('Auth check fatal error:', err)
    return null
  }
}

/**
 * Helper to enforce roles at the page level.
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const context = await getEffectiveRole()
  
  if (!context) {
    redirect('/login')
  }

  const { role } = context
  
  // Superadmin is God — they are always allowed everywhere in /admin
  if (role === 'superadmin' || context.isSuperadmin) return context
  
  if (!allowedRoles.includes(role)) {
    // If not allowed, send to the generic home to prevent loops
    console.warn(`RBAC: Role ${role} blocked. Allowed: ${allowedRoles.join(', ')}`)
    redirect('/')
  }

  return context
}
