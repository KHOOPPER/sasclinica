'use client'

import { Sidebar } from '@/components/shared/Sidebar'
import { Header } from '@/components/shared/Header'
import { usePathname } from 'next/navigation'
import { Toaster } from 'sonner'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [branding, setBranding] = useState({ name: 'Medicare', logo: '' })
  
  useEffect(() => {
    const loadBranding = () => {
      const saved = localStorage.getItem('superadmin_branding')
      if (saved) setBranding(JSON.parse(saved))
    }
    
    loadBranding()
    window.addEventListener('storage', loadBranding)
    return () => window.removeEventListener('storage', loadBranding)
  }, [])

  const links = [
    { href: '', label: 'Dashboard' },
    { href: '/clinicas', label: 'Gestión de Clínicas' },
    { href: '/facturacion', label: 'Facturación & Planes' },
    { href: '/dominios', label: 'Dominios SSL' },
    { href: '/sitios', label: 'Sitio Web' },
  ]
  
  // Check if we are in the visual editor (e.g., /superadmin/sitios/uuid)
  const isBuilder = pathname.match(/\/superadmin\/sitios\/([0-9a-f-]+)$/)

  return (
    <div className="flex h-screen bg-bg-main transition-colors duration-75">
      <Toaster richColors position="top-right" />
      {!isBuilder && (
        <Sidebar 
          baseHref="/superadmin" 
          links={links} 
          clinicName={branding.name} 
          logo={branding.logo} 
        />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        {!isBuilder && <Header title={branding.name} />}
        <main className={cn(
          "flex-1 overflow-y-auto bg-bg-main transition-all duration-75",
          isBuilder ? 'p-0' : 'p-6 md:p-10'
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}
