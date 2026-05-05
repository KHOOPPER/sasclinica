'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function LandingHeader({ 
  clinicName, 
  logoUrl, 
  onBookClick, 
  primaryColor = '#003366',
  logoHeight = 40,
  logoWidth = 160,
  logoOffsetY = 0,
  logoOffsetX = 0
}: { 
  clinicName: string, 
  logoUrl?: string, 
  onBookClick: () => void, 
  primaryColor?: string,
  logoHeight?: number,
  logoWidth?: number,
  logoOffsetY?: number,
  logoOffsetX?: number
}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-[240px] relative z-10">
          {logoUrl ? (
            <div className="flex items-center py-2 h-20">
              <img 
                src={logoUrl} 
                alt={clinicName} 
                style={{ 
                  height: `${logoHeight}px`, 
                  width: logoWidth ? `${logoWidth}px` : 'auto',
                  transform: `translate(${logoOffsetX}px, ${logoOffsetY}px)`
                }}
                className="object-contain transition-all duration-300" 
              />
            </div>
          ) : (
            <span className="text-2xl font-black tracking-tight text-[#003366] uppercase">
              {clinicName}
            </span>
          )}
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {['Inicio', 'Servicios', 'Contacto'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest"
              onMouseEnter={(e) => (e.currentTarget.style.color = primaryColor)}
              onMouseLeave={(e) => (e.currentTarget.style.color = '')}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end">
          <Button 
            onClick={onBookClick}
            className="text-white rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px] shadow-xl transition-all"
            style={{ backgroundColor: primaryColor, boxShadow: `0 10px 20px -5px ${primaryColor}40` }}
          >
            Agendar Consulta
          </Button>
        </div>
      </div>
    </header>
  )
}
