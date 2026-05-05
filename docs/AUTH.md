# Auth y Permisos — SaaS Clínicas

---

## Visión General

El sistema combina tres capas de seguridad:

```
Layer 1: Supabase Auth (JWT)  → ¿Está autenticado el usuario?
Layer 2: Middleware / proxy.ts → ¿Tiene el rol correcto para esta ruta?
Layer 3: RLS en Supabase      → ¿Puede acceder a estos datos?
```

Ninguna capa reemplaza a las otras. Las tres deben estar activas y correctas.

---

## Flujo Completo de Autenticación

### Login (`/login`)

```
1. Usuario envía email + password
2. supabase.auth.signInWithPassword()
   → Si error: devuelve "Credenciales inválidas"
3. Con sesión activa, se lee profiles.role vía createAdminClient()
   → ¿Por qué admin client? Porque el usuario no tiene sesión activa aún
     y necesitamos bypasear RLS para leer el perfil inicial
4. Según role:
   - 'superadmin'                      → redirect /superadmin
   - 'admin'|'doctor'|'receptionist'   → redirect /admin
   - 'staff'                           → redirect /staff
   - otro                              → error "rol no válido"
5. La sesión se almacena en cookies HttpOnly gestionadas por Supabase SSR
```

### Validación en cada Request (Middleware)

**Archivo:** `src/proxy.ts` → `src/lib/supabase/middleware.ts`

```
1. Se ejecuta en CADA request (excepto assets estáticos)
2. supabase.auth.getUser() → refresca el token si está próximo a caducar
3. Si ruta protegida (/admin, /superadmin, /staff) y sin sesión → /login
4. Si sesión activa y ruta = /login → redirige al panel correspondiente
5. Si ruta /superadmin y role ≠ 'superadmin' → redirige a /admin o /login
6. Si ruta /admin y role no está en ['admin','superadmin','doctor','receptionist'] → /login
7. Pasa la URL completa en header 'x-url' para que layouts la lean
```

### Verificación en Server Actions

Cada Server Action sensible debe:
1. `supabase.auth.getUser()` — obtener usuario autenticado
2. Leer `tenant_users` o `profiles` para verificar el rol específico
3. Solo entonces operar con el cliente de usuario (respetando RLS) o el admin client

```typescript
// Patrón estándar en Server Actions
const supabase = await createClient()
const { data: authData } = await supabase.auth.getUser()
if (!authData.user) return { error: 'No autenticado' }

// Verificación de rol si la operación lo requiere
const { data: tenantUser } = await supabase
  .from('tenant_users')
  .select('tenant_id, role')
  .eq('user_id', authData.user.id)
  .single()

if (!tenantUser || tenantUser.role !== 'admin') {
  return { error: 'Permisos insuficientes' }
}
```

---

## Roles: Definición y Alcance

### `superadmin`
- Ruta: `/superadmin`
- Detectado por: `profiles.role = 'superadmin'` + `profiles.is_superadmin = true`
- Puede acceder a todos los tenants desde el panel superadmin
- Puede acceder a `/admin` de cualquier clínica pasando `?clinicId=xxx`
- Puede crear, editar y eliminar tenants y sus admins

### `admin`
- Ruta: `/admin`
- Alcance: Solo su propio `tenant_id`
- Puede crear y eliminar staff de su clínica
- Puede gestionar todos los módulos del panel
- Puede acceder al Builder Pro de su clínica

### `doctor`
- Ruta: `/admin`
- Alcance: Reservas y pacientes de su tenant
- No puede gestionar servicios, trabajadores ni configuración

### `receptionist`
- Ruta: `/admin`
- Alcance: Reservas y pacientes de su tenant
- Puede ver y gestionar servicios (solo lectura)

### `staff`
- Ruta: `/staff` (o `/admin` con acceso reducido)
- Alcance: Vista básica de agenda

---

## Superadmin Impersonando Admin

Para que un superadmin gestione una clínica específica, el sistema usa `?clinicId=` en la URL:

```
/admin?clinicId=<uuid-de-la-clinica>
```

El layout de `/admin` detecta si el usuario es superadmin y si existe `clinicId` en la URL (leída del header `x-url` que el middleware pasa). Si hay `clinicId`, usa el `service_role` para cargar los datos de esa clínica.

---

## Clientes de Supabase por Contexto

| Contexto | Cliente | Key usada | RLS |
|---|---|---|---|
| Server Action / Page (server) | `createClient()` de `server.ts` | anon | Sí |
| Componente browser | `createClient()` de `client.ts` | anon | Sí |
| Operaciones administrativas (server only) | `createAdminClient()` de `admin.ts` | service_role | **No** |
| Middleware | `createServerClient()` de `@supabase/ssr` | anon | Sí |

> **Regla crítica:** `createAdminClient()` importado en un componente `'use client'` expone la service_role key al browser. Esto está **estrictamente prohibido**.

---

## Variables de Entorno Requeridas

| Variable | Contexto | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | URL de la instancia de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Clave pública (anon). Visible en el browser. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo server** | Clave privada. Bypasea RLS. **Nunca en el browser.** |

> **Verificación:** `SUPABASE_SERVICE_ROLE_KEY` nunca debe aparecer en archivos que tengan `'use client'` al inicio.

---

## RLS — Funciones Auxiliares

El sistema usa RPC functions para simplificar los checks de permisos en políticas:

### `check_is_superadmin(user_id)`
Definida en la migración `20260323113500_add_superadmin.sql`. Verifica si un usuario tiene `is_superadmin = true` en `profiles`.

### Usada en:
- `admin/layout.tsx` para determinar si el usuario que accede al panel admin es superadmin (para el modo impersonation).

---

## Sesión y Tokens

- Los tokens JWT de Supabase duran **1 hora** por defecto.
- El middleware los refresca automáticamente antes de expirar.
- Las cookies son `HttpOnly` + `Secure` (gestionadas por `@supabase/ssr`).
- El logout destruye la sesión: `supabase.auth.signOut()`.

---

## Riesgos Pendientes de Auth

| # | Descripción | Documento de referencia |
|---|---|---|
| H7 | RLS de insert público en `appointments` con `WITH CHECK (true)` | `docs/SECURITY.md` |
| H8 | `updateWebsiteSettings` no verifica tenant ownership del `clinic_id` | `docs/SECURITY.md` |
| H2 | `deleteAppointment` no verifica rol (protegido por RLS) | `docs/SECURITY.md` |
