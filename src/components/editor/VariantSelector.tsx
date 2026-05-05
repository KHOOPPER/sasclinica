import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VariantOption {
  id: string
  label: string
  icon: React.ElementType
  description?: string
}

interface VariantSelectorProps {
  options: VariantOption[]
  selected: string
  onChange: (id: string) => void
  label?: string
}

export function VariantSelector({ options, selected, onChange, label }: VariantSelectorProps) {
  return (
    <div className="space-y-3">
      {label && <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p>}
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const Icon = option.icon
          const isSelected = selected === option.id
          
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={cn(
                "group relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300",
                isSelected 
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                  : "bg-white border-slate-100 hover:border-slate-300 text-slate-500"
              )}
            >
              <Icon size={14} className={cn("transition-colors", isSelected ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
              <p className={cn(
                "text-[9px] font-bold uppercase tracking-wider transition-colors",
                isSelected ? "text-white" : "text-slate-600 group-hover:text-slate-900"
              )}>
                {option.label}
              </p>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check size={10} strokeWidth={3} />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
