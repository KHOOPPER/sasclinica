import { getClinicBySlug } from './actions'
import { PublicLayout } from './PublicLayout'
import { notFound } from 'next/navigation'

export default async function PublicBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const clinicData = await getClinicBySlug(slug)

  if (!clinicData) {
    notFound()
  }

  // If website is disabled, show blank/coming soon page
  if (!clinicData.is_active) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-300 text-6xl font-black">🚧</p>
          <p className="text-slate-900 font-black text-2xl tracking-tight">Próximamente</p>
          <p className="text-slate-400 text-sm">Este sitio está en construcción.</p>
        </div>
      </div>
    )
  }

  return <PublicLayout clinicData={clinicData} />
}
