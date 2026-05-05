'use client'

import { useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Trash2, Edit } from 'lucide-react'
import { deleteStaffMember } from './actions'
import EditStaffModal from './EditStaffMemberModal'
import { toast } from 'sonner'

export function StaffActions({ member }: { member: any }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar a este trabajador? Esta acción es irreversible.')) {
      return
    }

    setIsDeleting(true)
    const result = await deleteStaffMember(member.id, member.user_id || profile?.id)
    if (result?.error) {
      toast.error(result.error)
      setIsDeleting(false)
    } else {
      toast.success('Trabajador eliminado')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <EditStaffModal member={member} />
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
