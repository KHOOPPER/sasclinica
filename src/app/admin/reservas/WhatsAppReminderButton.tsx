'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MessageSquare, Check, Loader2 } from 'lucide-react'
import { markAsNotified } from './actions'
import { toast } from 'sonner'

interface WhatsAppReminderButtonProps {
  appointment: {
    id: string
    notified: boolean
    start_time: string
    patient: {
      first_name: string
      last_name: string
      phone: string
    }
    service: {
      name: string
    }
    clinic: {
      name: string
    }
  }
}

export default function WhatsAppReminderButton({ appointment }: WhatsAppReminderButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const isNotified = appointment.notified

  const handleSendReminder = async () => {
    if (!appointment.patient.phone) {
      toast.error('El paciente no tiene un número de teléfono registrado.')
      return
    }

    setIsPending(true)
    try {
      // 1. Mark as notified in DB
      const result = await markAsNotified(appointment.id)
      
      if (result.success) {
        // 2. Generate WhatsApp link
        const phone = appointment.patient.phone.replace(/\D/g, '') // Remove non-numeric chars
        const date = new Date(appointment.start_time).toLocaleDateString('es-ES', { 
          day: 'numeric', 
          month: 'long' 
        })
        const time = new Date(appointment.start_time).toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        })
        
        const clinicName = appointment.clinic?.name || 'la clínica'
        const serviceName = appointment.service?.name || 'su cita'
        const patientName = appointment.patient?.first_name || 'Estimado cliente'
        
        const message = `Hola ${patientName}, le saludamos de ${clinicName}. Le recordamos su cita para el día ${date} a las ${time} para el servicio de ${serviceName}. Por favor confirme su asistencia.`
        
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`
        
        // 3. Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank')
        toast.success('Recordatorio enviado y marcado como notificado.')
      } else {
        toast.error(result.error || 'Error al actualizar el estado de la cita.')
      }
    } catch (e: any) {
      console.error('REMINDER ERROR:', e)
      toast.error(`Error al procesar el recordatorio: ${e.message || 'Error de red'}`)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={handleSendReminder}
      disabled={isPending}
      title={isNotified ? 'Recordatorio ya enviado' : 'Enviar recordatorio de WhatsApp'}
      className={`rounded-xl px-3 py-1.5 transition-all flex items-center gap-1.5 font-bold text-xs ${
        isNotified 
          ? 'bg-blue-50 text-[#003366] border-[#003366]/20' 
          : 'text-[#003366] border-[#003366]/20 hover:bg-blue-50 hover:border-[#003366]/40'
      }`}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isNotified ? (
        <Check className="h-3.5 w-3.5" />
      ) : (
        <MessageSquare className="h-3.5 w-3.5" />
      )}
      {isNotified ? 'Notificado' : 'Notificar'}
    </Button>
  )
}
