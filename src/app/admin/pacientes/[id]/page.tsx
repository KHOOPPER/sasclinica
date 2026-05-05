export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/auth-utils'
import { notFound } from 'next/navigation'
import { NewRecordModal } from '../NewRecordModal'
import { PrintPrescriptionButton } from './PrintPrescriptionButton'
import { Calendar, User, Phone, Mail, MapPin, Activity, ClipboardList, Stethoscope, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(['admin', 'receptionist', 'doctor', 'staff'])
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch patient
  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single()

  if (!patient) notFound()

  // 2. Fetch clinical history using Admin Client to bypass RLS issues
  const { createClient: createSupabaseAdmin } = await import('@supabase/supabase-js')
  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: records } = await supabaseAdmin
    .from('clinical_records')
    .select('*, doctor:profiles(first_name, last_name)')
    .eq('patient_id', id)
    .order('fecha_consulta', { ascending: false })
    .order('created_at', { ascending: false })

  // 3. Fetch clinic info from public_clinic_settings for accurate branding
  const { data: clinicSettings } = await supabase
    .from('public_clinic_settings')
    .select('name:clinic_name, address:clinic_address, phone:clinic_phone, logo_url:clinic_logo')
    .eq('tenant_id', patient.tenant_id)
    .maybeSingle()

  // Si no hay settings, intentamos en la tabla clinics como fallback
  let clinicInfo = clinicSettings
  if (!clinicInfo || !clinicInfo.name) {
    const { data: clinicFallback } = await supabase
      .from('clinics')
      .select('name, address, phone, logo_url')
      .eq('tenant_id', patient.tenant_id)
      .maybeSingle()
    clinicInfo = clinicFallback
  }

  // 4. Fetch fallback doctor (first registered doctor)
  const { data: fallbackDoctor } = await supabase
    .from('staff_members')
    .select('full_name')
    .eq('tenant_id', patient.tenant_id)
    .eq('role', 'doctor')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  const clinicData = {
    name: clinicInfo?.name || 'Clínica',
    address: (clinicInfo as any)?.address || undefined,
    phone: (clinicInfo as any)?.phone || undefined,
    logo_url: (clinicInfo as any)?.logo_url || undefined,
  }

  const fallbackDoctorName = fallbackDoctor ? `Dr. ${fallbackDoctor.full_name}` : 'Médico Responsable'

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 pb-20">
      <Link href="/admin/pacientes" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-emerald-500 uppercase tracking-widest transition-all mb-4 group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Regresar al Directorio
      </Link>

      {/* Header / Info Card */}
      <div className="bg-card-bg rounded-[3rem] border border-slate-200/50 dark:border-white/5 shadow-card overflow-hidden shrink-0">
        <div className="bg-emerald-500 px-8 py-10 text-white dark:text-black flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="bg-white/20 dark:bg-black/10 p-5 rounded-3xl">
              <User className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">{patient.first_name} {patient.last_name}</h1>
              <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest opacity-80">
                <span className="bg-black/10 px-3 py-1 rounded-full font-mono">DUI: {patient.dui}</span>
                <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {patient.fecha_nacimiento || 'Fecha no registrada'}</span>
              </div>
            </div>
          </div>
          <NewRecordModal patientId={id} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100/50 dark:divide-white/5 border-t border-slate-100/50 dark:border-white/5">
          <div className="p-8 space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" /> Información Médica
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Tipo Sangre:</span>
                <span className="text-lg font-black text-emerald-500 tracking-tighter">{patient.tipo_sangre || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Alergias:</span>
                {patient.alergias ? (
                  <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <span className="text-red-500 text-lg">⚠</span>
                    <span className="text-xs font-black text-red-500 uppercase tracking-tight leading-tight">{patient.alergias}</span>
                  </div>
                ) : (
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest italic opacity-50">Ninguna reportada</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-500" /> Contacto
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-black text-text-main uppercase tracking-tight"><Phone className="h-4 w-4 text-slate-400" /> {patient.phone || '—'}</div>
              <div className="flex items-center gap-3 text-sm font-black text-emerald-500 lowercase tracking-tight"><Mail className="h-4 w-4 text-slate-400" /> {patient.email || '—'}</div>
              <div className="flex items-start gap-3 text-sm font-black text-slate-400 uppercase tracking-tight mt-2"><MapPin className="h-4 w-4 text-slate-400 mt-0.5" /> {patient.direccion_completa || '—'}</div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-emerald-500" /> Antecedentes
            </h3>
            <p className="text-sm font-black text-slate-500 uppercase tracking-tight italic leading-relaxed">
              {patient.antecedentes_familiares || 'Sin antecedentes registrados.'}
            </p>
          </div>
        </div>
      </div>

      {/* Clinical History Timeline */}
      <div className="space-y-8 pt-6">
        <h2 className="text-2xl font-black text-text-main flex items-center gap-4 uppercase tracking-tighter leading-none">
           <ClipboardList className="h-7 w-7 text-emerald-500" /> Historial de Consultas
        </h2>

        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-emerald-500/30 before:to-transparent">
          {!records || records.length === 0 ? (
            <div className="bg-card-bg rounded-[2.5rem] border border-dashed border-slate-200/50 dark:border-white/10 p-20 text-center text-slate-400 shadow-card">
              <Stethoscope className="h-12 w-12 mx-auto mb-6 text-slate-200/20" />
              <p className="font-black text-lg text-text-main uppercase tracking-tight">No hay consultas registradas en este expediente.</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Haga clic en el botón superior para registrar la primera visita.</p>
            </div>
          ) : (
            records.map((record: any) => (
              <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Dot */}
                <div className="flex items-center justify-center w-10 h-10 rounded-[1rem] border border-white dark:border-slate-800 bg-emerald-500 text-white dark:text-black shadow-lg shadow-emerald-500/30 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shrink-0 z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                   <Activity className="h-5 w-5" />
                </div>
                
                {/* Content Card */}
                <div className="w-[calc(100%-4rem)] md:w-[45%] bg-card-bg p-8 rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-emerald-500/30 group-hover:shadow-emerald-500/5">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                    <time className="font-black text-emerald-500 text-sm uppercase tracking-tighter">
                      {record.fecha_consulta 
                        ? new Date(record.fecha_consulta).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                        : new Date(record.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </time>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] uppercase font-black px-3 py-1 bg-slate-50/50 dark:bg-white/5 rounded-full text-slate-400 border border-slate-200/50 dark:border-white/10 tracking-widest">
                        Dr. {record.doctor?.first_name} {record.doctor?.last_name}
                      </span>
                      {/* Print Prescription Button */}
                      <PrintPrescriptionButton 
                        record={{
                          ...record,
                          fallback_doctor_name: fallbackDoctorName
                        }} 
                        patient={patient} 
                        clinic={clinicData}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-black text-text-main uppercase tracking-tight mb-2">Motivo: {record.motivo_consulta}</h4>
                      <p className="text-slate-500 text-xs font-black uppercase tracking-tight italic leading-relaxed">{record.sintomas}</p>
                    </div>

                    <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                      <h5 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Stethoscope className="h-3 w-3" /> Diagnóstico
                      </h5>
                      <p className="text-text-main font-black text-sm uppercase tracking-tight">{record.diagnostico}</p>
                    </div>

                    <div className="p-4 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl border border-slate-200/50 dark:border-white/10">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tratamiento / Receta</h5>
                      <p className="text-emerald-500 font-mono text-xs whitespace-pre-wrap leading-relaxed">{record.tratamiento_recetado}</p>
                    </div>

                    {record.notas_internas && (
                      <div className="pt-6 border-t border-slate-100/50 dark:border-white/5">
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">Notas Internas</span>
                         <p className="text-slate-500 text-[11px] font-black uppercase tracking-tight leading-relaxed italic">{record.notas_internas}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
