# Riesgos de Seguridad Pendientes

> Hallazgos identificados en la Fase 3 de Hardening (2026-04-01).
> Los que requieren plan previo o evaluación de impacto se documentan aquí.

---

## H7 — RLS de INSERT público en `appointments` demasiado permisivo

**Severidad:** 🟠 Media

**Migración de origen:** `20260324234500_public_booking_setup.sql`

**Política actual:**
```sql
CREATE POLICY "Allow public to create appointments"
ON public.appointments
FOR INSERT
TO public
WITH CHECK (true);
```

**Problema:**
`WITH CHECK (true)` permite a cualquier persona anónima insertar una cita con cualquier `tenant_id` o `clinic_id`, incluyendo los de otros tenants. El servidor Next.js construye y valida el payload antes de insertarlo, pero si alguien llama directamente a la API REST de Supabase (sin pasar por el Next.js), puede insertar datos cruzados.

**Riesgo real:**
Bajo-medio. Requiere conocimiento técnico de la API de Supabase y un esfuerzo deliberado. Los datos insertados inválidamente serían detectados en el panel admin por inconsistencias de clínica.

**Corrección propuesta:**
```sql
-- Nueva migración: reemplazar política de insert público
DROP POLICY IF EXISTS "Allow public to create appointments" ON public.appointments;

CREATE POLICY "Allow public to create appointments"
ON public.appointments
FOR INSERT
TO public
WITH CHECK (
  clinic_id IN (
    SELECT id FROM public.clinics
  )
  AND tenant_id IN (
    SELECT tenant_id FROM public.clinics WHERE id = clinic_id
  )
);
```

**Verificación previa necesaria:**
- Confirmar que la columna `is_active` existe en `clinics` si se quiere agregar ese filtro.
- Probar el flujo de reserva pública completo antes y después en entorno local.

**¿Requiere migración?** Sí. Nueva migración SQL.

---

## H8 — `updateWebsiteSettings` no verifica tenant ownership del `clinic_id`

**Severidad:** 🔴 Alta

**Archivo:** `src/app/superadmin/actions.ts`

**Problema:**
La función verifica que el usuario esté autenticado, pero no verifica que el `clinic_id` recibido en el payload le pertenezca. Un admin del Tenant A que conoce el UUID de la clínica del Tenant B podría llamar a esta Server Action y sobreescribir su configuración pública (colores, textos, estructura del sitio).

**Riesgo real:**
Medio. Requiere ser un usuario autenticado con sesión activa y conocer el UUID exacto de otra clínica. No es accidentalmente explotable, pero es un defecto de aislamiento en un sistema multi-tenant.

**Complejidad de la corrección:**
Alta. La misma función es usada por:
1. **Superadmin:** Debe poder editar cualquier clínica. → No verificar ownership.
2. **Admin:** Solo debe poder editar su propia clínica. → Verificar que `clinic_id` pertenezca a su `tenant_id`.

La corrección requiere determinar si el usuario es superadmin dentro de la función:

```typescript
// Pseudocódigo de la corrección propuesta
const { data: profile } = await supabase.from('profiles')
  .select('is_superadmin, tenant_id').eq('id', authData.user.id).single()

if (!profile?.is_superadmin) {
  // Verify clinic_id belongs to user's tenant
  const { data: clinic } = await supabase.from('clinics')
    .select('tenant_id').eq('id', clinic_id).single()

  if (clinic?.tenant_id !== profile?.tenant_id) {
    return { success: false, error: 'No tienes permisos para editar esta clínica' }
  }
}
```

**¿Requiere migración?** No. Solo cambio de TypeScript en Server Action.

**Impacto en flujo actual:**
- Superadmin: Sin impacto (la verificación se salta si `is_superadmin = true`).
- Admin usando el Builder Pro desde `/admin/sitio/builder`: Sin impacto (el `clinic_id` viene de sus propios datos, no de input del usuario).

**Estado:** Pendiente de aprobación para implementar.

---

## H2 — `deleteAppointment` sin verificación de rol

**Severidad:** 🟠 Media (bajo riesgo real por RLS)

**Archivo:** `src/app/admin/reservas/actions.ts`

**Función actual:**
```typescript
export async function deleteAppointment(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('appointments').delete().eq('id', id)
  ...
}
```

**Problema:**
La función verifica autenticación implícitamente (el cliente de usuario falla si no hay sesión), pero no verifica explícitamente si el usuario tiene el rol para realizar eliminations.

**Por qué el riesgo es bajo:**
La RLS en `appointments` tiene la política `Staff can manage tenant appointments` que restringe el DELETE a usuarios con rol `admin` o `staff` en el tenant. Si un `doctor` intenta llamar a esta función, la BD lo rechazará.

**Sin embargo:**
El código de negocio debería ser explícito en sus intenciones. La ausencia de un guard de rol en el código hace la función difícil de auditar.

**Corrección propuesta (simple, sin riesgo):**
```typescript
export async function deleteAppointment(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'No autenticado' }

  // RLS on appointments enforces tenant isolation
  const { error } = await supabase.from('appointments').delete().eq('id', id)
  ...
}
```

**¿Requiere migración?** No. 3 líneas de TypeScript.

**Estado:** Puede aplicarse en cualquier momento sin riesgo.
