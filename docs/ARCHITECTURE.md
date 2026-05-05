# Arquitectura del Sistema — SaaS Clínicas

> **Estado:** Producción activa. ~90% completo. Usar como referencia autoritativa.
> **Guía operativa:** ver `SKILL.md` en la raíz del proyecto.

---

## Visión General

Sistema SaaS multi-tenant para la gestión de clínicas médicas. Permite a múltiples clínicas operar de forma aislada sobre la misma plataforma, cada una con su propio sitio público, panel administrativo y datos.

```
┌─────────────────────────────────────────────────────┐
│                   INTERNET                          │
└───────────────────────┬─────────────────────────────┘
                        │
                   Vercel CDN
                        │
          ┌─────────────┴─────────────┐
          │       Next.js 16          │
          │      (App Router)         │
          └─────────────┬─────────────┘
                        │
          ┌─────────────┴─────────────┐
          │      Supabase             │
          │  ┌─────────┬──────────┐   │
          │  │  Auth   │ Postgres │   │
          │  │ (JWT)   │ + RLS    │   │
          │  └─────────┴──────────┘   │
          └───────────────────────────┘
```

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.1 |
| Lenguaje | TypeScript | strict |
| Base de datos | Supabase (PostgreSQL) | local + cloud |
| Autenticación | Supabase Auth (JWT + cookies) | — |
| Estilos | Tailwind CSS | v4 |
| Componentes UI | shadcn/ui (adaptado) | — |
| Notificaciones | sonner (toasts) | — |
| Fechas | date-fns | — |
| Íconos | lucide-react | — |
| Despliegue | Vercel | — |

---

## Módulos Principales

### 1. Landing Pública por Clínica (`/[slug]`)

El sitio público de cada clínica, accesible desde su URL personalizada (ej: `/clinica-salud-total`).

**Componentes:**
- `LandingHeader.tsx` — Navbar con logo, links y CTA
- `LandingHero.tsx` — Sección principal con imagen y CTA
- `LandingAbout.tsx` — Sección "Acerca de"
- `LandingServices.tsx` — Catálogo de servicios
- `LandingSpecialties.tsx` — Especialidades médicas
- `LandingPromotions.tsx` — Promociones activas
- `LandingTestimonials.tsx` — Testimonios
- `LandingContact.tsx` — Mapa, dirección, teléfono
- `LandingFooter.tsx` — Pie de página con links y horarios
- `BookingPortal.tsx` — Modal de reserva integrada

**Funcionalidad:** Toda la configuración visual viene de `public_clinic_settings`. Las secciones activas son controlables desde el Builder Pro.

---

### 2. Portal de Reservas Público (`/reserva/[slug]`)

Versión alternativa del portal de reservas (ruta legacy). Mantiene compatibilidad pero el flujo principal está integrado en `[slug]/BookingPortal.tsx`.

---

### 3. Panel Superadmin (`/superadmin`)

Control global de la plataforma. Solo accesible para usuarios con `role = 'superadmin'`.

**Funcionalidades:**
- Ver, crear, editar y eliminar tenants (clínicas)
- Crear administradores para cada tenanting
- Builder Pro visual por clínica (`/superadmin/sitios/[clinicId]`)
- Configuración operativa de cada clínica (`/superadmin/configuracion/[clinicId]`)

**Archivos clave:**
- `actions.ts` — Server Actions del panel (CRUD completo de tenants)
- `createAdminAction.ts` — Creación de usuarios admin por tenant
- `sitios/[clinicId]/WebsiteVisualEditor.tsx` — Iframe de preview del sitio
- `sitios/[clinicId]/EditorSidebar.tsx` — Panel de controles del Builder Pro (~78KB)

---

### 4. Panel Admin de Clínica (`/admin`)

Panel operativo para el administrador de cada clínica. El acceso se controla por `tenant_id` — cada admin solo ve los datos de su propia clínica.

**Submódulos:**
| Ruta | Descripción |
|---|---|
| `/admin` | Dashboard con métricas y gráficos |
| `/admin/reservas` | Gestión completa de citas |
| `/admin/pacientes` | Listado y fichas de pacientes |
| `/admin/servicios` | Catálogo de servicios ofrecidos |
| `/admin/trabajadores` | Gestión de staff (create, update, delete) |
| `/admin/perfil` | Perfil del usuario autenticado |
| `/admin/sitio` | Editor básico del sitio público |
| `/admin/sitio/builder` | Builder Pro (mismo componente que el superadmin) |

---

### 5. Sistema de Auth y Middleware

**Archivo:** `src/proxy.ts` → llama a `src/lib/supabase/middleware.ts`

El middleware (`updateSession`) se ejecuta en **cada request** y:
1. Refresca el token de sesión (cookie).
2. Si la ruta está protegida (`/admin`, `/superadmin`, `/staff`) y no hay sesión → redirige a `/login`.
3. Si hay sesión y se intenta acceder a `/login` → redirige al panel correspondiente según rol.
4. Verifica que el rol tenga acceso a la ruta que solicita.

---

## Flujo de Autenticación

```
Usuario → POST /login (email + password)
        ↓
  supabase.auth.signInWithPassword()
        ↓
  Leer profiles.role del usuario
        ↓
  role = 'superadmin'  → redirect /superadmin
  role = 'admin'       → redirect /admin
  role = 'doctor'      → redirect /admin
  role = 'receptionist'→ redirect /admin
        ↓
  Middleware (proxy.ts) verifica en CADA request:
  - ¿Hay sesión? No → /login
  - ¿El rol tiene acceso a esta ruta? No → redirige al panel correcto
```

> **Nota importante:** `login/actions.ts` usa `createAdminClient()` (service_role) para leer el perfil durante el login, porque el usuario aún no tiene sesión activa cuando se valida el rol.

---

## Estructura de Carpetas

```
saas-clinicas/
├── docs/                    ← Documentación técnica (este directorio)
├── scripts/                 ← Scripts de utilidad para entorno local
│   ├── restore-builder.sql  ← Restaura columnas del Builder Pro
│   ├── seed-admin.sql       ← Seed de usuario superadmin
│   ├── seed-data.sql        ← Seed de datos iniciales
│   └── create-superadmin.mjs← Script Node.js para crear superadmin
├── src/
│   ├── app/
│   │   ├── [slug]/          ← Landing pública por clínica
│   │   ├── reserva/[slug]/  ← Portal de reservas (legacy)
│   │   ├── admin/           ← Panel del administrador
│   │   ├── superadmin/      ← Panel del superadmin
│   │   ├── login/           ← Página y acción de login
│   │   ├── auth/            ← Callback OAuth (si aplica)
│   │   └── api/             ← API routes (mínimas)
│   ├── components/
│   │   ├── ui/              ← Componentes base (Button, Input, Modal, etc.)
│   │   ├── shared/          ← Sidebar, Header (usados en admin + superadmin)
│   │   └── editor/          ← (reservado, actualmente vacío)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts    ← Cliente server-side (usa cookies de sesión)
│   │   │   ├── client.ts    ← Cliente browser (anon key)
│   │   │   ├── admin.ts     ← Cliente service_role (solo server)
│   │   │   └── middleware.ts← Lógica de updateSession
│   │   └── utils.ts         ← Helpers (cn, etc.)
│   ├── features/            ← (reservado, no implementado)
│   ├── hooks/               ← React hooks personalizados
│   ├── types/               ← Tipos TypeScript compartidos
│   ├── config/              ← Constantes y configuración
│   └── proxy.ts             ← Entry point del middleware (Next.js 16)
├── supabase/
│   ├── migrations/          ← 54 migraciones SQL en orden cronológico
│   ├── seed.sql             ← Seed base (no usar en producción sin revisión)
│   └── config.toml          ← Configuración de Supabase local
├── SKILL.md                 ← Guía operativa del proyecto
├── README.md                ← Introducción técnica
└── next.config.ts           ← Configuración de Next.js + security headers
```

---

## Clientes de Supabase — Regla de Uso

| Cliente | Archivo | Cuándo usar |
|---|---|---|
| `createClient()` | `lib/supabase/server.ts` | Todas las Server Actions y pages. Respeta RLS. |
| `createClient()` | `lib/supabase/client.ts` | Componentes cliente (`'use client'`). Respeta RLS. |
| `createAdminClient()` | `lib/supabase/admin.ts` | Solo cuando se necesita bypassear RLS en el servidor. Requiere auth guard previo. |

> ⚠️ **Regla crítica:** Nunca importar `admin.ts` en un componente cliente o en código que se ejecute en el browser.

---

## Roles del Sistema

| Rol | Panel | Puede crear usuarios | Acceso cross-tenant |
|---|---|---|---|
| `superadmin` | `/superadmin` + `/admin` | Sí (admins) | Sí (todos los tenants) |
| `admin` | `/admin` | Sí (staff) | No (solo su tenant) |
| `doctor` | `/admin` | No | No |
| `receptionist` | `/admin` | No | No |
| `staff` | `/staff` (o `/admin`) | No | No |

### Menú del Panel Admin por Rol

| Sección | admin | receptionist | doctor | staff |
|---|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Trabajadores | ✅ | ❌ | ❌ | ❌ |
| Servicios | ✅ | ✅ | ❌ | ❌ |
| Reservas | ✅ | ✅ | ✅ | ✅ |
| Pacientes | ✅ | ✅ | ✅ | ✅ |

---

## Decisiones Técnicas Relevantes

### 1. `proxy.ts` en lugar de `middleware.ts`
Next.js 16 cambió el nombre del entry point del middleware de `middleware.ts` a `proxy.ts`. El archivo antiguo (`middleware.ts`) se eliminó para evitar conflictos. La lógica de sesión está en `src/lib/supabase/middleware.ts` y es llamada desde `proxy.ts`.

### 2. Uso de `service_role` en Server Actions de creación de staff
Crear un usuario en Supabase Auth requiere `auth.admin.createUser()`, que solo está disponible con la `service_role key`. Este uso está justificado y está protegido: siempre se verifica que el llamante sea un admin autenticado antes de usar el cliente admin.

### 3. Builder Pro como componente compartido
`WebsiteVisualEditor` y `EditorSidebar` son usados tanto desde el panel del Superadmin (`/superadmin/sitios/[clinicId]`) como desde el panel del Admin (`/admin/sitio/builder`). Esto evita duplicación pero genera un componente muy grande (~78KB en `EditorSidebar.tsx`).

### 4. `public_clinic_settings` como tabla de configuración visual
En lugar de una tabla normalizada de settings clave-valor, se optó por columnas explícitas (~127 columnas) para toda la configuración visual del Builder Pro. Esta decisión facilita las queries pero genera migraciones frecuentes al agregar nuevas opciones de diseño.

### 5. Aislamiento de tenant via RLS
La separación de datos entre tenants se implementa al 100% mediante Row Level Security en Supabase. El frontend **nunca** es responsable del aislamiento de datos. Los guards de código son una segunda capa, no la principal.
