'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LandingHeader({ 
  clinicName, 
  logoUrl, 
  onBookClick, 
  primaryColor = '#2563eb',
  settings
}: { 
  clinicName: string, 
  logoUrl?: string, 
  onBookClick: () => void, 
  primaryColor?: string,
  settings?: any
}) {
  const variant = settings?.header_variant || 'classic'
  const navBg = settings?.navbar_bg || '#ffffff'
  const textMain = settings?.text_main || '#0f172a'
  
  const navLinks = [
    { name: settings?.nav_link_1 || 'Inicio', href: '#inicio' },
    { name: settings?.nav_link_2 || 'Servicios', href: '#servicios' },
    { name: settings?.nav_link_3 || 'Aseguradoras', href: '#aseguradoras' },
    { name: settings?.nav_link_4 || 'Contacto', href: '#contacto' }
  ]

   const baseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-500"
  
  const opacity = settings?.navbar_opacity !== undefined ? settings.navbar_opacity : 90
  const opacityHex = Math.round(opacity * 2.55).toString(16).padStart(2, '0')
  const navTextColor = settings?.navbar_text_color || settings?.text_main || '#0f172a'
  const navBorderColor = settings?.navbar_border_color || 'rgba(255,255,255,0.1)'
  const navBorderWidth = settings?.navbar_border_width !== undefined ? parseFloat(settings.navbar_border_width.toString()) : 1
  const showBorder = settings?.show_navbar_border !== false

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  if (variant === 'floating') {
    return (
      <header className={cn(baseClasses, "top-6 px-8")}>
        <nav 
          className="max-w-6xl mx-auto backdrop-blur-2xl px-8 rounded-3xl flex items-center justify-between h-20 transition-all"
          style={{ 
            backgroundColor: `${navBg}${opacityHex}`,
            boxShadow: showBorder ? `inset 0 0 0 ${navBorderWidth}px ${navBorderColor}` : 'none',
            transform: 'translateZ(0)'
          }}
        >
          {/* Brand */}
          <LogoArea {...logoProps} variant={variant} />
          
          {/* Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <NavLink key={item.name} item={item} primaryColor={primaryColor} textColor={navTextColor} />
            ))}
          </div>

          {/* Action */}
          <div className="flex items-center gap-4 flex-shrink-0">
             <Button 
                onClick={onBookClick}
                className="text-white px-6 h-11 rounded-2xl font-bold transition-all cursor-pointer border-none shadow-lg"
                style={{ backgroundColor: primaryColor, boxShadow: `0 8px 16px ${primaryColor}40` }}
              >
                {settings?.header_cta_text || 'Agendar Consulta'}
              </Button>
          </div>
        </nav>
      </header>
    )
  }

  if (variant === 'minimal') {
    return (
      <header 
        className={cn(baseClasses, "top-0 backdrop-blur-xl transition-all")}
        style={{ 
            backgroundColor: `${navBg}${opacityHex}`,
            boxShadow: showBorder ? `inset 0 -${navBorderWidth}px 0 0 ${navBorderColor}` : 'none',
            transform: 'translateZ(0)'
        }}
      >
        <nav className="max-w-7xl mx-auto px-8 flex flex-col items-center pt-6 pb-2 gap-4">
           <div className="h-20 flex items-center">
             <LogoArea {...logoProps} variant={variant} />
           </div>
           
           <div className="flex items-center gap-10 py-4 w-full justify-center">
              {navLinks.map((item) => (
                <NavLink key={item.name} item={item} primaryColor={primaryColor} textColor={navTextColor} />
              ))}
              <button 
                onClick={onBookClick}
                className="text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                style={{ color: primaryColor }}
              >
                {settings?.header_cta_text || 'Agendar'}
              </button>
           </div>
        </nav>
      </header>
    )
  }

  // Classic Variant
  return (
    <header 
      className={cn(baseClasses, "top-0 backdrop-blur-xl transition-all overflow-visible h-20")}
      style={{ 
        backgroundColor: `${navBg}${opacityHex}`,
        boxShadow: showBorder ? `inset 0 -${navBorderWidth}px 0 0 ${navBorderColor}` : 'none',
        transform: 'translateZ(0)'
      }}
    >
      <nav className="flex items-center justify-between px-8 max-w-7xl mx-auto h-20 overflow-visible">
        <LogoArea {...logoProps} variant={variant} />

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <NavLink key={item.name} item={item} primaryColor={primaryColor} textColor={navTextColor} />
          ))}
        </div>

        <div className="flex items-center gap-6 justify-end flex-shrink-0">
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
            className="text-white px-8 h-12 rounded-full font-bold shadow-xl transition-all cursor-pointer border-none"
            style={{ backgroundColor: primaryColor, boxShadow: `0 10px 20px ${primaryColor}30` }}
          >
            {settings?.header_cta_text || 'Agendar Consulta'}
          </Button>
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
        "relative flex items-center transition-all duration-300 h-20 cursor-pointer overflow-visible",
        isMinimal ? "w-full justify-center" : "w-48 justify-start flex-shrink-0"
      )} 
    >
      <div 
        className={cn(
          "flex items-center transition-all duration-300 pointer-events-none",
          isMinimal ? "relative" : "absolute left-0 top-1/2 -translate-y-1/2"
        )}
        style={{ 
          transform: `translate(${offsetX}px, ${paddingTop}px)`,
          width: `${width}px`,
          zIndex: 10
        }}
      >
        {url ? (
          <img 
            src={url} 
            alt={name} 
            className="max-h-[160px] object-contain transition-all duration-300 w-full pointer-events-auto" 
          />
        ) : (
          <span 
            className="text-xl font-black tracking-tight uppercase italic whitespace-nowrap pointer-events-auto"
            style={{ color: color }}
          >
            {name}
          </span>
        )}
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
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full animate-in fade-in slide-in-from-left-2" 
          style={{ backgroundColor: primaryColor }}
        />
      )}
    </a>
  )
}
