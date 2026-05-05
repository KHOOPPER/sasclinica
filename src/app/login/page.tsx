'use client'

import { useActionState, Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

function LoginForm() {
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')
  const message = searchParams.get('message')
  const [state, action, isPending] = useActionState(login, undefined)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Card className="shadow-lg border-zinc-200 bg-white">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center text-zinc-900">Bienvenido de nuevo</CardTitle>
        <CardDescription className="text-center text-zinc-500">
          Ingresa tus credenciales para acceder al sistema
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          {(urlError || state?.error) && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md font-medium">
              {state?.error || urlError}
            </div>
          )}
          {message && !state?.error && !urlError && (
            <div className="p-3 bg-green-50 text-green-700 text-sm rounded-md font-medium">
              {message}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-700">Correo electrónico</Label>
            <Input id="email" name="email" type="email" placeholder="admin@clinica.com" required className="border border-zinc-200 shadow-sm focus-visible:ring-zinc-900 focus-visible:border-zinc-900 transition-colors" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-700">Contraseña</Label>
            </div>
            <div className="relative">
              <Input 
                id="password" 
                name="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="********"
                required 
                className="pr-10 border border-zinc-200 shadow-sm focus-visible:ring-zinc-900 focus-visible:border-zinc-900 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-900 transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button 
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white h-12 rounded-xl font-bold transition-all shadow-lg hover:shadow-zinc-900/20" 
            type="submit" 
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Iniciando...
              </>
            ) : (
              'Iniciar'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white selection:bg-zinc-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md group cursor-default">
        <h2 className="text-center text-5xl font-black tracking-tighter text-zinc-900 transition-all duration-500 ease-out group-hover:scale-110 group-hover:tracking-widest">
          KCLINIC
        </h2>
        <p className="text-center text-xs text-zinc-400 font-medium mt-3 tracking-[0.3em] uppercase transition-all duration-500 group-hover:opacity-50">
          Gestión Médica Profesional
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Suspense fallback={<div className="text-center text-sm text-gray-500">Cargando formulario...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
