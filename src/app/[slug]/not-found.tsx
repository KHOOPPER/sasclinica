import Link from 'next/link'
import { Stethoscope, ArrowLeft, MessageCircle } from 'lucide-react'

export default function NotFound() {
  // Reemplazar con el número de WhatsApp real de soporte de KCLINIC
  const supportWhatsApp = "50370009306" 
  const whatsappMessage = encodeURIComponent("Hola, necesito soporte con mi clínica. El enlace que busco no funciona.")

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-xl w-full bg-[#1E293B] border border-white/5 rounded-[2.5rem] p-12 text-center space-y-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-8">
          <div className="mx-auto w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center shadow-lg">
            <Stethoscope className="w-10 h-10 text-emerald-400" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
              KCLINIC
            </h1>
            <p className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.3em]">
              Gestión Médica Profesional
            </p>
          </div>

          <div className="w-16 h-1 bg-white/10 mx-auto rounded-full" />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white tracking-tight">Página no encontrada</h2>
            <p className="text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
              Lo sentimos, el enlace de la clínica que intentas visitar no existe o ha sido desactivado temporalmente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a 
              href={`https://wa.me/${supportWhatsApp}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Contactar Soporte
            </a>
            
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
