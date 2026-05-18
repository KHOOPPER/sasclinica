'use client'

import { useState, useEffect } from 'react'
import { Bell, Send, AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { createGlobalNotification } from '@/app/superadmin/actions'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function NotificationDropdown({ isSuperadmin, planExpiresAt, clinicId }: { isSuperadmin: boolean, planExpiresAt?: string | null, clinicId?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  
  // Calcular expiración del plan (Fase 4)
  const daysToExpire = planExpiresAt 
    ? Math.ceil((new Date(planExpiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null
    
  const isExpiringSoon = daysToExpire !== null && daysToExpire <= 7 && daysToExpire > 0

  useEffect(() => {
    if (!isSuperadmin) {
      const fetchNotifications = async () => {
        const supabase = createClient()
        // Buscar notificaciones de las ultimas 48 horas (Globales + Específicas de la clínica)
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
        
        let query = supabase
          .from('system_notifications')
          .select('*')
          .gte('created_at', fortyEightHoursAgo)
          
        if (clinicId) {
          query = query.or(`clinic_id.is.null,clinic_id.eq.${clinicId}`)
        } else {
          query = query.is('clinic_id', null)
        }
          
        const { data } = await query
          .order('created_at', { ascending: false })
          .limit(10)
        
        if (data) {
          setNotifications(data)
        }
      }
      fetchNotifications()
    }
  }, [isSuperadmin])

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSending(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await createGlobalNotification(formData)
      if (result.success) {
        toast.success('Notificación global enviada a todas las clínicas')
        setIsOpen(false)
        ;(e.target as HTMLFormElement).reset()
      } else {
        toast.error(result.error || 'Error al enviar la notificación')
      }
    } catch (err) {
      toast.error('Error de conexión')
    } finally {
      setIsSending(false)
    }
  }

  // Combinar notificaciones DB con alerta del sistema (Fase 4)
  const allNotifications = [...notifications]
  if (isExpiringSoon) {
    allNotifications.unshift({
      id: 'system-expiry-alert',
      title: '¡Tu plan vencerá pronto!',
      message: `Tu suscripción expira en ${daysToExpire} día(s). Por favor, contacta a soporte para renovarla.`,
      type: 'danger',
      created_at: new Date().toISOString()
    })
  }

  const hasUnread = !isSuperadmin && allNotifications.length > 0

  const getIcon = (type: string) => {
    switch (type) {
      case 'danger': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      default: return <Info className="w-4 h-4 text-blue-500" />
    }
  }

  const getBg = (type: string) => {
    switch (type) {
      case 'danger': return 'bg-red-500/10 border-red-500/20'
      case 'warning': return 'bg-orange-500/10 border-orange-500/20'
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20'
      default: return 'bg-blue-500/10 border-blue-500/20'
    }
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-2xl transition-all duration-300 ${isOpen ? 'bg-brand-primary text-white shadow-lg' : 'text-slate-400 hover:text-brand-primary hover:bg-bg-main'}`}
      >
        <Bell className="h-5 w-5 hover:scale-105 transition-transform" />
        {hasUnread && <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-card-bg animate-pulse"></span>}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-4 w-80 bg-card-bg rounded-[2rem] shadow-2xl border border-card-border p-5 z-50 animate-in fade-in zoom-in duration-75 backdrop-blur-xl">
            {isSuperadmin ? (
              // VISTA SUPERADMIN
              <div className="space-y-4">
                <div className="border-b border-card-border pb-3">
                  <h4 className="text-sm font-black text-text-main uppercase tracking-tight">Nueva Notificación</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Enviar alerta a todas las clínicas</p>
                </div>
                
                <form onSubmit={handleSend} className="space-y-3">
                  <div>
                    <label htmlFor="title" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Título</label>
                    <input 
                      id="title"
                      name="title" 
                      required 
                      placeholder="Ej. Mantenimiento Programado"
                      className="w-full bg-bg-main border border-card-border rounded-xl px-3 py-2 text-xs font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mensaje</label>
                    <textarea 
                      id="message"
                      name="message" 
                      required 
                      rows={3}
                      placeholder="Detalles de la notificación..."
                      className="w-full bg-bg-main border border-card-border rounded-xl px-3 py-2 text-xs font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tipo</label>
                    <select 
                      id="type"
                      name="type" 
                      className="w-full bg-bg-main border border-card-border rounded-xl px-3 py-2 text-xs font-bold text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    >
                      <option value="info">Información (Azul)</option>
                      <option value="warning">Advertencia (Naranja)</option>
                      <option value="success">Éxito (Verde)</option>
                      <option value="danger">Urgente (Rojo)</option>
                    </select>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSending}
                    className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 bg-brand-primary hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all disabled:opacity-50"
                  >
                    <Send className="w-3 h-3" />
                    {isSending ? 'Enviando...' : 'Enviar Global'}
                  </button>
                </form>
              </div>
            ) : (
              // VISTA ADMIN
              <div className="space-y-4">
                <div className="border-b border-card-border pb-3 flex justify-between items-center">
                  <h4 className="text-sm font-black text-text-main uppercase tracking-tight">Notificaciones</h4>
                  <span className="text-[10px] font-black text-slate-500 bg-bg-main px-2 py-0.5 rounded-full uppercase tracking-widest">Últimas 48h</span>
                </div>
                
                <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {allNotifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <Bell className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-xs font-bold text-slate-400">No hay notificaciones recientes.</p>
                    </div>
                  ) : (
                    allNotifications.map((notif) => (
                      <div key={notif.id} className={`p-3 rounded-xl border ${getBg(notif.type)} transition-colors`}>
                        <div className="flex gap-3">
                          <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                          <div>
                            <h5 className={`text-xs font-black uppercase tracking-tight ${notif.type === 'danger' ? 'text-red-500' : 'text-text-main'}`}>
                              {notif.title}
                            </h5>
                            <p className="text-xs font-medium text-slate-500 mt-1 leading-snug">
                              {notif.message}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                              {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: es })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

