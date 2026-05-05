export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { BusinessHoursEditor } from '../BusinessHoursEditor'
import { Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function BusinessHoursPage({ params }: { params: Promise<{ clinicId: string }> }) {
  const { clinicId } = await params
  const supabase = await createClient()

  // 1. Get clinic
  const { data: clinic } = await supabase
    .from('clinics')
    .select('*')
    .eq('id', clinicId)
    .maybeSingle()

  if (!clinic) return notFound()

  // 2. Get business hours
  const { data: hours } = await supabase
    .from('business_hours')
    .select('*')
    .eq('clinic_id', clinic.id)

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-2 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <Link 
            href={`/superadmin/configuracion/${clinicId}`} 
            className="text-xs font-bold text-slate-400 hover:text-[#003366] transition-colors flex items-center gap-1 uppercase tracking-widest mb-2"
          >
            <ArrowLeft className="h-3 w-3" /> Volver a Configuración
          </Link>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <Clock className="h-8 w-8 text-[#003366]" /> Horarios de Atención
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic">Gestionando horarios para: <span className="font-bold text-slate-700">{clinic.name}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8">
          <BusinessHoursEditor 
            clinicId={clinic.id} 
            tenantId={clinic.tenant_id} 
            initialHours={hours || []} 
          />
        </div>
      </div>
    </div>
  )
}
