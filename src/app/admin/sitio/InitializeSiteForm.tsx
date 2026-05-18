'use client'

import { useState } from 'react'
import { Rocket, Sparkles, Globe, ArrowRight, CheckCircle2 } from 'lucide-react'
import { initializeSiteSettings } from './actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function InitializeSiteForm() {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleAction = async () => {
        setIsPending(true)
        try {
            const result = await initializeSiteSettings()
            if (result.success) {
                toast.success('¡Sitio activado!')
                router.refresh()
                window.location.reload()
            } else {
                toast.error(result.error || 'Ocurrió un error')
            }
        } catch (err) {
            console.error('Action error:', err)
            toast.error('Error al procesar la solicitud')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            <div className="text-center space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                <div className="relative inline-block">
                    <div className="h-48 w-48 bg-slate-50 rounded-[4rem] border border-slate-100 flex items-center justify-center text-slate-300 shadow-xl shadow-slate-200/50">
                        <Rocket size={100} strokeWidth={1} />
                    </div>
                    <div className="absolute -top-4 -right-4 h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 animate-pulse border border-amber-100">
                        <Sparkles size={40} strokeWidth={1.5} />
                    </div>
                </div>

                <div className="space-y-8 max-w-4xl mx-auto">
                    <h1 className="text-7xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-[0.85]">
                        Tu Clínica aún no tiene un <span className="text-[#003366]">SITIO WEB</span>
                    </h1>
                    <p className="text-slate-500 text-2xl font-bold leading-relaxed max-w-2xl mx-auto">
                        Activa ahora tu presencia online profesional. Podrás configurar horarios, servicios y aceptar reservas en minutos.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-10">
                    <button 
                        onClick={handleAction}
                        disabled={isPending}
                        className="px-24 h-24 bg-[#003366] hover:bg-slate-900 disabled:opacity-50 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-8 shadow-2xl shadow-blue-900/30 transition-all duration-500 hover:scale-[1.05] active:scale-95 group"
                    >
                        {isPending ? (
                            <div className="h-8 w-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Activar mi Sitio Web Ahora
                                <ArrowRight className="h-8 w-8 group-hover:translate-x-3 transition-transform" />
                            </>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-16 text-left">
                    {[
                        { icon: <Globe size={28} />, title: 'Enlace Único', desc: 'Tu propia dirección web personalizada.' },
                        { icon: <Sparkles size={28} />, title: 'Diseño Premium', desc: 'Layouts modernos creados para salud.' },
                        { icon: <CheckCircle2 size={28} />, title: 'Control Total', desc: 'Gestiona servicios, fotos y staff.' }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40">
                            <div className="h-16 w-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 mb-8">
                                {item.icon}
                            </div>
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-3">{item.title}</h4>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.1em] leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
