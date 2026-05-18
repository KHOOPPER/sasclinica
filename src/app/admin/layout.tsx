import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { Sidebar } from '@/components/shared/Sidebar'
import { Header } from '@/components/shared/Header'
import { Toaster } from 'sonner'
import { headers } from 'next/headers'
import { getEffectiveRole } from '@/lib/auth-utils'
import { SessionTimeout } from '@/components/shared/SessionTimeout'
import { SidebarProvider } from '@/components/shared/SidebarContext'

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
        .select('*, tenants(id, plan, plan_expires_at)')
        .eq('id', clinicIdParam)
        .single()

      if (clinicData) clinic = clinicData
    }
  }

  if (!clinic && tenantId) {
    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: clinicData } = await adminClient
      .from('clinics')
      .select('*, tenants(id, plan, plan_expires_at)')
      .eq('tenant_id', tenantId)
      .limit(1)
      .maybeSingle()

    if (clinicData) clinic = clinicData
  }

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
  const logoUrl = clinic?.logo_url || null

  const metadata: Metadata = {
    title: `${clinicName} - Panel de Gestión`,
  }

  if (logoUrl) {
    metadata.icons = {
      icon: logoUrl,
      shortcut: logoUrl,
      apple: logoUrl,
    }
  }

  return metadata
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

  const isExpired = !context.isSuperadmin && clinic?.tenants?.plan_expires_at && new Date(clinic.tenants.plan_expires_at) < new Date()
  const nowSV = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/El_Salvador' }));
  const hoursSV = nowSV.getHours();
  const isAfterHours = hoursSV >= 19;

  if (isExpired || isAfterHours) {
    const whatsappMessage = encodeURIComponent(`Hola soporte, quiero renovar la suscripción de la clínica "${clinic?.name || 'Mi Clínica'}". Administrador: ${userName}.`);
    const whatsappUrl = `https://wa.me/50370009306?text=${whatsappMessage}`;

    return (
      <SidebarProvider>
        <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-[#0A0A0A] p-4 animate-in fade-in duration-700">
          <SessionTimeout />
          <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-white/5 p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl shadow-slate-200/50 dark:shadow-none">
            <div className={`mx-auto w-24 h-24 ${isAfterHours && !isExpired ? 'bg-amber-100 dark:bg-amber-500/10' : 'bg-red-100 dark:bg-red-500/10'} rounded-full flex items-center justify-center mb-6`}>
              <span className="text-5xl">{isAfterHours && !isExpired ? '🌙' : '🔒'}</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {isAfterHours && !isExpired ? 'Turno Finalizado' : 'Acceso Bloqueado'}
            </h1>
            
            {isExpired ? (
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                La suscripción de tu clínica ha vencido el <span className="text-red-500">{new Date(clinic.tenants.plan_expires_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>.
              </p>
            ) : (
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                El sistema se encuentra fuera de horario de servicio (7:00 PM). El acceso se restablecerá el día de mañana.
              </p>
            )}

            <p className="text-xs font-medium text-slate-500">
              {isExpired 
                ? 'Para recuperar el acceso a todas las funciones del panel, por favor ponte en contacto con soporte técnico para procesar tu renovación.'
                : 'Por seguridad y eficiencia energética, las sesiones administrativas se suspenden automáticamente al finalizar la jornada laboral.'}
            </p>

            <div className="space-y-3 pt-4">
              {isExpired && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] w-full">
                  <span>Contactar a Soporte</span>
                </a>
              )}

              <form action={async () => {
                'use server'
                const { signOut } = await import('@/app/auth/actions')
                await signOut()
              }}>
                <button type="submit" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg w-full">
                  <span>Regresar al Login</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-bg-main overflow-hidden transition-colors duration-300">
        <SessionTimeout />
        <Toaster richColors position="top-right" />
        <Sidebar
          baseHref="/admin"
          links={filteredLinks}
          clinicName={clinic?.name}
          logo={clinic?.logo_url}
        />
        <div className="flex flex-1 flex-col overflow-hidden w-full">
          <Header
            title={title}
            userName={userName}
            userRole={roleMap[effectiveRole]}
            userImage={profile?.image_url}
            clinicSlug={publicSettings?.slug}
            planExpiresAt={clinic?.plan_expires_at}
            clinicId={clinic?.id}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-bg-main transition-colors duration-300 w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
