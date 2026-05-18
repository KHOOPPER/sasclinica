import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeSlug(text: string): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^\w\s-]/g, '')        // Elimina caracteres especiales excepto guiones y espacios (elimina puntos)
    .replace(/\s+/g, '-')           // Reemplaza espacios por guiones
    .replace(/-+/g, '-')            // Elimina guiones repetidos
    .trim()
}
