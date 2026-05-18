'use client'

import * as React from 'react'
import { Modal } from './modal'
import { Button } from './button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-3 rounded-full ${
          variant === 'danger' ? 'bg-red-50 text-red-600' : 
          variant === 'warning' ? 'bg-amber-50 text-amber-600' : 
          'bg-blue-50 text-blue-600'
        }`}>
          <AlertTriangle className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-600">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'default'}
            onClick={onConfirm} 
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
