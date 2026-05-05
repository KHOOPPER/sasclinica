'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Globe, ExternalLink, Eye, Settings, CreditCard } from 'lucide-react'
import { PlanManagementModal } from '../PlanManagementModal'

interface SitiosClientProps {
  clinics: any[]
}

export default function SitiosClient({ clinics }: SitiosClientProps) {
  const [selectedClinic, setSelectedClinic] = useState<any>(null)
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {clinics.map(clinic => {
          const publicSettings = clinic.public_clinic_settings?.[0]
          const generatedSlug = clinic.name.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
          
          const slug = publicSettings?.slug || generatedSlug
          const publicUrl = `/${slug}`
          
          return (
            <div key={clinic.id} className="group overflow-hidden rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 bg-card-bg hover:border-emerald-500/30 shadow-card hover:shadow-emerald-500/10 transition-all duration-500 flex flex-col justify-between">
              <div className="bg-slate-50/50 dark:bg-white/[0.02] p-8 border-b border-slate-100/50 dark:border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-150 transition-transform duration-1000">
                   <Globe className="h-32 w-32 text-emerald-500" />
                </div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="h-14 w-14 bg-card-bg dark:bg-white/10 rounded-2xl flex items-center justify-center text-emerald-500 font-black text-xl border border-slate-200/50 dark:border-white/5 shadow-xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 uppercase">
                    {clinic.name[0]}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {publicSettings?.is_active && (
                      <div className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest border border-emerald-500/20">En Línea</div>
                    )}
                    <div className="bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest border border-blue-500/20">
                      Plan {clinic.tenants?.plan || 'Básico'}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-black text-text-main uppercase tracking-tighter leading-tight relative z-10">
                    {clinic.name}
                </div>
                <div className="font-black text-emerald-500/60 text-[9px] uppercase tracking-[0.2em] mt-2 relative z-10">
                    {clinic.tenants?.name}
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                 <div className="flex items-center gap-4 bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100/50 dark:border-white/5 rounded-2xl px-5 py-3 transition-all">
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-tight font-mono">/{slug}</span>
                 </div>
              </div>

              <div className="px-8 pb-8 flex flex-col gap-3">
                <Link href={`/superadmin/sitios/${clinic.id}`} className="w-full">
                  <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl h-12 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 group/btn transition-all">
                    <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    Personalizar
                  </Button>
                </Link>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedClinic({
                        id: clinic.tenants.id,
                        name: clinic.name,
                        plan: clinic.tenants.plan,
                        plan_expires_at: clinic.tenants.plan_expires_at
                      })
                      setIsPlanModalOpen(true)
                    }}
                    className="w-full h-11 rounded-xl border-slate-200/50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-[9px] font-black uppercase tracking-widest gap-2 transition-all text-blue-500"
                  >
                    <CreditCard className="h-3 w-3" /> Plan
                  </Button>
                  <Link href={`/admin?clinicId=${clinic.id}`} target="_blank" className="w-full">
                    <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200/50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 text-[9px] font-black uppercase tracking-widest gap-2 transition-all text-slate-500">
                      <Settings className="h-3 w-3" /> Panel
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedClinic && (
        <PlanManagementModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          tenant={selectedClinic}
        />
      )}
    </>
  )
}
