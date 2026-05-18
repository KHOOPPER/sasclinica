'use client'

import React, { useState } from 'react'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  url: string
  caption?: string
}

interface LandingGalleryProps {
  clinicData: any
}

export function LandingGallery({ clinicData }: LandingGalleryProps) {
  const images: GalleryImage[] = clinicData.gallery_images || []
  const variant = clinicData.gallery_variant || 'grid'
  const title = clinicData.gallery_title || 'Nuestras Instalaciones'
  const subtitle = clinicData.gallery_subtitle || 'Conoce nuestro espacio diseñado para tu comodidad'
  const primary = clinicData.primary_color || '#2563eb'

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

  if (!images.length) {
    return (
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-slate-400">Agrega imágenes a tu galería desde el editor.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 mb-12 text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] mb-3" style={{ color: primary }}>
          GALERÍA
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{title}</h2>
        <p className="text-slate-500 max-w-lg mx-auto">{subtitle}</p>
      </div>

      {/* ── GRID ── */}
      {variant === 'grid' && (
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.caption || `Imagen ${i + 1}`} className="w-full h-full object-cover transition-transform  group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100" />
                </div>
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-white text-xs font-medium">{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MASONRY ── */}
      {variant === 'masonry' && (
        <div className="max-w-6xl mx-auto px-6">
          <div className="columns-2 md:columns-3 gap-3 space-y-3">
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer mb-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.caption || `Imagen ${i + 1}`} className="w-full object-cover transition-transform  group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CAROUSEL ── */}
      {variant === 'carousel' && (
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[carouselIndex]?.url}
              alt={images[carouselIndex]?.caption || ''}
              className="w-full h-full object-cover transition-all "
            />
            {images[carouselIndex]?.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-medium">{images[carouselIndex].caption}</p>
              </div>
            )}
          </div>
          {/* Controls */}
          <button
            onClick={() => setCarouselIndex(i => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-slate-50 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setCarouselIndex(i => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-slate-50 transition-all"
          >
            <ChevronRight size={18} />
          </button>
          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCarouselIndex(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ backgroundColor: i === carouselIndex ? primary : '#cbd5e1' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── LIGHTBOX layout: big + thumbs ── */}
      {variant === 'lightbox' && (
        <div className="max-w-6xl mx-auto px-6 flex gap-4">
          {/* Big image */}
          <div
            onClick={() => setLightboxIndex(0)}
            className="group relative w-2/3 aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer shrink-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[0]?.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform " />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
              <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
            </div>
          </div>
          {/* Thumbs column */}
          <div className="flex-1 grid grid-rows-3 gap-3">
            {images.slice(1, 4).map((img, i) => (
              <div
                key={i}
                onClick={() => setLightboxIndex(i + 1)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform " />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all" />
                {i === 2 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xl font-black">+{images.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LIGHTBOX MODAL ── */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxIndex(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all">
            <X size={20} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i! - 1 + images.length) % images.length) }}
            className="absolute left-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="max-w-4xl max-h-[85vh]" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[lightboxIndex]?.url} alt="" className="max-w-full max-h-[85vh] object-contain rounded-2xl" />
            {images[lightboxIndex]?.caption && (
              <p className="text-white/70 text-sm text-center mt-3">{images[lightboxIndex].caption}</p>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i! + 1) % images.length) }}
            className="absolute right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  )
}
