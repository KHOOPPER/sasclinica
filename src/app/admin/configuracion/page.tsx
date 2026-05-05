export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth-utils'
import { Settings, ArrowLeft, Building2, Layout, Globe } from 'lucide-react'
import Link from 'next/link'
import { ClinicProfileForm } from './ClinicProfileForm'

export default async function AdminConfigPage() {
  const { tenantId, clinicId } = await requireRole(['admin'])
  const supabase = await createClient()

  // 1. Get clinic data
  // We use the same logic as the layout: if clinicId is present, use it. 
  // Otherwise, fallback to the first clinic of the tenant.
  const query = supabase
    .from('clinics')
    .select('*, tenants(id, name, plan, plan_expires_at), public_clinic_settings(logo_url, clinic_logo)')
  
  if (clinicId) {
    query.eq('id', clinicId)
  } else {
    query.eq('tenant_id', tenantId)
  }

  const { data: clinicData } = await query.maybeSingle()
  let clinic = clinicData

  if (clinic) {
    const { createClient: createSupabaseAdmin } = await import('@supabase/supabase-js')
    const adminClient = createSupabaseAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: settings } = await adminClient
      .from('public_clinic_settings')
      .select('logo_url, clinic_logo')
      .eq('clinic_id', clinic.id)
      .maybeSingle()
      
    clinic = {
      ...clinic,
      logo_url: settings?.logo_url || settings?.clinic_logo || null
    }
  }

  if (!clinic) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Building2 className="h-16 w-16 text-slate-200" />
        <h2 className="text-xl font-bold text-slate-900">No se encontró la configuración de la clínica</h2>
        <Link href="/admin">
          <button className="text-blue-600 font-bold hover:underline">Volver al inicio</button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400">
              <ArrowLeft className="h-6 w-6" />
            </button>
          </Link>
          <div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Personalización</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Configura el nombre y logotipo de tu clínica</p>
          </div>
        </div>
      </div>

      {/* MAIN FORM CARD */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-10">
          <ClinicProfileForm clinic={clinic} />
        </div>
      </div>

    </div>
  )
}

