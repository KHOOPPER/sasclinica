import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { Sidebar } from '@/components/shared/Sidebar'
import { Header } from '@/components/shared/Header'
import { Toaster } from 'sonner'
import { headers } from 'next/headers'
import { getEffectiveRole } from '@/lib/auth-utils'

async function getClinicContext() {
  const context = await getEffectiveRole()
  if (!context) return null

  const { isSuperadmin, tenantId, profile, clinicId: staffClinicId } = context
  let clinic: any = profile?.clinic
  let publicSettings: any = null
  
  if (isSuperadmin) {
    const headersList = await headers()
    const url = new URL(headersList.get('x-url') || headersList.get('referer') || 'http://localhost/admin', 'http://localhost')
    const clinicIdParam = url.searchParams.get('clinicId')
    
    if (clinicIdParam) {
      const adminClient = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      const { data: clinicData } = await adminClient
        .from('clinics')
        .select('*')
        .eq('id', clinicIdParam)
        .single()
      
      if (clinicData) clinic = clinicData
    }
  }

  // Fallback for admin if profile.clinic is null (older users without staff_members row)
  if (!clinic && tenantId) {
    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: clinicData } = await adminClient
      .from('clinics')
      .select('*')
      .eq('tenant_id', tenantId)
      .limit(1)
      .maybeSingle()

    if (clinicData) clinic = clinicData
  }

  // NOW explicitly fetch settings for whatever clinic we resolved
  if (clinic && clinic.id) {
    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: settingsData } = await adminClient
      .from('public_clinic_settings')
      .select('slug, logo_url, clinic_logo')
      .eq('clinic_id', clinic.id)
      .maybeSingle()
      
    if (settingsData) {
      publicSettings = settingsData
      clinic = {
        ...clinic,
        logo_url: settingsData.logo_url || settingsData.clinic_logo || clinic.logo_url || null
      }
    }
  }

  return { ...context, clinic, publicSettings }
}

export async function generateMetadata(): Promise<Metadata> {
  const context = await getClinicContext()
  if (!context) return { title: 'KCLINIC' }

  const { clinic } = context
  const clinicName = clinic?.name || 'KCLINIC'
  const logoUrl = clinic?.logo_url || '/favicon.ico'

  return {
    title: `${clinicName} - Panel de Gestión`,
    icons: {
      icon: logoUrl,
      shortcut: logoUrl,
      apple: logoUrl,
    }
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const context = await getClinicContext()
  if (!context) {
    redirect('/login')
  }

  const { user, role: baseRole, clinic, publicSettings, profile } = context
  const effectiveRole = context.role

  const allLinks = [
    { href: '', label: 'Dashboard' },
    { href: '/trabajadores', label: 'Trabajadores', roles: ['admin'] },
    { href: '/servicios', label: 'Servicios', roles: ['admin', 'receptionist'] },
    { href: '/reservas', label: 'Reservas', roles: ['admin', 'receptionist', 'doctor', 'staff'] },
    { href: '/pacientes', label: 'Pacientes', roles: ['admin', 'receptionist', 'doctor', 'staff'] },
    { href: '/configuracion', label: 'Configuración', roles: ['admin'] },
  ]

  const filteredLinks = allLinks.filter(link => 
    !('roles' in link) || (link as any).roles.includes(effectiveRole)
  )

  const roleMap: Record<string, string> = {
    'admin': 'Panel de Administración',
    'doctor': 'Panel Médico',
    'receptionist': 'Recepción',
    'staff': 'Panel del Personal',
  }
  
  const userName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : (user.email?.split('@')[0] || 'Admin')
  const title = clinic?.name || roleMap[effectiveRole] || 'Panel de Gestión'

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden transition-colors duration-300">
      <Toaster richColors position="top-right" />
      <Sidebar 
        baseHref="/admin" 
        links={filteredLinks} 
        clinicName={clinic?.name} 
        logo={clinic?.logo_url}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          title={title} 
          userName={userName} 
          userRole={roleMap[effectiveRole]} 
          userImage={profile?.image_url}
          clinicSlug={publicSettings?.slug}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg-main transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  )
}

