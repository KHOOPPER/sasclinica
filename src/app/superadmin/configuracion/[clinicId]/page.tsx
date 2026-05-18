export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { ClinicProfileForm } from './ClinicProfileForm'
import { Settings, Clock, ArrowRight, Globe } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { WebsiteSettingsEditor } from './WebsiteSettingsEditor'

export default async function ConfigurationPage({ params }: { params: Promise<{ clinicId: string }> }) {
  const { clinicId } = await params
  const supabase = await createClient()

  // 1. Get clinic
  let { data: clinic } = await supabase
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

  // 3. Get website settings
  const { data: websiteSettings } = await supabase
    .from('public_clinic_settings')
    .select('*')
    .eq('clinic_id', clinic.id)
    .maybeSingle()

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-2 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-600" /> Configuración de la Clínica
          </h2>
          <p className="text-gray-500 mt-2">Gestionando: <span className="font-bold text-gray-700">{clinic.name}</span></p>
        </div>
        <Link 
            href="/superadmin"
            className="text-xs font-bold text-slate-400 hover:text-[#003366] transition-colors uppercase tracking-[0.2em]"
        >
            Volver al Panel
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">Perfil Público</h3>
        </div>
        <div className="p-8">
          <ClinicProfileForm clinic={clinic} />
        </div>
      </div>

      {/* HORARIOS CARD */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
        <div className="p-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl group-hover:bg-[#003366] group-hover:text-white transition-colors">
              <Clock className="h-8 w-8 text-[#003366] group-hover:text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Horarios de Atención</h3>
              <p className="text-slate-500 text-sm font-medium">Configura los días y horas de apertura de esta clínica.</p>
            </div>
          </div>
          <Link 
            href={`/superadmin/configuracion/${clinicId}/horarios`}
            className="bg-slate-50 hover:bg-[#003366] text-[#003366] hover:text-white font-bold py-3 px-6 rounded-2xl transition-all border border-slate-100 flex items-center gap-2"
          >
            Configurar Horarios
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* WEBSITE SETTINGS SECTION */}
      {websiteSettings && (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-[#003366]" />
                <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Contenido del Sitio Web</h3>
            </div>
            <WebsiteSettingsEditor initialSettings={websiteSettings} />
        </div>
      )}
    </div>
  )
}
