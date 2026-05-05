'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'
import { markAsAttended } from '@/app/actions/payment_actions'
import { toast } from 'sonner'

interface MarkAsAttendedButtonProps {
  appointmentId: string
}

export default function MarkAsAttendedButton({ appointmentId }: MarkAsAttendedButtonProps) {
  const [isPending, setIsPending] = useState(false)

  const handleMark = async () => {
    setIsPending(true)
    try {
      const result = await markAsAttended(appointmentId)
      if (result.success) {
        toast.success('Cita marcada como atendida.')
      } else {
        toast.error(result.error || 'Error al actualizar.')
      }
    } catch (e) {
      toast.error('Error de red.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={handleMark}
      disabled={isPending}
      className="text-[#003366] border-[#003366]/20 hover:bg-blue-50 font-bold text-xs px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5"
    >
      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
      Atendido
    </Button>
  )
}
