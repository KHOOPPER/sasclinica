'use client'

import { useState, useEffect } from 'react'
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, addMinutes, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock, User, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getAvailableSlots, createPublicAppointment } from './actions'
import { toast } from 'sonner'

export function BookingPortal({ clinicData }: { clinicData: any }) {
  const { 
    primary_color = '#003366', 
    border_radius = 'rounded-2xl',
    accent_color = '#047857' 
  } = clinicData

  const [step, setStep] = useState(1)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(addDays(new Date(), 1))
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [appointmentResult, setAppointmentResult] = useState<any>(null)
  
  const [patientData, setPatientData] = useState({
    name: '',
    phone: '',
    dui: '',
    email: ''
  })

  // Fetch slots when date or service changes
  useEffect(() => {
    if (selectedService && selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      setIsLoadingSlots(true)
      getAvailableSlots(clinicData.clinic.id, dateStr, selectedService.duration_minutes)
        .then(slots => {
          setAvailableSlots(slots)
          setSelectedTime(null)
          setIsLoadingSlots(false)
        })
    }
  }, [selectedDate, selectedService, clinicData.clinic.id])

  const handleCreateAppointment = async () => {
    if (!patientData.name || !patientData.phone) {
      toast.error('Por favor complete los campos obligatorios.')
      return
    }

    setIsSubmitting(true)
    try {
      const startTimeStr = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`
      const startTime = parseISO(startTimeStr)
      const endTime = format(addMinutes(startTime, selectedService.duration_minutes), "yyyy-MM-dd'T'HH:mm:ss'Z'")

      const result = await createPublicAppointment({
        tenant_id: clinicData.tenant_id,
        clinic_id: clinicData.clinic.id,
        service_id: selectedService.id,
        start_time: startTime.toISOString(),
        end_time: endTime,
        patient_name: patientData.name,
        patient_phone: patientData.phone,
        patient_dui: patientData.dui,
        patient_email: patientData.email
      })

      if (result.success) {
        setAppointmentResult(result.data)
        setStep(4)
        toast.success('¡Cita agendada con éxito!')
      } else {
        console.error('Error creating appointment:', result.error)
        toast.error(result.error || 'No se pudo agendar la cita. Verifique si la clínica tiene personal configurado.')
      }
    } catch (err) {
      console.error('Submission error:', err)
      toast.error('Error inesperado al procesar la reserva.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- RENDERING HELPERS ---

  if (step === 4) {
    const whatsappNum = clinicData.contact_whatsapp || clinicData.clinic.phone
    const whatsappUrl = `https://wa.me/${whatsappNum?.replace(/\D/g, '')}?text=${encodeURIComponent(
      `Hola, soy ${patientData.name}, acabo de agendar una cita para ${selectedService.name} el día ${format(selectedDate, 'PPP', { locale: es })} a las ${selectedTime}.`
    )}`

    return (
      <div className="max-w-2xl mx-auto py-32 text-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
        <div className="flex justify-center">
            <div className={`p-6 shadow-2xl transition-all ${border_radius}`} style={{ backgroundColor: primary_color, boxShadow: `0 20px 40px -10px ${primary_color}40` }}>
                <CheckCircle className="h-16 w-16 text-white" />
            </div>
        </div>
        <div className="space-y-4">
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">Cita Confirmada</h2>
            <p className="text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                Su reserva ha sido procesada con éxito. Para agilizar su atención, por favor envíe este resumen vía WhatsApp.
            </p>
        </div>
        
        <div className={`bg-slate-50/50 p-12 border border-slate-100 text-left space-y-8 max-w-xl mx-auto shadow-sm ${border_radius}`}>
            <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Paciente</span>
                <p className="text-xl font-bold text-slate-900">{patientData.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-10">
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Servicio</span>
                    <p className="text-sm font-bold text-slate-900 uppercase">{selectedService.name}</p>
                </div>
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Horario</span>
                    <p className="text-sm font-bold text-slate-900 uppercase">{format(selectedDate, 'PPP', { locale: es })} - {selectedTime}</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-4 max-w-lg mx-auto">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`w-full text-white h-18 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl ${border_radius}`}
              style={{ backgroundColor: primary_color, boxShadow: `0 20px 40px -10px ${primary_color}30` }}
            >
              <MessageCircle className="h-6 w-6" />
              Enviar Resumen a WhatsApp
            </a>
            <Button 
                variant="ghost" 
                onClick={() => window.location.reload()}
                className="text-slate-400 hover:text-slate-900 font-black uppercase tracking-widest text-[10px]"
            >
                Realizar una nueva reserva
            </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 md:p-12">
      {/* STEP INDICATOR */}
      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-12">
          <span style={{ color: step >= 1 ? primary_color : '' }}>Servicio</span>
          <div className="h-px w-8 bg-slate-100"></div>
          <span style={{ color: step >= 2 ? primary_color : '' }}>Horario</span>
          <div className="h-px w-8 bg-slate-100"></div>
          <span style={{ color: step >= 3 ? primary_color : '' }}>Datos</span>
      </div>

      {step === 1 && (
        <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Paso 1: Seleccione el servicio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clinicData.clinic.services
              .filter((s: any) => s.is_active !== false)
              .map((s: any) => (
              <button
                key={s.id}
                onClick={() => { setSelectedService(s); setStep(2); }}
                className={`group relative bg-white border border-slate-100 p-8 text-left hover:shadow-2xl transition-all outline-none ${border_radius}`}
                onMouseEnter={e => e.currentTarget.style.borderColor = primary_color}
                onMouseLeave={e => e.currentTarget.style.borderColor = ''}
              >
                <div className="space-y-1 mt-4">
                    <h3 className="text-xl font-black text-slate-900 uppercase group-hover:translate-x-1 transition-transform">{s.name}</h3>
                    <p className="text-slate-400 font-medium text-sm line-clamp-2">{s.description}</p>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-black text-slate-900">${s.price}</span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <Clock className="h-3.5 w-3.5" />
                            {s.duration_minutes}m
                        </div>
                    </div>
                    <div className={`rounded-full p-2 transition-colors ${selectedService?.id === s.id ? 'text-white' : 'bg-slate-50 text-slate-400 group-hover:text-white'}`} style={{ backgroundColor: selectedService?.id === s.id ? primary_color : '' }}>
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-12 animate-in slide-in-from-right-8 duration-500">
          <div className="flex items-center gap-4">
            <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronLeft className="h-6 w-6" /></button>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Paso 2: Fecha y Hora</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* CALENDAR */}
            <div className="space-y-8">
                <Calendar 
                    selected={selectedDate} 
                    onSelect={setSelectedDate} 
                    primaryColor={primary_color}
                    borderRadius={border_radius}
                />
            </div>

            {/* TIME SLOTS */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Slots Disponibles</h3>
                    <span className="text-[10px] font-black pb-1 uppercase tracking-widest border-b-2" style={{ color: primary_color, borderColor: primary_color }}>
                        {format(selectedDate, 'PPP', { locale: es })}
                    </span>
                </div>
                
                {isLoadingSlots ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="h-8 w-8 border-4 border-slate-100 rounded-full animate-spin" style={{ borderTopColor: primary_color }}></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Consultando...</span>
                    </div>
                ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {availableSlots.map(time => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`h-14 text-sm font-black transition-all border ${border_radius} ${
                                    selectedTime === time 
                                    ? 'text-white scale-105 shadow-xl' 
                                    : 'bg-white border-slate-100 text-slate-900 hover:border-slate-300'
                                }`}
                                style={{ 
                                    backgroundColor: selectedTime === time ? primary_color : '',
                                    borderColor: selectedTime === time ? primary_color : '',
                                    boxShadow: selectedTime === time ? `0 10px 20px -5px ${primary_color}40` : ''
                                }}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className={`py-20 text-center space-y-2 border-2 border-dashed border-slate-100 ${border_radius}`}>
                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em]">Sin disponibilidad</p>
                        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Elija otra fecha</p>
                    </div>
                )}

                {selectedTime && (
                    <Button 
                        onClick={() => setStep(3)}
                        className={`w-full text-white h-16 font-black text-sm uppercase tracking-[0.2em] shadow-2xl mt-12 group transition-all ${border_radius}`}
                        style={{ backgroundColor: primary_color, boxShadow: `0 20px 40px -10px ${primary_color}40` }}
                    >
                        Confirmar Horario
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </Button>
                )}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="max-w-2xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-4">
                <button onClick={() => setStep(2)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronLeft className="h-6 w-6" /></button>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Finalizar Reserva</h2>
            </div>
            
            <div className={`bg-slate-50/50 p-10 border border-slate-100 space-y-10 shadow-sm ${border_radius}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nombre Completo</Label>
                        <Input 
                            value={patientData.name} 
                            onChange={e => setPatientData({...patientData, name: e.target.value})}
                            placeholder="Ej. Juan Pérez"
                            className={`bg-white border-slate-100 h-14 px-5 font-bold focus-visible:ring-1 ${border_radius}`}
                        />
                    </div>
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Teléfono (WhatsApp)</Label>
                        <Input 
                            value={patientData.phone} 
                            onChange={e => setPatientData({...patientData, phone: e.target.value})}
                            placeholder="7000 0000"
                            className={`bg-white border-slate-100 h-14 px-5 font-bold focus-visible:ring-1 ${border_radius}`}
                        />
                    </div>
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">DUI</Label>
                        <Input 
                            value={patientData.dui} 
                            onChange={e => setPatientData({...patientData, dui: e.target.value})}
                            placeholder="00000000-0"
                            className={`bg-white border-slate-100 h-14 px-5 font-bold focus-visible:ring-1 ${border_radius}`}
                        />
                    </div>
                    <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Correo Electrónico</Label>
                        <Input 
                            value={patientData.email} 
                            onChange={e => setPatientData({...patientData, email: e.target.value})}
                            placeholder="ejemplo@correo.com"
                            type="email"
                            className={`bg-white border-slate-100 h-14 px-5 font-bold focus-visible:ring-1 ${border_radius}`}
                        />
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200/50">
                    <div className="flex items-center gap-3 text-slate-400 mb-10">
                        <div className="rounded-full p-1 text-white" style={{ backgroundColor: primary_color }}><CheckCircle className="h-4 w-4" /></div>
                        <p className="text-xs font-bold leading-relaxed uppercase tracking-wider">Confirmo que los datos proporcionados son veraces.</p>
                    </div>
                    
                    <Button 
                        onClick={handleCreateAppointment}
                        disabled={isSubmitting}
                        className={`w-full text-white h-16 font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all ${border_radius}`}
                        style={{ backgroundColor: primary_color, boxShadow: `0 20px 40px -10px ${primary_color}40` }}
                    >
                        {isSubmitting ? 'Procesando...' : 'Confirmar mi Cita'}
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

function Calendar({ selected, onSelect, primaryColor = '#003366', borderRadius = 'rounded-2xl' }: { selected: Date, onSelect: (d: Date) => void, primaryColor?: string, borderRadius?: string }) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date())
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  })

  // Fill empty slots at start
  const startDayOfWeek = days[0].getDay()
  const emptyDays = Array(startDayOfWeek).fill(null)

  const handlePrev = () => setCurrentMonth(addDays(startOfMonth(currentMonth), -1))
  const handleNext = () => setCurrentMonth(addDays(endOfMonth(currentMonth), 1))

  return (
    <div className={`bg-white border border-slate-100 p-8 transition-all ${borderRadius}`}>
        <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
            </h3>
            <div className="flex gap-2">
                <button onClick={handlePrev} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={handleNext} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><ChevronRight className="h-5 w-5" /></button>
            </div>
        </div>
        
        <div className="grid grid-cols-7 mb-4">
            {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'].map(d => (
                <div key={d} className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 py-2">{d}</div>
            ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
            {emptyDays.map((_, i) => <div key={`empty-${i}`} className="aspect-square"></div>)}
            {days.map((day: Date) => {
                const isSelected = isSameDay(day, selected)
                const isPast = isBefore(day, startOfDay(new Date()))
                
                return (
                    <button
                        key={day.toISOString()}
                        disabled={isPast}
                        onClick={() => onSelect(day)}
                        className={`aspect-square rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                            isSelected 
                            ? 'text-white shadow-lg scale-110' 
                            : isPast 
                                ? 'text-slate-100 cursor-not-allowed opacity-30' 
                                : 'text-slate-900 hover:bg-slate-50'
                        }`}
                        style={{ 
                            backgroundColor: isSelected ? primaryColor : '',
                            boxShadow: isSelected ? `0 10px 20px -5px ${primaryColor}40` : ''
                        }}
                    >
                        {format(day, 'd')}
                    </button>
                )
            })}
        </div>
    </div>
  )
}

function startOfDay(d: Date) {
    const newDate = new Date(d)
    newDate.setHours(0, 0, 0, 0)
    return newDate
}
