'use client'

import { useState, useActionState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateTenant } from './actions'
import { Pencil } from 'lucide-react'

interface EditTenantModalProps {
  tenantId: string
  initialName: string
  initialSlug: string
}

export function EditTenantModal({ tenantId, initialName, initialSlug }: EditTenantModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const updateTenantWithId = async (prevState: any, formData: FormData) => {
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    return await updateTenant(tenantId, name, slug)
  }

  const [state, action, isPending] = useActionState(updateTenantWithId, undefined)

  useEffect(() => {
    if (state?.success && !isPending) {
      setIsOpen(false)
    }
  }, [state?.success, isPending])

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="flex items-center gap-2">
        <Pencil className="h-4 w-4" />
        Editar
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Editar Clínica">
        <form action={action} className="space-y-4">
          
          {state?.error && (
            <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-md font-medium text-left">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Clínica</Label>
            <Input id="name" name="name" defaultValue={initialName} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL amigable)</Label>
            <Input id="slug" name="slug" defaultValue={initialSlug} required />
            <p className="text-xs text-gray-500">¡Atención! Cambiar el slug cambiará la URL pública de la clínica.</p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t mt-4 border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
