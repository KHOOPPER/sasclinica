import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirección inteligente: Si ya está logueado, no mostrar landing básica
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role, is_superadmin').eq('id', user.id).single();
    
    if (profile?.role === 'superadmin' || profile?.is_superadmin) {
        redirect('/superadmin');
    } else if (['admin', 'doctor', 'receptionist', 'staff'].includes(profile?.role || '')) {
        redirect('/admin');
    }
    // Si es un paciente u otro rol no administrativo, se queda en la landing (o podrías redirigir a /portal-paciente en el futuro)
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-white font-sans p-4 transition-colors duration-200">
      <div className="text-center space-y-12 max-w-2xl animate-instant">
        <div className="space-y-6">
          <h1 className="text-5xl font-black tracking-tighter text-slate-950 sm:text-7xl">
            SAS <span className="text-brand-primary">Clínica</span>
          </h1>
          <p className="text-lg leading-relaxed text-slate-500 font-medium max-w-lg mx-auto">
            Sistema de Gestión Integral para Clínicas y Consultorios.
            Optimice su atención y administre su flujo de pacientes con tecnología de élite.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link
            href="/login"
            className="rounded-2xl bg-slate-950 px-10 py-4 text-sm font-black text-white shadow-xl hover:bg-brand-primary hover:scale-105 transition-all active:scale-95"
          >
            Acceder al Sistema
          </Link>
          <Link
            href="/clinica-dr-portillo"
            className="rounded-2xl px-10 py-4 text-sm font-black text-slate-900 ring-2 ring-inset ring-slate-100 bg-white shadow-sm hover:bg-slate-50 hover:border-brand-primary hover:scale-105 transition-all active:scale-95"
          >
            Portal de Reservas
          </Link>
        </div>
      </div>
    </div>
  );
}
