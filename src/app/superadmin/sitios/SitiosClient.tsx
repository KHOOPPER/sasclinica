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
          
          const logoUrl = publicSettings?.logo_url
          const heroImageUrl = publicSettings?.hero_image_url || 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2070&auto=format&fit=crop'
          const expirationDate = clinic.tenants?.plan_expires_at 
            ? new Date(clinic.tenants.plan_expires_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
            : 'Sin fecha'
          
          return (
            <div key={clinic.id} className="group overflow-hidden rounded-[2.5rem] border border-slate-200/50 dark:border-white/5 bg-card-bg hover:border-emerald-500/30 shadow-card hover:shadow-emerald-500/10 transition-all duration-500 flex flex-col justify-between">
              {/* Preview Header with Website Backdrop */}
              <div className="h-48 relative overflow-hidden group/header">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover/header:scale-110 blur-[2px] opacity-40 dark:opacity-20"
                  style={{ backgroundImage: `url(${heroImageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card-bg via-card-bg/80 to-transparent" />
                
                <div className="absolute inset-x-8 bottom-0 flex justify-between items-end pb-4">
                  <div className="flex flex-col gap-1.5 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${publicSettings?.is_active ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-main opacity-80">
                        {publicSettings?.is_active ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    <div className="text-xl font-black text-text-main uppercase tracking-tighter leading-tight">
                        {clinic.name}
                    </div>
                  </div>
                  
                  <div className="h-16 w-16 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center p-2 shadow-2xl border border-slate-100 dark:border-white/10 relative z-20 group-hover:scale-105 transition-transform duration-500">
                    {logoUrl ? (
                      <img src={logoUrl} alt={clinic.name} className="h-full w-full object-contain" />
                    ) : (
                      <div className="h-full w-full rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xl uppercase">
                        {clinic.name[0]}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-8 space-y-6 flex-1">
                 <div className="flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-white/[0.02] border border-slate-100/50 dark:border-white/5 rounded-2xl px-5 py-4 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <CreditCard className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Plan Actual</p>
                        <p className="text-[10px] font-black text-text-main uppercase">{clinic.tenants?.plan || 'Básico'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Vencimiento</p>
                      <p className="text-[10px] font-black text-emerald-500 uppercase">{expirationDate}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 px-1">
                    <Globe className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-tight font-mono">kclinic.site/{slug}</span>
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
