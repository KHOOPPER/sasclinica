# Base de Datos — SaaS Clínicas

> Supabase (PostgreSQL) con Row Level Security activo en todas las tablas.

---

## Principios de la Base de Datos

1. **RLS es la primera línea de defensa.** El frontend nunca es responsable del aislamiento.
2. **Nunca modificar migraciones existentes.** Solo añadir nuevas.
3. **Toda entidad de negocio lleva `tenant_id`.** Sin excepción.
4. **`service_role` solo se usa en el servidor**, nunca en el cliente del browser.

---

## Tablas Principales

### `tenants`
Unidad de negocio raíz. Cada clínica cliente del SaaS es un tenant.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador único |
| `name` | TEXT | Nombre de la clínica |
| `slug` | TEXT UNIQUE | Identificador en URL (`/clinica-abc`) |
| `created_at` | TIMESTAMPTZ | Fecha de creación |

---

### `clinics`
Sede física de un tenant. Un tenant puede tener múltiples clínicas (solo una actualmente por el flujo de UI).

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador único |
| `tenant_id` | UUID FK | Referencia a `tenants` |
| `name` | TEXT | Nombre de la sede |
| `address` | TEXT | Dirección física |
| `phone` | TEXT | Teléfono de contacto |
| `logo_url` | TEXT | URL del logo |

---

### `profiles`
Extiende `auth.users` de Supabase con datos del negocio.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | = `auth.users.id` |
| `email` | TEXT | Email del usuario |
| `role` | `user_role` ENUM | `superadmin`, `admin`, `doctor`, `receptionist`, `staff` |
| `tenant_id` | UUID FK | Tenant al que pertenece |
| `first_name` | TEXT | Nombre |
| `last_name` | TEXT | Apellido |
| `phone` | TEXT | Teléfono |
| `image_url` | TEXT | Foto de perfil |
| `is_superadmin` | BOOLEAN | Flag explícito para superadmin (bypasses RLS checks) |

---

### `tenant_users`
Tabla de relación entre usuarios y tenants. Define qué rol tiene cada usuario en su tenant.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador único |
| `tenant_id` | UUID FK | Referencia a `tenants` |
| `user_id` | UUID FK | Referencia a `auth.users` |
| `role` | `user_role` ENUM | Rol operativo en el tenant |

---

### `staff_members`
Datos de los trabajadores de la clínica. Desnormalizado (`full_name`, `email`, `role`) para facilitar queries sin JOINs.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador único |
| `tenant_id` | UUID FK | Tenant al que pertenece |
| `clinic_id` | UUID FK | Sede a la que está asignado |
| `user_id` | UUID FK | Referencia a `auth.users` |
| `full_name` | TEXT | Nombre completo (desnormalizado) |
| `email` | TEXT | Email (desnormalizado) |
| `role` | TEXT | Rol (`doctor`, `receptionist`, etc.) |
| `specialty` | TEXT | Especialidad médica |
| `image_url` | TEXT | Foto |

---

### `patients`
Pacientes de la clínica. Separados por tenant.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador único |
| `tenant_id` | UUID FK | Tenant propietario del registro |
| `clinic_id` | UUID FK | Sede |
| `first_name` | TEXT | Nombre |
| `last_name` | TEXT | Apellido |
| `phone` | TEXT | Teléfono |
| `email` | TEXT | Email |
| `dui` | TEXT | Documento de identidad (El Salvador) |
| `assigned_doctor_id` | UUID FK | Doctor asignado (de `staff_members`) |

---

### `services`
Servicios ofrecidos por la clínica.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador único |
| `tenant_id` | UUID FK | Tenant propietario |
| `clinic_id` | UUID FK | Sede |
| `name` | TEXT | Nombre del servicio |
| `description` | TEXT | Descripción |
| `price` | NUMERIC | Precio |
| `duration_minutes` | INTEGER | Duración en minutos |
| `image_url` | TEXT | Imagen del servicio |
| `is_published` | BOOLEAN | Visible en el sitio público |
| `is_active` | BOOLEAN | Activo en el sistema |

---

### `appointments`
Citas del sistema. Acepta tanto citas creadas desde el panel admin como reservas desde el sitio público.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | Identificador único |
| `tenant_id` | UUID FK | Tenant |
| `clinic_id` | UUID FK | Sede |
| `patient_id` | UUID FK | Paciente (puede ser null en reserva pública) |
| `staff_id` | UUID FK | Doctor/Staff asignado |
| `service_id` | UUID FK | Servicio |
| `start_time` | TIMESTAMPTZ | Inicio de la cita |
| `end_time` | TIMESTAMPTZ | Fin de la cita |
| `status` | TEXT | `pending`, `confirmed`, `cancelled`, `completed` |
| `notes` | TEXT | Notas internas |
| `patient_name` | TEXT | Para reservas públicas (sin cuenta) |
| `patient_phone` | TEXT | Para reservas públicas |
| `patient_email` | TEXT | Para reservas públicas |
| `patient_dui` | TEXT | Documento de identidad (El Salvador) |
| `notified` | BOOLEAN | Flag de notificación WhatsApp |

---

### `business_hours`
Horarios de atención por día de semana por clínica.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | — |
| `clinic_id` | UUID FK | Sede |
| `day_of_week` | INTEGER | 0=Domingo, 1=Lunes, ..., 6=Sábado |
| `open_time` | TIME | Hora de apertura (`HH:MM:SS`) |
| `close_time` | TIME | Hora de cierre |
| `is_closed` | BOOLEAN | True si está cerrado ese día |

---

### `public_clinic_settings`
Tabla de configuración visual completa del Builder Pro. ~127 columnas.

**Columnas clave:**

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID PK | — |
| `tenant_id` | UUID FK | Tenant propietario |
| `clinic_id` | UUID FK | Sede |
| `slug` | TEXT UNIQUE | URL del sitio público |
| `is_active` | BOOLEAN | Si el sitio público está activo |
| `primary_color` | TEXT | Color principal (hex) |
| `bg_main` | TEXT | Fondo principal |
| `header_variant` | TEXT | Variante de header (`classic`, `centered`, etc.) |
| `hero_variant` | TEXT | Variante de hero |
| `footer_variant` | TEXT | Variante de footer |
| `active_sections` | JSONB | Array de secciones activas en orden |
| `promotions_data` | JSONB | Array de objetos con ofertas |
| `testimonials_data` | JSONB | Array de objetos con testimonios |
| `specialties` | JSONB | Array de especialidades |
| ... | ... | ~100 columnas más de diseño |

---

## Historial de Migraciones

| Rango de fechas | Área |
|---|---|
| `20260323` | Schema base: tenants, clinics, profiles, RLS core |
| `20260324` | Servicios, staff, pacientes, citas, pagos, reserva pública, Builder Pro base |
| `20260325` | Superadmin, acceso cross-tenant, defaults de settings |
| `20260328` | Campos VElite para el Builder Pro |
| `20260331` | Tokens de diseño: navbar, about, promos, testimonials |
| `20260401` | Active sections, footer expandido, RLS admin settings, contacto |

**Total: 54 migraciones**

---

## Row Level Security — Resumen de Políticas

| Tabla | Política | Rol |
|---|---|---|
| `profiles` | Leer solo el propio perfil | Autenticado |
| `profiles` | Admins pueden ver perfiles de su tenant | Admin |
| `tenant_users` | Ver solo propio registro | Autenticado |
| `tenant_users` | Superadmin ve todos | Superadmin |
| `tenants` | Ver el propio tenant | Admin/Staff del tenant |
| `tenants` | Ver todos | Superadmin |
| `clinics` | Ver clínicas del propio tenant | Autenticado (tenant) |
| `clinics` | Ver todas | Público (read-only) |
| `services` | Ver servicios del tenant | Autenticado (tenant) |
| `services` | Admin gestiona servicios | Admin del tenant |
| `services` | Ver publicados | Público (read-only) |
| `staff_members` | Admin gestiona staff | Admin del tenant |
| `staff_members` | Ver colegas | Staff del tenant |
| `patients` | Ver/gestionar pacientes | Staff + Admin del tenant |
| `appointments` | Ver citas del tenant | Autenticado del tenant |
| `appointments` | Admin/Staff gestionan | Staff + Admin del tenant |
| `appointments` | Insertar públicamente | Anon (reserva pública) ⚠️ |
| `public_clinic_settings` | Leer si `is_active = true` | Público (read-only) |
| `public_clinic_settings` | Gestionar superadmin | Superadmin |
| `public_clinic_settings` | Gestionar admin | Admin del tenant |

> ⚠️ **Riesgo pendiente H7:** La política de insert público en `appointments` tiene `WITH CHECK (true)` — ver `supabase/migrations/20260401_security_notes.md`.

---

## Acceso Rápido a Supabase Local

```bash
# Studio: http://localhost:54323
# API: http://localhost:54321
# Inbucket (emails): http://localhost:54324

# Iniciar
npx supabase start

# Aplicar nueva migración
npx supabase migration up

# Ver estado de migraciones
npx supabase migration list
```
