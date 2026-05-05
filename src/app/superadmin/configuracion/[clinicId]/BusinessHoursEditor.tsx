'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { updateBusinessHours } from './actions'
import { toast } from 'sonner'
import { Clock, Info, Save, Loader2 } from 'lucide-react'

const DAYS = [
  { name: 'Domingo', key: 0 },
  { name: 'Lunes', key: 1 },
  { name: 'Martes', key: 2 },
  { name: 'Miércoles', key: 3 },
  { name: 'Jueves', key: 4 },
  { name: 'Viernes', key: 5 },
  { name: 'Sábado', key: 6 }
]

export function BusinessHoursEditor({ clinicId, tenantId, initialHours }: { clinicId: string, tenantId: string, initialHours: any[] }) {
  const [hours, setHours] = useState(
    Array.from({ length: 7 }, (_, i) => {
      const existing = initialHours.find(h => h.day_of_week === i)
      return existing || {
        day_of_week: i,
        open_time: '08:00',
        close_time: '18:00',
        is_closed: i === 0 // Sunday closed by default
      }
    })
  )
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdate = (day: number, field: string, value: any) => {
    setHours(prev => prev.map(h => h.day_of_week === day ? { ...h, [field]: value } : h))
  }

  const validateHours = () => {
    for (const h of hours) {
      if (!h.is_closed) {
        if (h.close_time <= h.open_time) {
          toast.error(`Error en ${DAYS[h.day_of_week].name}: La hora de cierre debe ser posterior a la de apertura.`)
          return false
        }
      }
    }
    return true
  }

  const onSave = async () => {
    if (!validateHours()) return

    setIsSaving(true)
    const prepared = hours.map(h => ({ 
      ...h, 
      tenant_id: tenantId,
      open_time: h.open_time.length === 5 ? `${h.open_time}:00` : h.open_time,
      close_time: h.close_time.length === 5 ? `${h.close_time}:00` : h.close_time
    }))

    const result = await updateBusinessHours(clinicId, prepared)
    if (result.success) {
      toast.success('Horarios actualizados correctamente')
    } else {
      toast.error(result.error)
    }
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3 text-[#003366]">
        <Info className="h-5 w-5 shrink-0 mt-0.5" />
        <p className="text-sm font-medium leading-relaxed">
          Configure los bloques horarios en los que la clínica estará habilitada para recibir citas. 
          Los días marcados como <span className="font-bold">Cerrado</span> no aparecerán en el calendario público.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {DAYS.map(({ name, key }) => {
            const day = hours.find(h => h.day_of_week === key)!
            const isClosed = day.is_closed

            return (
              <div key={key} className={`px-6 py-5 flex flex-wrap items-center justify-between gap-4 transition-colors ${isClosed ? 'bg-slate-50/50' : 'bg-white'}`}>
                <div className="min-w-[120px]">
                  <span className={`text-sm font-bold tracking-tight ${isClosed ? 'text-slate-400' : 'text-slate-900'}`}>
                    {name}
                  </span>
                </div>
                
                <div className={`flex items-center gap-3 transition-opacity ${isClosed ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                  <div className="relative flex items-center">
                    <Clock className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="time" 
                      value={day.open_time.slice(0, 5)} 
                      onChange={(e) => handleUpdate(key, 'open_time', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all"
                    />
                  </div>
                  <span className="text-slate-300 font-bold">a</span>
                  <div className="relative flex items-center">
                    <Clock className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="time" 
                      value={day.close_time.slice(0, 5)} 
                      onChange={(e) => handleUpdate(key, 'close_time', e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/50 px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${isClosed ? 'text-red-500' : 'text-[#003366]'}`}>
                     {isClosed ? 'Cerrado' : 'Abierto'}
                  </span>
                  <Switch 
                    checked={!isClosed} 
                    onCheckedChange={(checked) => handleUpdate(key, 'is_closed', !checked)}
                    className="data-[state=checked]:bg-[#003366]"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          onClick={onSave} 
          disabled={isSaving} 
          className="bg-[#003366] hover:bg-[#002244] text-white rounded-2xl px-8 h-12 font-bold shadow-lg shadow-blue-900/10 transition-all flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Guardando...' : 'Guardar Horarios'}
        </Button>
      </div>
    </div>
  )
}
