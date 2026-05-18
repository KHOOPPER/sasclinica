'use client'

import { useSidebar } from './SidebarContext'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/app/auth/actions'
import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  Stethoscope,
  ClipboardList,
  LogOut,
  Globe,
  CreditCard,
  ShieldCheck,
  X
} from 'lucide-react'

interface SidebarProps {
  baseHref: string
  links: { href: string; label: string }[]
  logo?: string | null
  clinicName?: string | null
  isHidden?: boolean
}

const ICON_MAP: Record<string, any> = {
  'Dashboard': LayoutDashboard,
  'Trabajadores': Users,
  'Servicios': Stethoscope,
  'Reservas': Calendar,
  'Pacientes': ClipboardList,
  'Configuración': Settings,
  'Gestión de Clínicas': Building2,
  'Sitio Web': Globe,
  'Clínicas (Tenants)': Building2,
  'Facturación & Planes': CreditCard,
  'Dominios SSL': ShieldCheck,
}

export function Sidebar({ baseHref, links, logo, clinicName, isHidden }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isOpen, setIsOpen } = useSidebar()

  if (isHidden) return null

  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-slate-200/40 bg-bg-main transition-all duration-300 ease-in-out dark:border-white/5
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex h-32 items-center px-10 overflow-hidden shrink-0 relative">
          <div className="flex items-center gap-4 w-full">
            {logo ? (
              <div className="flex-1 flex items-center justify-start py-4">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="max-h-16 w-auto object-contain transition-transform duration-500 hover:scale-105" 
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 group">
                <div className="h-12 w-12 bg-brand-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500">
                   <Stethoscope className="h-7 w-7 text-bg-main" />
                </div>
                <span className="font-black text-text-main truncate text-2xl tracking-tighter uppercase leading-none">
                  {clinicName || 'Medicare'}
                </span>
              </div>
            )}
          </div>

          {/* Botón de cerrar para móviles */}
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-3 text-slate-400 hover:text-brand-primary active:scale-90 transition-transform"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-2 px-6 py-6 overflow-y-auto custom-scrollbar">
          {links.map((link) => {
            const Icon = ICON_MAP[link.label] || LayoutDashboard
            const href = `${baseHref}${link.href}`
            const isExact = pathname === href
            const isDashboard = link.href === '' && pathname === baseHref
            const isActive = isExact || isDashboard

            return (
              <Link
                key={link.href}
                href={href}
                prefetch={true}
                onMouseEnter={() => router.prefetch(href)}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all duration-75 group relative ${
                  isActive 
                    ? 'bg-brand-primary text-bg-main shadow-xl shadow-brand-primary/25' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-brand-primary hover:bg-emerald-500/5 dark:hover:bg-white/5'
                }`}
              >
                <div className={`transition-all duration-75 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    isActive ? 'text-bg-main' : 'text-slate-300 dark:text-slate-600 group-hover:text-brand-primary'
                  }`} />
                </div>
                <span className="leading-none">{link.label}</span>
                {isActive && (
                   <div className="ml-auto w-1 h-1 rounded-full bg-bg-main opacity-50" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-white/5">
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-4 w-full rounded-2xl px-5 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-75 group"
            >
              <LogOut className="h-5 w-5 text-slate-300 group-hover:text-red-500" />
              <span className="leading-none">Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
