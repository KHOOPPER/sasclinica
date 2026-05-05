'use client'

import { useState, useActionState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Image as ImageIcon, Globe, Tag, Sparkles, Clock, DollarSign, Stethoscope, ChevronRight } from 'lucide-react'
import { createService } from './actions'
import { cn } from '@/lib/utils'

interface NewServiceModalProps {
  specialties?: any[]
  initialIsOffer?: boolean
}

export function NewServiceModal({ specialties = [], initialIsOffer = false }: NewServiceModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [isOffer, setIsOffer] = useState(initialIsOffer)
  const initialState = { success: false, error: '' }
  const [state, formAction, isPending] = useActionState(createService, initialState)

  useEffect(() => {
    if (state?.success && !isPending) {
      setIsOpen(false)
      setImageUrl('')
      setIsPublished(true)
      setIsOffer(initialIsOffer)
    }
  }, [state?.success, isPending, initialIsOffer])

  useEffect(() => {
    if (isOpen) {
      setIsOffer(initialIsOffer)
    }
  }, [isOpen, initialIsOffer])

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)} 
        className={cn(
          "h-12 px-6 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2",
          "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200/50"
        )}
      >
        {initialIsOffer ? <Tag className="h-4 w-4" /> : <span className="text-lg">+</span>}
        {initialIsOffer ? 'Agregar Oferta' : 'Agregar Servicio'}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={isOffer ? "Nueva Oferta Especial" : "Nuevo Servicio de Clínica"} size="2xl">
        <form action={formAction} className="space-y-8 py-2">
          <input type="hidden" name="is_published" value={isPublished.toString()} />
          <input type="hidden" name="is_offer" value={isOffer.toString()} />
          
          {state?.error && (
            <div className="p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-4">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Basic Info (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Servicio</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="Ej. Consulta General de Medicina" 
                    className="h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-slate-900/5 transition-all text-base font-bold px-6 placeholder:text-slate-300" 
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="specialty_id" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Especialidad Clínica</Label>
                  <div className="relative group">
                    <select 
                      id="specialty_id" 
                      name="specialty_id"
                      className="w-full h-14 rounded-2xl border border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-slate-900/5 transition-all text-base font-bold px-6 appearance-none cursor-pointer pr-12"
                    >
                      <option value="" className="text-slate-400">Seleccione una especialidad...</option>
                      {specialties.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 rotate-90 pointer-events-none group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="price" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio Base ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        step="0.01" 
                        required 
                        placeholder="0.00" 
                        className="h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-slate-900/5 transition-all text-base font-bold pl-12 pr-6 placeholder:text-slate-300" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="duration" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5" /> Duración (Min)
                    </Label>
                    <Input 
                      id="duration" 
                      name="duration" 
                      type="number" 
                      required 
                      placeholder="30" 
                      className="h-14 rounded-2xl border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-slate-900/5 transition-all text-base font-bold px-6 placeholder:text-slate-300" 
                    />
                  </div>
                </div>
              </div>

              {/* Offer Section */}
              <div className={cn(
                "p-8 rounded-[2.5rem] border transition-all duration-500",
                isOffer 
                  ? "bg-amber-50/50 border-amber-200/60 shadow-md shadow-amber-500/5" 
                  : "bg-white border-slate-200/60 shadow-sm"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl transition-colors shadow-sm",
                      isOffer ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <Label className={cn(
                        "text-[10px] font-black uppercase tracking-widest block",
                        isOffer ? "text-amber-700" : "text-slate-400"
                      )}>
                        ¿Es una Oferta Especial?
                      </Label>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tight mt-0.5">Destacar en la página principal</p>
                    </div>
                  </div>
                  <Switch checked={isOffer} onCheckedChange={setIsOffer} className="data-[state=checked]:bg-amber-500 scale-125" />
                </div>

                {isOffer && (
                  <div className="space-y-6 pt-6 animate-in fade-in slide-in-from-top-6 duration-500">
                    <div className="space-y-3">
                      <Label htmlFor="offer_price" className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">Precio Reducido ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                        <Input 
                          id="offer_price" 
                          name="offer_price" 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          className="h-14 rounded-2xl border-amber-200 bg-white focus:ring-4 focus:ring-amber-500/10 transition-all text-base font-bold pl-12 pr-6 text-amber-700 placeholder:text-amber-200 shadow-sm" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="offer_description" className="text-[10px] font-black text-amber-600 uppercase tracking-widest ml-1">Mensaje Promocional</Label>
                      <Input 
                        id="offer_description" 
                        name="offer_description" 
                        placeholder="Ej. ¡20% DESCUENTO SOLO ESTE MES!" 
                        className="h-14 rounded-2xl border-amber-200 bg-white focus:ring-4 focus:ring-amber-500/10 transition-all text-[11px] font-black uppercase tracking-widest px-6 text-amber-700 placeholder:text-amber-200 shadow-sm" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Visuals & Description (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="description" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción del Servicio</Label>
                <textarea 
                  id="description" 
                  name="description" 
                  placeholder="Detalles técnicos y beneficios del servicio para el paciente..." 
                  className="w-full h-[180px] rounded-[2.5rem] border-slate-200 bg-white shadow-sm focus:ring-4 focus:ring-slate-900/5 transition-all text-base font-bold p-8 resize-none placeholder:text-slate-300 leading-relaxed" 
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="image_url" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ImageIcon className="h-3.5 w-3.5" /> URL de Imagen Ilustrativa
                  </Label>
                  <Input 
                    id="image_url" 
                    name="image_url" 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..." 
                    className="h-14 rounded-2xl border-slate-200 bg-white shadow-sm text-[11px] font-mono px-6 placeholder:text-slate-300" 
                  />
                </div>

                <div className="aspect-[4/3] w-full rounded-[3rem] border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden relative group transition-all hover:border-slate-300 hover:bg-slate-100/50 shadow-inner">
                  {imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      onError={() => setImageUrl('')} 
                    />
                  ) : (
                    <div className="text-center group-hover:opacity-60 transition-opacity">
                      <ImageIcon className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em]">Vista Previa</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-900/30 mt-6 border border-white/5">
            <div className="flex items-center gap-4 pl-4">
              <div className={cn(
                "p-3 rounded-2xl transition-all duration-300",
                isPublished ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white/10 text-white/20"
              )}>
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <Label className="text-[11px] font-black text-white uppercase tracking-widest block">Visibilidad Pública</Label>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-70">
                  {isPublished ? 'Visible en el portal de reservas' : 'Oculto para pacientes'}
                </p>
              </div>
            </div>
            <Switch 
              checked={isPublished} 
              onCheckedChange={setIsPublished}
              className="data-[state=checked]:bg-emerald-500 scale-125 mr-4"
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100/50">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsOpen(false)} 
              className="h-16 px-10 rounded-2xl text-slate-400 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-slate-50 transition-all"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isPending} 
              className={cn(
                "h-16 px-14 rounded-3xl font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl transition-all min-w-[280px]",
                isOffer 
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30" 
                  : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/30"
              )}
            >
              {isPending ? (
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 animate-spin" />
                  <span>Procesando...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5" />
                  <span>{isOffer ? 'Publicar Oferta' : 'Crear Servicio'}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}



