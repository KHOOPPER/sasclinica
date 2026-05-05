'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { deleteTenant } from './actions'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface DeleteTenantButtonProps {
  tenantId: string
  tenantName: string
}

export function DeleteTenantButton({ tenantId, tenantName }: DeleteTenantButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteTenant(tenantId)
      if (result.success) {
        toast.success('Clínica eliminada correctamente')
        setIsConfirmOpen(false)
      } else {
        toast.error(result.error || 'Error al eliminar la clínica')
      }
    })
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsConfirmOpen(true)} 
        disabled={isPending}
        className="flex items-center gap-2 border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500"
      >
        <Trash2 className="h-4 w-4" />
        Eliminar
      </Button>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar Clínica"
        description={`¿Estás seguro de que deseas eliminar la clínica "${tenantName}"? Esta acción borrará todos los datos asociados y no se puede deshacer.`}
        confirmText="Eliminar Clínica"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isPending}
      />
    </>
  )
}
