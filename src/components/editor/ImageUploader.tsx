'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Upload, X, Link2, Loader2, ImageIcon, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  bucket?: string          // Supabase bucket name (default: 'clinic-assets')
  folder?: string          // Sub-folder inside bucket (default: 'general')
  accept?: string
  hint?: string
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'free'
  maxSizeMB?: number
}

export function ImageUploader({
  value,
  onChange,
  label,
  bucket = 'clinic-assets',
  folder = 'general',
  accept = 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml',
  hint,
  aspectRatio = 'free',
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [urlInput, setUrlInput] = useState(value || '')
  const [error, setError] = useState<string | null>(null)

  const uploadFile = useCallback(async (file: File) => {
    setError(null)

    // Size check
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`El archivo supera el límite de ${maxSizeMB}MB`)
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: false, contentType: file.type })

      if (uploadErr) {
        // If bucket doesn't exist yet, show helpful message
        if (uploadErr.message.includes('Bucket not found')) {
          setError('Bucket "' + bucket + '" no existe en Supabase Storage. Créalo primero.')
        } else {
          setError(uploadErr.message)
        }
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      onChange(publicUrl)
    } catch (err: any) {
      setError(err.message || 'Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }, [bucket, folder, maxSizeMB, onChange])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files?.length) return
    uploadFile(files[0])
  }, [uploadFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
    }
  }

  const previewHeight = aspectRatio === 'square'    ? 'h-32' :
                        aspectRatio === 'landscape'  ? 'h-24' :
                        aspectRatio === 'portrait'   ? 'h-40' :
                        'h-28'

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-[9px] font-bold uppercase text-slate-500 tracking-widest">{label}</p>
      )}

      {/* Mode switcher */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setMode('upload')}
          className={cn(
            'flex-1 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all',
            mode === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
          )}
        >
          <Upload size={10} /> Subir
        </button>
        <button
          onClick={() => setMode('url')}
          className={cn(
            'flex-1 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all',
            mode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
          )}
        >
          <Link2 size={10} /> URL
        </button>
      </div>

      {/* Current preview */}
      {value && (
        <div className={cn('relative w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200', previewHeight)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
          <button
            onClick={() => { onChange(''); setUrlInput('') }}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all"
          >
            <X size={10} />
          </button>
        </div>
      )}

      {/* Upload zone */}
      {mode === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={cn(
            'w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-5 gap-2 cursor-pointer transition-all',
            dragOver ? 'border-slate-400 bg-slate-50 scale-[1.01]' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50',
            uploading && 'pointer-events-none opacity-60'
          )}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="animate-spin text-slate-400" />
              <p className="text-[9px] font-bold text-slate-400 uppercase">Subiendo...</p>
            </>
          ) : (
            <>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <ImageIcon size={16} className="text-slate-400" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-600">Arrastra o haz clic</p>
                <p className="text-[9px] text-slate-400">{hint || `PNG, JPG, WebP · max ${maxSizeMB}MB`}</p>
              </div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* URL input */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="flex-1 h-9 bg-slate-50 border-none rounded-lg px-3 text-[11px] outline-none focus:ring-1 focus:ring-slate-300"
          />
          <button
            onClick={handleUrlSubmit}
            className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-black transition-all shrink-0"
          >
            <Check size={13} />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-[9px] text-red-500 font-medium px-1">{error}</p>
      )}
    </div>
  )
}
