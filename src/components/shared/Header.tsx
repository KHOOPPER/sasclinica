'use client'

import { useState, useEffect } from 'react'
import { Bell, Settings, User, ExternalLink, Globe, Search, LogOut, Moon, Sun, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { NotificationDropdown } from './NotificationDropdown'
import { useSidebar } from './SidebarContext'

interface HeaderProps {
  title: string
  logo?: string | null
  userName?: string
  userRole?: string
  userImage?: string | null
  clinicSlug?: string | null
  planExpiresAt?: string | null
  clinicId?: string
}

const formatName = (firstName: string, lastName: string) => {
  if (!firstName && !lastName) return ''
  const first = firstName || ''
  const lastInitial = lastName ? `${lastName.charAt(0)}.` : ''
  return `${first} ${lastInitial}`.trim()
}

const mapRole = (role: string) => {
  switch (role?.toLowerCase()) {
    case 'superadmin': return 'SUPERADMIN'
    case 'admin': return 'ADMINISTRADOR'
    case 'doctor': return 'DOCTOR'
    case 'receptionist': return 'RECEPCIONISTA'
    case 'staff': return 'ESPECIALISTA'
    default: return 'PERSONAL'
  }
}

export function Header({ title, logo, userName = 'Admin User', userRole = 'Administrador', userImage, clinicSlug, planExpiresAt, clinicId }: HeaderProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [theme, setTheme] = useState<'dia' | 'noche'>('dia')
  const pathname = usePathname()
  const { toggle } = useSidebar()
  
  const [userData, setUserData] = useState({
    name: userName,
    role: userRole,
    image: userImage
  })

  // Load theme and global user data on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as 'dia' | 'noche'
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === 'noche') document.documentElement.classList.add('theme-noche')
    }

    async function loadUserGlobalData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url, role')
          .eq('id', user.id)
          .single()

        if (profile) {
          const formattedName = formatName(profile.first_name, profile.last_name) || userName
          const roleRaw = profile.role || user.app_metadata?.role || 'staff'
          
          setUserData({
            name: formattedName,
            role: mapRole(roleRaw),
            image: profile.avatar_url || userImage
          })
        }
      }
    }

    loadUserGlobalData()
  }, [userName, userImage])

  const toggleTheme = () => {
    const newTheme = theme === 'dia' ? 'noche' : 'dia'
    setTheme(newTheme)
    localStorage.setItem('app-theme', newTheme)
    if (newTheme === 'noche') {
      document.documentElement.classList.add('theme-noche')
    } else {
      document.documentElement.classList.remove('theme-noche')
    }
  }
  
  const isSuperadmin = pathname.startsWith('/superadmin')
  const profileHref = isSuperadmin ? '/superadmin/perfil' : '/admin/perfil'

  return (
    <header className="flex h-24 items-center justify-between border-b border-slate-200/40 bg-bg-main px-4 md:px-10 shrink-0 sticky top-0 z-40 transition-all duration-75 dark:border-white/5">
      <div className="flex items-center gap-4 md:gap-8 flex-1">
        {/* Botón menú móvil */}
        <button 
          onClick={toggle}
          className="p-3 -ml-3 text-slate-500 hover:text-brand-primary md:hidden active:scale-95 transition-transform"
        >
          <Menu className="h-6 w-6" />
        </button>

        <h1 className="text-lg md:text-2xl font-black text-text-main tracking-tighter uppercase leading-none truncate">
          {isSuperadmin && !title.includes('Panel') ? `SUPERADMIN • ${title}` : title}
        </h1>
      </div>
      
      <div className="flex items-center gap-1 md:gap-6">
        {/* Action Icons */}
        <div className="flex items-center gap-0 md:gap-3 pr-1 md:pr-6 border-r border-slate-200/40 dark:border-white/5">
          <NotificationDropdown isSuperadmin={isSuperadmin} planExpiresAt={planExpiresAt} clinicId={clinicId} />
          
          <div className="relative">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-3 rounded-2xl transition-all duration-300 ${isSettingsOpen ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-brand-primary hover:bg-slate-50 dark:hover:bg-white/5'}`}
            >
              <Settings className={`h-5 w-5 ${isSettingsOpen ? 'rotate-90' : ''} transition-transform duration-500`} />
            </button>

            {isSettingsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsSettingsOpen(false)}
                />
                <div className="absolute right-0 mt-4 w-72 bg-card-bg rounded-[2rem] shadow-2xl border border-card-border p-3 z-50 animate-in fade-in zoom-in duration-75 backdrop-blur-xl">
                  {/* Theme Switcher Toggle */}
                  <div className="px-5 py-3 border-b border-card-border mb-2">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Apariencia</p>
                        <button 
                            onClick={toggleTheme}
                            className="flex items-center gap-2 p-1.5 px-3 rounded-full bg-emerald-500/5 hover:bg-emerald-500/10 transition-all"
                        >
                            {theme === 'dia' ? <Moon className="h-3 w-3 text-slate-400" /> : <Sun className="h-3 w-3 text-brand-primary" />}
                            <span className="text-[9px] font-black uppercase text-slate-500">
                                {theme === 'dia' ? 'Modo Noche' : 'Modo Día'}
                            </span>
                        </button>
                    </div>
                  </div>

                  {/* Settings dropdown header */}
                  <div className="px-5 py-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Gestión</p>
                  </div>
                  


                  {clinicSlug && (
                    <Link 
                      href={`/${clinicSlug}`} 
                      target="_blank"
                      className="flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest text-text-main hover:bg-brand-secondary hover:text-brand-primary rounded-[1.8rem] transition-all"
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Sitio Web
                    </Link>
                  )}
                  
                  <Link 
                    href={profileHref}
                    className="flex items-center gap-4 px-5 py-4 text-xs font-black uppercase tracking-widest text-text-main hover:bg-brand-secondary hover:text-brand-primary rounded-[1.8rem] transition-all"
                    onClick={() => setIsSettingsOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Mi Perfil
                  </Link>

                  <div className="mt-2 pt-2 border-t border-card-border">
                     <button className="flex items-center gap-4 w-full px-5 py-4 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-[1.8rem] transition-all">
                        <LogOut className="h-4 w-4" />
                        Cerrar Sesión
                     </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-0 cursor-pointer ml-2 md:ml-4">
          <div className="hidden md:flex flex-col items-end justify-center mr-3">
            <span className="text-sm font-bold text-text-main leading-none uppercase tracking-tight">
              {userData.name || 'Admin User'}
            </span>
            <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-1">
              {userData.role}
            </span>
          </div>
          <div className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 ring-1 ring-slate-200/50 dark:ring-white/10 shadow-sm overflow-hidden transition-transform active:scale-95">
            {userData.image ? (
              <img src={userData.image} alt={userData.name} className="h-full w-full object-cover rounded-full" />
            ) : (
              <User className="h-4.5 w-4.5 md:h-5 md:w-5" />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
