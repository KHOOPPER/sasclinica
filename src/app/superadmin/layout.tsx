'use client'

import { Sidebar } from '@/components/shared/Sidebar'
import { Header } from '@/components/shared/Header'
import { usePathname } from 'next/navigation'
import { Toaster } from 'sonner'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { SidebarProvider } from '@/components/shared/SidebarContext'

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [branding, setBranding] = useState({ name: 'Medicare', logo: '' })
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    const loadBranding = () => {
      const saved = localStorage.getItem('superadmin_branding')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setBranding(parsed)
          
          // Inyectar el logo como favicon en la pestaña
          if (parsed.logo) {
            const existingLinks = document.querySelectorAll("link[rel~='icon']");
            existingLinks.forEach(link => link.remove());
            
            const link = document.createElement('link')
            link.rel = 'icon'
            link.href = parsed.logo
            document.head.appendChild(link)
          }
        } catch (e) {
          console.error("Error parsing branding", e)
        }
      }
      setIsLoaded(true)
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
    <SidebarProvider>
      <div className="flex h-screen bg-bg-main transition-colors duration-75 overflow-hidden">
        <Toaster richColors position="top-right" />
        {!isBuilder && (
          <Sidebar 
            baseHref="/superadmin" 
            links={links} 
            clinicName={branding.name || 'Medicare Elite'} 
            logo={branding.logo} 
          />
        )}
        <div className="flex flex-1 flex-col overflow-hidden w-full relative">
          {!isBuilder && (
            <Header 
              title={branding.name || 'Superadmin'} 
              userName="Super Admin"
              userRole="Global"
            />
          )}
          <main className={cn(
            "flex-1 overflow-y-auto bg-bg-main transition-all duration-75 w-full overflow-x-hidden relative",
            isBuilder ? 'p-0' : 'p-4 md:p-8 lg:p-12'
          )}>
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
