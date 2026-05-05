"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'md' | 'lg' | 'xl' | '2xl'
}

const sizeClasses = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl'
}

export function Modal({ isOpen, onClose, title, children, size = 'lg' }: ModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`relative z-[10000] w-full ${size === 'xl' ? 'max-w-2xl' : size === '2xl' ? 'max-w-4xl' : 'max-w-lg'} scale-100 overflow-hidden rounded-[2.5rem] bg-card-bg shadow-2xl border border-slate-200/50 dark:border-white/5 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300`}>
        <div className="flex items-center justify-between border-b border-slate-100/50 dark:border-white/5 px-8 py-6">
          <h2 className="text-xl font-black text-text-main uppercase tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all font-black"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
