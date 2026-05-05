export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'

import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import DashboardClient from '@/components/superadmin/DashboardClient'

export default async function SuperadminDashboard() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return <div>No autorizado</div>

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [
    { count: clinicsCount },
    { count: tenantsCount },
    { count: sitesCount },
    { count: usersCount },
    { count: patientsCount },
    { count: staffCount },
    { count: appointmentsCount },
    { data: allTenants },
    { data: recentTenants },
    { data: recentAppointments },
    { data: tenantDetails },
    { count: trialsCount },
  ] = await Promise.all([
    supabaseAdmin.from('clinics').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('tenants').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('public_clinic_settings').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('patients').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('staff_members').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('appointments').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('tenants').select('created_at').order('created_at', { ascending: true }),
    supabaseAdmin
      .from('tenants')
      .select('id, name, slug, created_at, clinics(id)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabaseAdmin
      .from('appointments')
      .select('id, patient_name, status, start_time, tenants:tenant_id(name)')
      .order('created_at', { ascending: false })
      .limit(8),
    supabaseAdmin
      .from('tenants')
      .select(`
        id, name, slug, created_at,
        clinics(id, name),
        profiles(id)
      `)
      .order('created_at', { ascending: false })
      .limit(20),
    supabaseAdmin.from('tenants').select('*', { count: 'exact', head: true }).ilike('plan', 'trial'),
  ])

  // Build growth chart — cumulative tenants over last 6 months
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const growthMap: Record<string, number> = {}
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    growthMap[months[d.getMonth()]] = 0
  }
  let cumulative = 0
  if (allTenants) {
    allTenants.forEach(t => {
      const date = new Date(t.created_at)
      const monthName = months[date.getMonth()]
      cumulative++
      if (monthName in growthMap) growthMap[monthName] = cumulative
    })
  }
  const growthData = Object.entries(growthMap).map(([name, clinicas]) => ({ name, clinicas }))

  // Build monthly appointments chart
  const apptMap: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    apptMap[months[d.getMonth()]] = 0
  }

  const stats = {
    totalClinics: clinicsCount || 0,
    totalTenants: tenantsCount || 0,
    totalSites: sitesCount || 0,
    totalUsers: usersCount || 0,
    totalPatients: patientsCount || 0,
    totalStaff: staffCount || 0,
    totalAppointments: appointmentsCount || 0,
    recentClinics: recentTenants || [],
    recentAppointments: recentAppointments || [],
    growthData,
    tenantDetails: tenantDetails || [],
    totalTrials: trialsCount || 0,
    activeSubscriptions: (tenantsCount || 0) - (trialsCount || 0)
  }

  return <DashboardClient stats={stats} />
}
