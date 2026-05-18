# Checklist de Mantenimiento — SaaS Clínicas

> Basado en la guía operativa `SKILL.md`. Usar antes de cualquier sesión de trabajo.

---

## Pre-sesión (antes de tocar código)

- [ ] Leer `SKILL.md` para recordar reglas operativas
- [ ] Verificar que el servidor de desarrollo corre sin errores (`npm run dev`)
- [ ] Verificar que Supabase local está activo (`npx supabase status`)
- [ ] Tener abierto Supabase Studio en `http://localhost:54323`
- [ ] Hacer un `git pull` para asegurarse de estar en la rama más reciente
- [ ] Revisar si hay PRs abiertos o ramas sin merge

---

## Antes de Hacer Cualquier Cambio

- [ ] Identificar exactamente qué archivo/función se va a tocar
- [ ] Entender qué usa esa función (quién la llama)
- [ ] Verificar que el cambio no afecta rutas públicas ni flujo de negocio crítico
- [ ] Si el cambio toca la BD: crear una nueva migración, **nunca editar las existentes**
- [ ] Si el cambio toca auth: verificar las tres capas (middleware + Server Action + RLS)

---

## Checklist de Seguridad por Server Action

Antes de declarar una Server Action como completa:

- [ ] ¿Tiene `'use server'` al inicio del archivo?
- [ ] ¿Verifica autenticación con `supabase.auth.getUser()` antes de operar?
- [ ] ¿Verifica el rol del usuario si la operación es privilegiada?
- [ ] ¿Si usa `createAdminClient()`, tiene guard de auth antes de llamarlo?
- [ ] ¿No expone datos del error interno al cliente? (usar mensajes genéricos)
- [ ] ¿No loguea PII (email, nombre, DUI) en `console.log` o `console.error`?
- [ ] ¿Llama a `revalidatePath()` para invalidar caché si modifica datos?

---

## Checklist de Nueva Migración

- [ ] Nombre sigue el formato: `YYYYMMDDHHmmss_descripcion.sql`
- [ ] Usa `IF NOT EXISTS` o `IF EXISTS` en todos los `CREATE`/`DROP`/`ALTER`
- [ ] Incluye `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` si es tabla nueva
- [ ] Incluye al menos una política de acceso si es tabla nueva
- [ ] Tiene comentario descriptivo al inicio del archivo
- [ ] Fue probada en local (`npx supabase migration up`) antes de push
- [ ] No elimina columnas existentes con datos (usar deprecación antes de eliminar)

---

## Checklist de Componente Nuevo

- [ ] ¿Va en `components/ui/` (genérico) o en el módulo correspondiente?
- [ ] ¿Usa los tokens de diseño existentes (CSS variables del Builder Pro)?
- [ ] ¿No importa `service_role` ni `admin.ts`?
- [ ] ¿Si es `'use client'`: no tiene lógica de BD directa?
- [ ] ¿Tiene `id` únicos en elementos interactivos (inputs, buttons)?

---

## Checklist de Despliegue (Vercel)

- [ ] Las variables de entorno están configuradas en Vercel Dashboard
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (solo en entorno servidor)
- [ ] Las migraciones se aplicaron en la BD de producción
- [ ] El build local pasa sin errores (`npm run build`)
- [ ] No hay `console.log` de debug activos en producción
- [ ] No hay rutas de debug expuestas (`/api/debug-*`, `/setup`, `/test`)

---

## Verificación Post-Cambio

- [ ] El servidor de desarrollo no muestra errores de TypeScript en consola
- [ ] El flujo de login funciona para `admin@clinica.com`
- [ ] El Builder Pro carga y guarda configuración correctamente
- [ ] Las reservas públicas siguen funcionando
- [ ] El panel de admin muestra datos del tenant correcto

---

## Riesgos Pendientes (a fecha 2026-04-01)

| # | Descripción | Prioridad | Documento |
|---|---|---|---|
| H7 | RLS de insert público en appointments demasiado permisivo | Media | `docs/SECURITY.md` |
| H8 | `updateWebsiteSettings` no verifica tenant ownership | Alta | `docs/SECURITY.md` |
| H2 | `deleteAppointment` sin guard de rol explícito | Baja | `docs/SECURITY.md` |

---

## Deuda Técnica Conocida

| Área | Descripción | Impacto |
|---|---|---|
| `EditorSidebar.tsx` | Archivo de ~78KB con toda la lógica del Builder Pro en un componente | Mantenibilidad |
| Duplicación `createAdminClient` | ~20 archivos instancian el cliente admin directamente en lugar de usar la función centralizada | Mantenibilidad |
| `src/features/` vacío | La carpeta de lógica de dominio nunca fue implementada | Organización |
| Migraciones frecuentes en `public_clinic_settings` | La tabla tiene ~127 columnas por el diseño del Builder Pro | Evolución del esquema |
| `getClinicBySlug` usa service_role | Puede usar anon key + política pública existente | Innecesario |

---

## Entorno Local — Referencia Rápida

```bash
# Iniciar base de datos
npx supabase start

# Iniciar dev server
npm run dev

# Aplicar migraciones pendientes
npx supabase migration up

# Ver estado de migraciones
npx supabase migration list

# Resetear base de datos local (DESTRUCTIVO)
npx supabase db reset

# Generar tipos TypeScript desde el esquema
npx supabase gen types typescript --local > src/types/supabase.ts
```

### Credenciales Locales
- **Email:** `admin@clinica.com`
- **Password:** `password123`
- **Rol:** `admin`

### URLs Locales
- **App:** `http://localhost:3000`
- **Supabase Studio:** `http://localhost:54323`
- **Supabase API:** `http://localhost:54321`
- **Inbucket (emails):** `http://localhost:54324`
