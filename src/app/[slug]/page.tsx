import { getClinicBySlug } from './actions'
import { PublicLayout } from './PublicLayout'
import { notFound } from 'next/navigation'

export const revalidate = 0 // Bypassea la caché de Next.js para asegurar cambios en tiempo real

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const clinicData = await getClinicBySlug(slug)
  
  if (!clinicData) return {}
  const data = clinicData as any

  const clinic = Array.isArray(data.clinic) ? data.clinic[0] : data.clinic
  const clinicName = clinic?.name || data.clinic_name || data.hero_title || 'Clínica Médica'
  const title = data.meta_title || `${clinicName} | Reserva tu Cita Médica`
  const description = data.meta_description || `Agenda tu cita en ${clinicName}. Atención profesional y personalizada.`

  return {
    title,
    description,
    icons: {
      icon: data.favicon_url || '/favicon.ico',
    },
    openGraph: {
      title,
      description,
      images: [data.logo_url].filter(Boolean),
      type: 'website',
    }
  }
}

export default async function PublicBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const clinicData = await getClinicBySlug(slug)

  if (!clinicData) {
    notFound()
  }
  
  const data = clinicData as any
  const clinic = Array.isArray(data.clinic) ? data.clinic[0] : data.clinic
  const clinicName = clinic?.name || data.clinic_name || data.hero_title || 'Clínica Médica'

  if (!data.is_active) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-6">
        <div className="max-w-md w-full premium-card p-12 text-center space-y-8 animate-instant border-brand-primary/10 shadow-brand-primary/5">
          <div className="h-20 w-20 bg-brand-primary/10 rounded-3xl mx-auto flex items-center justify-center">
            <span className="text-4xl">✨</span>
          </div>
          <div className="space-y-3">
             <h2 className="text-3xl font-black text-text-main uppercase tracking-tighter leading-tight">Medicare Elite</h2>
             <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">En preparación</p>
          </div>
          <div className="space-y-4">
            <p className="text-text-main/60 font-medium leading-relaxed">
                Estamos diseñando una experiencia de salud digital superior para <strong>{clinicName}</strong>.
            </p>
            <div className="flex items-baseline justify-center gap-1 opacity-40">
               <div className="h-1 w-1 rounded-full bg-brand-primary  [animation-delay:-0.3s]" />
               <div className="h-1 w-1 rounded-full bg-brand-primary  [animation-delay:-0.15s]" />
               <div className="h-1 w-1 rounded-full bg-brand-primary " />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <PublicLayout clinicData={clinicData} />
}
