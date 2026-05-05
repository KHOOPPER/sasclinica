'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteService } from './actions'
import { useState } from 'react'
import { EditServiceModal } from './EditServiceModal'
import { toast } from 'sonner'

export function ServiceActions({ service, specialties = [] }: { service: any, specialties?: any[] }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteService(service.id)
    if (result?.error) {
      toast.error(result.error)
      setIsDeleting(false)
      setShowConfirm(false)
    } else {
      toast.success('Servicio eliminado permanentemente', {
        className: 'bg-white border-slate-200 text-[#2D3748] font-bold'
      })
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {!showConfirm ? (
        <>
          <EditServiceModal service={service} specialties={specialties} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirm(true)}
            className="text-slate-400 hover:text-[#2D3748] hover:bg-slate-100 rounded-lg transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowConfirm(false)}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 px-2"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-[#2D3748] hover:bg-[#1A202C] text-white text-[10px] font-bold px-3 py-1 rounded-lg h-7"
          >
            {isDeleting ? 'Eliminando...' : 'Confirmar'}
          </Button>
        </div>
      )}
    </div>
  )
}
