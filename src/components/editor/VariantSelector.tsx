import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VariantOption {
  id: string
  label: string
  icon: React.ElementType
  description?: string
  preview?: React.ReactNode  // optional SVG/JSX thumbnail
}

interface VariantSelectorProps {
  options: VariantOption[]
  selected: string
  onChange: (id: string) => void
  label?: string
}

// ── Tiny SVG layouts for each common variant ─────────────────────────────────
const LayoutPreviews: Record<string, React.ReactNode> = {
  // Navbar variants
  classic: (
    <svg viewBox="0 0 60 18" fill="none" className="w-full h-auto">
      <rect width="60" height="18" rx="2" fill="#f1f5f9"/>
      <rect x="4" y="6" width="10" height="6" rx="1" fill="#94a3b8"/>
      <rect x="34" y="7" width="6" height="4" rx="1" fill="#cbd5e1"/>
      <rect x="42" y="7" width="6" height="4" rx="1" fill="#cbd5e1"/>
      <rect x="50" y="7" width="6" height="4" rx="1.5" fill="#334155"/>
    </svg>
  ),
  minimal: (
    <svg viewBox="0 0 60 18" fill="none" className="w-full h-auto">
      <rect width="60" height="18" rx="2" fill="#ffffff"/>
      <rect x="4" y="7" width="8" height="4" rx="1" fill="#e2e8f0"/>
      <rect x="28" y="8" width="4" height="2" rx="0.5" fill="#e2e8f0"/>
      <rect x="35" y="8" width="4" height="2" rx="0.5" fill="#e2e8f0"/>
      <rect x="42" y="8" width="4" height="2" rx="0.5" fill="#e2e8f0"/>
    </svg>
  ),
  floating: (
    <svg viewBox="0 0 60 24" fill="none" className="w-full h-auto">
      <rect width="60" height="24" rx="2" fill="#f8fafc"/>
      <rect x="6" y="5" width="48" height="14" rx="7" fill="white" stroke="#e2e8f0" strokeWidth="0.5"/>
      <rect x="12" y="9" width="8" height="6" rx="1" fill="#94a3b8"/>
      <rect x="38" y="11" width="4" height="2" rx="0.5" fill="#cbd5e1"/>
      <rect x="44" y="11" width="4" height="2" rx="0.5" fill="#334155"/>
    </svg>
  ),
  glass: (
    <svg viewBox="0 0 60 18" fill="none" className="w-full h-auto">
      <rect width="60" height="18" rx="2" fill="#1e293b"/>
      <rect width="60" height="18" rx="2" fill="white" fillOpacity="0.1"/>
      <rect x="4" y="6" width="8" height="6" rx="1" fill="white" fillOpacity="0.4"/>
      <rect x="38" y="7" width="5" height="4" rx="1" fill="white" fillOpacity="0.3"/>
      <rect x="45" y="7" width="5" height="4" rx="1" fill="white" fillOpacity="0.3"/>
      <rect x="52" y="7" width="5" height="4" rx="1.5" fill="white" fillOpacity="0.7"/>
    </svg>
  ),
  // Hero variants
  centered: (
    <svg viewBox="0 0 60 36" fill="none" className="w-full h-auto">
      <rect width="60" height="36" rx="2" fill="#1e293b"/>
      <rect x="15" y="10" width="30" height="4" rx="1.5" fill="white" fillOpacity="0.8"/>
      <rect x="20" y="17" width="20" height="2" rx="1" fill="white" fillOpacity="0.4"/>
      <rect x="22" y="23" width="16" height="5" rx="2.5" fill="#3b82f6"/>
    </svg>
  ),
  gradient: (
    <svg viewBox="0 0 60 36" fill="none" className="w-full h-auto">
      <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#1e293b"/><stop offset="1" stopColor="#334155"/></linearGradient></defs>
      <rect width="60" height="36" rx="2" fill="url(#g1)"/>
      <rect x="4" y="10" width="25" height="4" rx="1.5" fill="white" fillOpacity="0.8"/>
      <rect x="4" y="17" width="18" height="2" rx="1" fill="white" fillOpacity="0.4"/>
      <rect x="4" y="23" width="14" height="5" rx="2.5" fill="#3b82f6"/>
      <rect x="33" y="6" width="23" height="24" rx="2" fill="white" fillOpacity="0.1"/>
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 60 36" fill="none" className="w-full h-auto">
      <rect width="60" height="36" rx="2" fill="#000"/>
      <rect x="5" y="8" width="50" height="7" rx="2" fill="white" fillOpacity="0.9"/>
      <rect x="10" y="19" width="40" height="3" rx="1" fill="white" fillOpacity="0.4"/>
      <rect x="20" y="26" width="20" height="5" rx="2.5" fill="#ffffff" fillOpacity="0.15"/>
    </svg>
  ),
  split: (
    <svg viewBox="0 0 60 36" fill="none" className="w-full h-auto">
      <rect width="60" height="36" rx="2" fill="#f8fafc"/>
      <rect width="30" height="36" rx="2" fill="#1e293b"/>
      <rect x="4" y="10" width="20" height="4" rx="1.5" fill="white" fillOpacity="0.8"/>
      <rect x="4" y="17" width="14" height="2" rx="1" fill="white" fillOpacity="0.4"/>
      <rect x="4" y="23" width="12" height="4" rx="2" fill="#3b82f6"/>
      <rect x="34" y="6" width="22" height="24" rx="3" fill="#e2e8f0"/>
    </svg>
  ),
  footer_classic: (
    <svg viewBox="0 0 60 24" fill="none" className="w-full h-auto">
      <rect width="60" height="24" rx="2" fill="#1e293b"/>
      <rect x="4" y="6" width="12" height="3" rx="1" fill="white" fillOpacity="0.7"/>
      <rect x="24" y="6" width="8" height="2" rx="0.5" fill="white" fillOpacity="0.4"/>
      <rect x="24" y="10" width="6" height="2" rx="0.5" fill="white" fillOpacity="0.3"/>
      <rect x="40" y="6" width="8" height="2" rx="0.5" fill="white" fillOpacity="0.4"/>
      <rect x="4" y="20" width="52" height="0.5" fill="white" fillOpacity="0.1"/>
    </svg>
  ),
  // Gallery variants
  grid: (
    <svg viewBox="0 0 60 40" fill="none" className="w-full h-auto">
      <rect width="60" height="40" rx="2" fill="#f8fafc"/>
      <rect x="4" y="4" width="16" height="12" rx="2" fill="#cbd5e1"/>
      <rect x="22" y="4" width="16" height="12" rx="2" fill="#94a3b8"/>
      <rect x="40" y="4" width="16" height="12" rx="2" fill="#cbd5e1"/>
      <rect x="4" y="18" width="16" height="12" rx="2" fill="#94a3b8"/>
      <rect x="22" y="18" width="16" height="12" rx="2" fill="#cbd5e1"/>
      <rect x="40" y="18" width="16" height="12" rx="2" fill="#94a3b8"/>
    </svg>
  ),
  masonry: (
    <svg viewBox="0 0 60 40" fill="none" className="w-full h-auto">
      <rect width="60" height="40" rx="2" fill="#f8fafc"/>
      <rect x="4" y="4" width="16" height="20" rx="2" fill="#94a3b8"/>
      <rect x="22" y="4" width="16" height="10" rx="2" fill="#cbd5e1"/>
      <rect x="40" y="4" width="16" height="15" rx="2" fill="#94a3b8"/>
      <rect x="22" y="16" width="16" height="14" rx="2" fill="#94a3b8"/>
      <rect x="4" y="26" width="16" height="10" rx="2" fill="#cbd5e1"/>
      <rect x="40" y="21" width="16" height="9" rx="2" fill="#cbd5e1"/>
    </svg>
  ),
  carousel: (
    <svg viewBox="0 0 60 32" fill="none" className="w-full h-auto">
      <rect width="60" height="32" rx="2" fill="#f8fafc"/>
      <rect x="8" y="4" width="44" height="20" rx="2" fill="#94a3b8"/>
      <circle cx="26" cy="29" r="1.5" fill="#cbd5e1"/>
      <circle cx="30" cy="29" r="1.5" fill="#334155"/>
      <circle cx="34" cy="29" r="1.5" fill="#cbd5e1"/>
    </svg>
  ),
  lightbox: (
    <svg viewBox="0 0 60 40" fill="none" className="w-full h-auto">
      <rect width="60" height="40" rx="2" fill="#f8fafc"/>
      <rect x="4" y="4" width="28" height="20" rx="2" fill="#94a3b8"/>
      <rect x="34" y="4" width="13" height="9" rx="2" fill="#cbd5e1"/>
      <rect x="34" y="15" width="13" height="9" rx="2" fill="#94a3b8"/>
      <rect x="4" y="26" width="43" height="10" rx="2" fill="#e2e8f0"/>
    </svg>
  ),
  // Team variants
  cards: (
    <svg viewBox="0 0 60 36" fill="none" className="w-full h-auto">
      <rect width="60" height="36" rx="2" fill="#f8fafc"/>
      <rect x="4" y="6" width="15" height="24" rx="2" fill="white" stroke="#e2e8f0" strokeWidth="0.5"/>
      <circle cx="11.5" cy="14" r="4" fill="#cbd5e1"/>
      <rect x="6" y="20" width="11" height="2" rx="0.5" fill="#94a3b8"/>
      <rect x="7" y="23" width="9" height="1.5" rx="0.5" fill="#e2e8f0"/>
      <rect x="22" y="6" width="15" height="24" rx="2" fill="white" stroke="#e2e8f0" strokeWidth="0.5"/>
      <circle cx="29.5" cy="14" r="4" fill="#cbd5e1"/>
      <rect x="24" y="20" width="11" height="2" rx="0.5" fill="#94a3b8"/>
      <rect x="40" y="6" width="15" height="24" rx="2" fill="white" stroke="#e2e8f0" strokeWidth="0.5"/>
      <circle cx="47.5" cy="14" r="4" fill="#cbd5e1"/>
      <rect x="42" y="20" width="11" height="2" rx="0.5" fill="#94a3b8"/>
    </svg>
  ),
  horizontal: (
    <svg viewBox="0 0 60 36" fill="none" className="w-full h-auto">
      <rect width="60" height="36" rx="2" fill="#f8fafc"/>
      <rect x="4" y="8" width="52" height="6" rx="2" fill="white" stroke="#e2e8f0" strokeWidth="0.5"/>
      <circle cx="10" cy="11" r="2.5" fill="#cbd5e1"/>
      <rect x="15" y="9.5" width="12" height="1.5" rx="0.5" fill="#94a3b8"/>
      <rect x="15" y="12" width="8" height="1" rx="0.5" fill="#e2e8f0"/>
      <rect x="4" y="16" width="52" height="6" rx="2" fill="white" stroke="#e2e8f0" strokeWidth="0.5"/>
      <circle cx="10" cy="19" r="2.5" fill="#cbd5e1"/>
      <rect x="15" y="17.5" width="12" height="1.5" rx="0.5" fill="#94a3b8"/>
      <rect x="4" y="24" width="52" height="6" rx="2" fill="white" stroke="#e2e8f0" strokeWidth="0.5"/>
      <circle cx="10" cy="27" r="2.5" fill="#cbd5e1"/>
    </svg>
  ),
  list: (
    <svg viewBox="0 0 60 36" fill="none" className="w-full h-auto">
      <rect width="60" height="36" rx="2" fill="#f8fafc"/>
      <rect x="4" y="5" width="52" height="7" rx="1.5" fill="white" stroke="#e2e8f0" strokeWidth="0.5"/>
      <rect x="8" y="7.5" width="15" height="2" rx="0.5" fill="#94a3b8"/>
      <rect x="40" y="7.5" width="12" height="2" rx="1" fill="#3b82f6" fillOpacity="0.4"/>
      <rect x="4" y="14" width="52" height="7" rx="1.5" fill="white" stroke="#e2e8f0" strokeWidth="0.5"/>
      <rect x="8" y="16.5" width="12" height="2" rx="0.5" fill="#94a3b8"/>
      <rect x="4" y="23" width="52" height="7" rx="1.5" fill="white" stroke="#e2e8f0" strokeWidth="0.5"/>
      <rect x="8" y="25.5" width="18" height="2" rx="0.5" fill="#94a3b8"/>
    </svg>
  ),
}

export function VariantSelector({ options, selected, onChange, label }: VariantSelectorProps) {
  return (
    <div className="space-y-2">
      {label && <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</p>}
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const Icon = option.icon
          const isSelected = selected === option.id
          const preview = option.preview ?? LayoutPreviews[option.id]

          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              title={option.description || option.label}
              className={cn(
                'group relative flex flex-col rounded-xl border-2 overflow-hidden transition-all duration-200 text-left',
                isSelected
                  ? 'border-slate-900 shadow-md scale-[1.02]'
                  : 'border-slate-100 hover:border-slate-300 hover:shadow-sm'
              )}
            >
              {/* Thumbnail area */}
              <div className={cn(
                'w-full p-2 transition-colors',
                isSelected ? 'bg-slate-50' : 'bg-slate-50 group-hover:bg-white'
              )}>
                {preview ? (
                  <div className="w-full">{preview}</div>
                ) : (
                  <div className="w-full h-10 flex items-center justify-center">
                    <Icon size={16} className="text-slate-300" />
                  </div>
                )}
              </div>

              {/* Label bar */}
              <div className={cn(
                'px-2 py-1.5 flex items-center justify-between transition-colors',
                isSelected ? 'bg-slate-900' : 'bg-white'
              )}>
                <p className={cn(
                  'text-[8px] font-bold uppercase tracking-wider leading-none',
                  isSelected ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'
                )}>
                  {option.label}
                </p>
                {isSelected && <Check size={9} strokeWidth={3} className="text-white shrink-0" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
