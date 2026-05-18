'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
// Animaciones removidas

export function LandingHeader({ 
  clinicName, 
  logoUrl, 
  onBookClick, 
  primaryColor = '#2563eb',
  settings,
  isPreview
}: { 
  clinicName: string, 
  logoUrl?: string, 
  onBookClick: () => void, 
  primaryColor?: string,
  settings?: any,
  isPreview?: boolean
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const variant = settings?.header_variant || 'classic'
  const navBg = settings?.navbar_bg || '#ffffff'
  
  const navLinks = [
    { name: settings?.nav_link_1 || 'Inicio', href: '#inicio' },
    { name: settings?.nav_link_2 || 'Servicios', href: '#servicios' },
    { name: settings?.nav_link_3 || 'Aseguradoras', href: '#aseguradoras' },
    { name: settings?.nav_link_4 || 'Contacto', href: '#contacto' }
  ]

  const baseClasses = cn(
    "left-0 right-0 z-50 transition-all ",
    isPreview 
      ? (variant === 'floating' ? "absolute top-4" : "absolute top-0") 
      : "fixed top-0"
  )
  const opacity = settings?.navbar_opacity !== undefined ? settings.navbar_opacity : 90
  const opacityHex = Math.round(opacity * 2.55).toString(16).padStart(2, '0')
  const navTextColor = settings?.navbar_text_color || settings?.text_main || '#0f172a'
  const navBorderColor = settings?.navbar_border_color || 'rgba(255,255,255,0.1)'
  const navBorderWidth = settings?.navbar_border_width !== undefined ? parseFloat(settings.navbar_border_width.toString()) : 1
  const showBorder = settings?.show_navbar_border !== false

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  const logoProps = {
    url: logoUrl,
    name: clinicName,
    width: settings?.logo_width || 150,
    paddingTop: settings?.logo_padding_top || 0,
    offsetX: settings?.logo_offset_x || 0,
    color: navTextColor,
    onClick: scrollToTop
  }

  const MobileMenu = () => (
    <>
      {isMobileMenuOpen && (
        <div 

          className="fixed inset-0 z-[9999] flex flex-col bg-white md:hidden overflow-hidden"
        >
          {/* Header in Menu */}
          <div className="flex items-center justify-between p-6 pt-2 border-b border-slate-50">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">MENÚ</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white active:scale-90 transition-all shadow-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center px-10 gap-10">
            <div className="space-y-6">
              {navLinks.map((item, i) => (
                <div
                  key={item.name}
                >
                  <a 
                    href={item.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-baseline gap-4"
                  >
                    <span className="text-[10px] font-black text-slate-300 group-hover:text-slate-900 transition-colors">0{i+1}</span>
                    <span className="text-5xl font-black uppercase tracking-tighter text-slate-900 group-hover:italic group-hover:translate-x-2 transition-all duration-300">
                      {item.name}
                    </span>
                  </a>
                </div>
              ))}
            </div>

            <div className="pt-10 border-t border-slate-50">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Acciones Rápidas</p>
               <Button 
                onClick={() => { onBookClick(); setIsMobileMenuOpen(false); }}
                className="w-full h-16 text-white rounded-2xl text-base font-black uppercase tracking-widest shadow-2xl transition-transform active:scale-95"
                style={{ backgroundColor: primaryColor, boxShadow: `0 20px 40px ${primaryColor}40` }}
              >
                {settings?.header_cta_text || 'Agendar Cita'}
              </Button>
            </div>
          </div>

          {/* Footer in Menu */}
          <div className="p-10 bg-slate-50 flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Clínica</p>
               <p className="text-[10px] font-bold text-slate-900">{clinicName}</p>
            </div>
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400"><Menu size={14}/></div>
            </div>
          </div>
        </div>
      )}
    </>
  )

  if (variant === 'floating') {
    return (
      <header className={cn(baseClasses, !isPreview && "top-4 md:top-6", "px-4 md:px-8")}>
        <MobileMenu />
        <nav 
          className="max-w-6xl mx-auto backdrop-blur-2xl px-4 md:px-8 rounded-2xl md:rounded-3xl flex items-center justify-between h-16 md:h-20 transition-all"
          style={{ 
            backgroundColor: `${navBg}${opacityHex}`,
            boxShadow: showBorder ? `inset 0 0 0 ${navBorderWidth}px ${navBorderColor}` : 'none',
            transform: 'translateZ(0)'
          }}
        >
          <LogoArea {...logoProps} variant={variant} />
          
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <NavLink key={item.name} item={item} primaryColor={primaryColor} textColor={navTextColor} />
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
             <Button 
                onClick={onBookClick}
                className="text-white px-4 md:px-6 h-10 md:h-11 rounded-xl md:rounded-2xl text-[10px] md:text-sm font-bold transition-all cursor-pointer border-none shadow-lg"
                style={{ backgroundColor: primaryColor, boxShadow: `0 8px 16px ${primaryColor}40` }}
              >
                {settings?.header_cta_text || 'Agendar'}
              </Button>
              <button 
                className="lg:hidden p-3 -mr-2 active:scale-95 transition-transform" 
                style={{ color: navTextColor }}
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={28} />
              </button>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header 
      className={cn(baseClasses, "top-0 backdrop-blur-xl transition-all overflow-visible h-16 md:h-20")}
      style={{ 
        backgroundColor: `${navBg}${opacityHex}`,
        boxShadow: showBorder ? `inset 0 -${navBorderWidth}px 0 0 ${navBorderColor}` : 'none',
        zIndex: 50
      }}
    >
      <MobileMenu />
      <nav className="flex items-center justify-between px-4 md:px-8 max-w-7xl mx-auto h-full overflow-visible">
        <LogoArea {...logoProps} variant={variant} />

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <NavLink key={item.name} item={item} primaryColor={primaryColor} textColor={navTextColor} />
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-6 justify-end flex-shrink-0">
          {settings?.portal_link && (
            <a 
              href={settings.portal_link} 
              className="hidden lg:block font-bold uppercase tracking-widest text-[10px] transition-all hover:opacity-80"
              style={{ color: primaryColor }}
            >
               {settings.portal_text || 'Ingresar'}
            </a>
          )}
          <Button 
            onClick={onBookClick}
            className="text-white px-5 md:px-8 h-10 md:h-12 rounded-full text-[10px] md:text-sm font-bold shadow-xl transition-all cursor-pointer border-none"
            style={{ backgroundColor: primaryColor, boxShadow: `0 10px 20px ${primaryColor}30` }}
          >
            {settings?.header_cta_text || 'Agendar'}
          </Button>
          <button 
            className="md:hidden p-3 -mr-2 active:scale-95 transition-transform" 
            style={{ color: navTextColor }}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>
    </header>
  )
}

function LogoArea({ url, name, width, paddingTop, offsetX, color, variant, onClick }: any) {
  const isMinimal = variant === 'minimal'
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative flex items-center transition-all duration-300 h-16 md:h-20 cursor-pointer overflow-visible",
        isMinimal ? "w-full justify-center" : "w-32 md:w-48 justify-start flex-shrink-0"
      )} 
    >
      <div 
        className={cn(
          "flex items-center transition-all duration-300 pointer-events-none",
          isMinimal ? "relative" : "absolute left-0 top-1/2 -translate-y-1/2"
        )}
        style={{ 
          transform: `translate(${offsetX}px, ${paddingTop}px)`,
          width: `calc(${width}px * 0.7)`,
          maxWidth: '120px',
          zIndex: 10
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 768px) {
            .logo-container-${name.replace(/\s+/g, '')} {
              width: ${width}px !important;
              max-width: none !important;
            }
          }
        `}} />
        <div className={`logo-container-${name.replace(/\s+/g, '')} transition-all`}>
          {url ? (
            <img 
              src={url} 
              alt={name} 
              className="max-h-[120px] md:max-h-[160px] object-contain transition-all duration-300 w-full pointer-events-auto" 
            />
          ) : (
            <span 
              className="text-base md:text-xl font-black tracking-tight uppercase italic whitespace-nowrap pointer-events-auto"
              style={{ color: color }}
            >
              {name}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function NavLink({ item, primaryColor, textColor }: { item: any, primaryColor: string, textColor: string }) {
  const [isHovered, setIsHovered] = React.useState(false)
  return (
    <a 
      href={item.href}
      className="font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-300 relative py-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ color: isHovered ? primaryColor : textColor, opacity: isHovered ? 1 : 0.6 }}
    >
      {item.name}
      {isHovered && (
        <span 
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full   -2" 
          style={{ backgroundColor: primaryColor }}
        />
      )}
    </a>
  )
}
