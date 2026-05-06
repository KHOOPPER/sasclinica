'use client'

import { useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface PrescriptionData {
  // Clinic
  clinicName: string
  clinicAddress?: string
  clinicPhone?: string
  clinicLogoUrl?: string
  // Patient
  patientName: string
  patientDui: string
  patientBirthDate?: string
  patientAlergias?: string
  // Record
  recordDate: string
  tratamiento: string
  // Doctor
  doctorName: string
}

function calcAge(birthDate?: string): string {
  if (!birthDate) return '—'
  const diff = Date.now() - new Date(birthDate).getTime()
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
  return `${age} años`
}

async function generatePrescriptionPDF(data: PrescriptionData) {
  // Dynamically import to avoid SSR issues
  const { jsPDF } = await import('jspdf')
  
  const doc = new jsPDF({ format: 'a4', unit: 'mm' })
  const pageW = 210
  const pageH = 297
  const marginX = 20
  const contentW = pageW - marginX * 2

  // ─── COLORS ─────────────────────────────────────────────
  const blue = [37, 99, 235] as [number, number, number]
  const lightBlue = [219, 234, 254] as [number, number, number]
  const darkGray = [31, 41, 55] as [number, number, number]
  const medGray = [107, 114, 128] as [number, number, number]
  const green = [21, 128, 61] as [number, number, number]
  const lightGreen = [220, 252, 231] as [number, number, number]
  const red = [185, 28, 28] as [number, number, number]
  const lightRed = [254, 226, 226] as [number, number, number]

  // ─── HEADER (CLEAN & MODERN) ───────────────────────────
  // White background, logo on left, info on right
  
  let headerY = 15
  let logoW = 0

  // Logo (Proportional scaling)
  if (data.clinicLogoUrl) {
    try {
      // PROCESADOR DE IMAGEN INFALIBLE (HTML5 Canvas)
      const processedDataUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        
        img.onload = () => {
          try {
            // Creamos un lienzo virtual para que el navegador decodifique la imagen de forma nativa
            const canvas = document.createElement('canvas')
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext('2d')
            if (!ctx) throw new Error('No se pudo crear el contexto 2D')
            
            // Dibujamos la imagen (limpia cualquier error de formato)
            ctx.drawImage(img, 0, 0)
            
            // Exportamos a un formato universal garantizado para jsPDF
            const safeBase64 = canvas.toDataURL('image/png')
            resolve(safeBase64)
          } catch (e) {
            reject(e)
          }
        }
        
        img.onerror = () => {
          reject(new Error('El navegador no pudo cargar la imagen para procesarla'))
        }

        // Si es un enlace externo (Cloudinary), aplicamos rompe-caché
        if (!data.clinicLogoUrl!.startsWith('data:')) {
          img.src = data.clinicLogoUrl + (data.clinicLogoUrl!.includes('?') ? '&' : '?') + 'nocache=' + Date.now()
        } else {
          // Si ya es Base64 (subido por el usuario), lo cargamos directo
          img.src = data.clinicLogoUrl!
        }
      })

      const props = doc.getImageProperties(processedDataUrl)
      const ratio = props.width / props.height
      const maxW = 35
      const maxH = 22
      
      logoW = maxW
      let imgH = logoW / ratio
      
      if (imgH > maxH) {
        imgH = maxH
        logoW = imgH * ratio
      }
      
      doc.addImage(processedDataUrl, 'PNG', marginX, headerY, logoW, imgH)
    } catch (error: any) { 
      console.error('Prescription Logo Load Error:', error)
      toast.error(`No se pudo dibujar el logo en el PDF: ${error.message || 'Formato no soportado'}`)
    }
  }

  // Clinic Info (Right aligned to the logo or left)
  const infoX = logoW > 0 ? marginX + logoW + 8 : marginX
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(...blue)
  doc.text(data.clinicName.toUpperCase(), infoX, headerY + 7)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...medGray)
  const address = data.clinicAddress || 'Dirección no registrada'
  const phone = data.clinicPhone ? `Tel: ${data.clinicPhone}` : ''
  doc.text(address, infoX, headerY + 12, { maxWidth: contentW - logoW - 10 })
  if (phone) doc.text(phone, infoX, headerY + 16)

  // Decorative line
  doc.setDrawColor(...lightBlue)
  doc.setLineWidth(0.5)
  doc.line(marginX, headerY + 25, marginX + contentW, headerY + 25)

  // Subtitle
  doc.setFontSize(7)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...medGray)
  doc.text('DOCUMENTO MÉDICO OFICIAL — RECETA DE TRATAMIENTO', marginX + contentW, headerY + 29, { align: 'right' })

  // ─── PRESCRIPTION TITLE ─────────────────────────────────
  let y = 50
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(marginX, y, contentW, 10, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...blue)
  doc.text('RECETA MÉDICA', pageW / 2, y + 6.5, { align: 'center' })

  // ─── PATIENT INFO SECTION ────────────────────────────────
  y = 72

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...medGray)
  doc.text('INFORMACIÓN DEL PACIENTE', marginX, y)

  doc.setDrawColor(...lightBlue)
  doc.setLineWidth(0.2)
  doc.line(marginX, y + 1.5, marginX + contentW, y + 1.5)

  y += 8

  const col2 = marginX + contentW / 2
  const pairs: [string, string][] = [
    ['Paciente:', data.patientName.toUpperCase()],
    ['Identificación (DUI):', data.patientDui],
    ['Edad:', calcAge(data.patientBirthDate)],
    ['Fecha de Emisión:', new Date(data.recordDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })],
  ]

  pairs.forEach(([label, value], i) => {
    const col = i % 2 === 0 ? marginX : col2
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...medGray)
    doc.text(label, col, y)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...darkGray)
    doc.text(value, col + 32, y)
    if (i % 2 === 1) y += 8
  })
  y += 2

  // Allergies (Clean look, no red)
  if (data.patientAlergias) {
    const allergyText = data.patientAlergias.toUpperCase() === 'NINGUNA' ? 'NINGUNA REPORTADA' : data.patientAlergias
    const isNone = allergyText.includes('NINGUNA')
    const allergyBg = (isNone ? [248, 250, 252] : [236, 253, 245]) as [number, number, number]
    const allergyTextCol = (isNone ? medGray : green) as [number, number, number]

    doc.setFillColor(...allergyBg)
    doc.roundedRect(marginX, y, contentW, 9, 1.5, 1.5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...allergyTextCol)
    doc.text('ALERGIAS:', marginX + 4, y + 6)
    doc.setFont('helvetica', 'bold')
    doc.text(allergyText, marginX + 22, y + 6)
    y += 16
  } else {
    y += 6
  }

  // ─── TREATMENT CONTENT ──────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...medGray)
  doc.text('INDICACIONES Y TRATAMIENTO', marginX, y)
  doc.line(marginX, y + 1.5, marginX + contentW, y + 1.5)
  y += 8

  const lines = doc.splitTextToSize(data.tratamiento || 'Sin indicaciones registradas.', contentW - 10)
  const blockH = Math.max(lines.length * 6 + 10, 80) // More space for treatment
  
  doc.setFillColor(255, 255, 255)
  doc.setDrawColor(...lightBlue)
  doc.roundedRect(marginX, y, contentW, blockH, 2, 2, 'D')
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(...darkGray)
  doc.text(lines, marginX + 5, y + 9)
  
  y += blockH + 30

  // ─── FOOTER VALIDATION (Signatures) ────────────────────
  const footerY = pageH - 65
  const colW = contentW / 2 - 15

  // Signature line
  doc.setDrawColor(...medGray)
  doc.setLineWidth(0.4)
  doc.line(marginX + 5, footerY, marginX + colW + 5, footerY)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...darkGray)
  doc.text(data.doctorName.toUpperCase(), marginX + 5 + colW / 2, footerY + 6, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...medGray)
  doc.text('FIRMA DEL MÉDICO RESPONSABLE', marginX + 5 + colW / 2, footerY + 10, { align: 'center' })

  // Stamp line
  const stampX = marginX + contentW / 2 + 10
  doc.line(stampX + 5, footerY, stampX + colW + 5, footerY)
  doc.text('SELLO DE LA CLÍNICA', stampX + 5 + colW / 2, footerY + 10, { align: 'center' })

  // ─── FOOTER BAND ────────────────────────────────────────
  doc.setFillColor(...blue)
  doc.rect(0, pageH - 12, pageW, 12, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(255, 255, 255)
  doc.text(`Este documento es una receta médica oficial de ${data.clinicName}.`, pageW / 2, pageH - 7, { align: 'center' })
  doc.text(`Página 1 de 1 — Generado el ${new Date().toLocaleDateString('es-ES')}`, pageW / 2, pageH - 3.5, { align: 'center' })

  // ─── SAVE ────────────────────────────────────────────────
  const filename = `Receta_${data.patientName.replace(/\s/g, '_')}_${new Date(data.recordDate).toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}

interface Props {
  record: any
  patient: any
  clinic: { name: string; address?: string; phone?: string; logo_url?: string }
}

export function PrintPrescriptionButton({ record, patient, clinic }: Props) {
  const [loading, setLoading] = useState(false)

  const handlePrint = async () => {
    setLoading(true)
    try {
      await generatePrescriptionPDF({
        clinicName: clinic.name,
        clinicAddress: clinic.address,
        clinicPhone: clinic.phone,
        clinicLogoUrl: clinic.logo_url,
        patientName: `${patient.first_name} ${patient.last_name}`,
        patientDui: patient.dui,
        patientBirthDate: patient.fecha_nacimiento,
        patientAlergias: patient.alergias,
        recordDate: record.fecha_consulta,
        tratamiento: record.tratamiento_recetado || '',
        doctorName: record.doctor?.first_name 
          ? `Dr. ${record.doctor.first_name} ${record.doctor.last_name || ''}`.trim()
          : record.fallback_doctor_name || 'Médico Responsable',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handlePrint}
      disabled={loading}
      className="flex items-center gap-1.5 text-blue-700 border-blue-200 hover:bg-blue-50"
    >
      {loading
        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
        : <FileText className="h-3.5 w-3.5" />
      }
      {loading ? 'Generando…' : 'Imprimir Receta'}
    </Button>
  )
}
