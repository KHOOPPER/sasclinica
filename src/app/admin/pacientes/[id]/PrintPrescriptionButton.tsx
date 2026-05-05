'use client'

import { useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

  // ─── HEADER BAND ────────────────────────────────────────
  doc.setFillColor(...blue)
  doc.rect(0, 0, pageW, 40, 'F')

  // Logo (Proportional scaling)
  let logoOffset = 0
  if (data.clinicLogoUrl) {
    try {
      const res = await fetch(data.clinicLogoUrl)
      const blob = await res.blob()
      const reader = new FileReader()
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
      
      const props = doc.getImageProperties(dataUrl)
      const ratio = props.width / props.height
      const maxW = 32
      const maxH = 28
      
      let imgW = maxW
      let imgH = imgW / ratio
      
      if (imgH > maxH) {
        imgH = maxH
        imgW = imgH * ratio
      }
      
      doc.addImage(dataUrl, 'PNG', marginX, 6 + (maxH - imgH) / 2, imgW, imgH)
      logoOffset = imgW + 6
    } catch (_) { /* no logo */ }
  }

  // Clinic name & info
  const textX = marginX + logoOffset
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(255, 255, 255)
  doc.text(data.clinicName, textX, 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(200, 220, 255)
  const contactLine = [data.clinicAddress, data.clinicPhone].filter(Boolean).join('  |  ')
  if (contactLine) doc.text(contactLine, textX, 26)
  doc.text('EXPEDIENTE CLÍNICO — RECETA MÉDICA', textX, 33)

  // ─── PRESCRIPTION TITLE ─────────────────────────────────
  doc.setFillColor(...lightBlue)
  doc.roundedRect(marginX, 48, contentW, 10, 2, 2, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...blue)
  doc.text('RECETA MÉDICA', pageW / 2, 55, { align: 'center' })

  // ─── PATIENT INFO SECTION ────────────────────────────────
  let y = 68

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...medGray)
  doc.text('DATOS DEL PACIENTE', marginX, y)

  doc.setDrawColor(...lightBlue)
  doc.setLineWidth(0.3)
  doc.line(marginX, y + 1.5, marginX + contentW, y + 1.5)

  y += 8

  const col2 = marginX + contentW / 2
  const pairs: [string, string][] = [
    ['Nombre Completo:', data.patientName],
    ['DUI:', data.patientDui],
    ['Edad:', calcAge(data.patientBirthDate)],
    ['Fecha de Consulta:', new Date(data.recordDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })],
  ]

  pairs.forEach(([label, value], i) => {
    const col = i % 2 === 0 ? marginX : col2
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(...medGray)
    doc.text(label, col, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...darkGray)
    doc.text(value, col + 38, y)
    if (i % 2 === 1) y += 8
  })
  y += 2

  // Allergies warning (Keep if present, very important for safety)
  if (data.patientAlergias) {
    doc.setFillColor(...lightRed)
    doc.roundedRect(marginX, y, contentW, 10, 1.5, 1.5, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...red)
    doc.text('⚠ ALERGIAS:', marginX + 4, y + 6.5)
    doc.setFont('helvetica', 'normal')
    doc.text(data.patientAlergias, marginX + 34, y + 6.5)
    y += 16
  } else {
    y += 6
  }

  // ─── TREATMENT CONTENT ──────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...medGray)
  doc.text('TRATAMIENTO Y MEDICACIÓN', marginX, y)
  doc.line(marginX, y + 1.5, marginX + contentW, y + 1.5)
  y += 8

  const lines = doc.splitTextToSize(data.tratamiento || 'Sin indicaciones registradas.', contentW - 10)
  const blockH = Math.max(lines.length * 6 + 10, 60) // At least 60mm for treatment space
  
  doc.setFillColor(249, 250, 251)
  doc.setDrawColor(229, 231, 235)
  doc.roundedRect(marginX, y, contentW, blockH, 2, 2, 'FD')
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  doc.setTextColor(...darkGray)
  doc.text(lines, marginX + 5, y + 8)
  
  y += blockH + 25

  // ─── FOOTER VALIDATION (Two Columns) ───────────────────
  // Position it near the bottom but above the blue band
  const footerY = pageH - 58
  const colW = contentW / 2 - 10

  // Left Column: Signature
  doc.setDrawColor(...medGray)
  doc.setLineWidth(0.4)
  ;(doc as any).setLineDash([], 0) // Solid line
  doc.line(marginX, footerY, marginX + colW, footerY)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...darkGray)
  doc.text(data.doctorName, marginX + colW / 2, footerY + 5, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...medGray)
  doc.text('Firma del Médico', marginX + colW / 2, footerY + 10, { align: 'center' })

  // Right Column: Stamp
  const stampX = marginX + contentW / 2 + 10
  const stampW = colW

  doc.setDrawColor(...medGray)
  doc.setLineWidth(0.4)
  ;(doc as any).setLineDash([], 0) // Solid line
  doc.line(stampX, footerY, stampX + stampW, footerY)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...medGray)
  doc.text('Sello del Médico', stampX + stampW / 2, footerY + 10, { align: 'center' })

  // ─── FOOTER ─────────────────────────────────────────────
  doc.setFillColor(...blue)
  doc.rect(0, pageH - 14, pageW, 14, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(255, 255, 255)
  doc.text(`Documento generado el ${new Date().toLocaleDateString('es-ES')} — Pág 1 de 1`, pageW / 2, pageH - 8, { align: 'center' })
  doc.text(data.clinicName, pageW / 2, pageH - 4, { align: 'center' })

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
