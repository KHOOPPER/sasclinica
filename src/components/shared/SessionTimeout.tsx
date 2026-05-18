'use client'

import { useEffect, useRef } from 'react'
import { signOut } from '@/app/auth/actions'

const INACTIVITY_LIMIT = 30 * 60 * 1000 // 30 minutos en milisegundos

export function SessionTimeout() {
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      console.log('Sesión expirada por inactividad (30m)')
      await signOut()
    }, INACTIVITY_LIMIT)
  }

  useEffect(() => {
    // Eventos que reinician el contador de inactividad
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ]

    const handleActivity = () => resetTimer()

    // Inicializar timer
    resetTimer()

    // Agregar listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity)
    })

    // Limpieza
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [])

  return null // Este componente no renderiza nada visualmente
}
