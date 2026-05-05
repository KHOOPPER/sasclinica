# Notas de Seguridad — Hallazgos Pendientes

Fecha: 2026-04-01

Los siguientes hallazgos de la Fase 3 de Hardening quedaron documentados aquí para
ser tratados en el futuro, ya que su corrección implica cambios en migraciones o
en lógica de negocio que requieren plan previo aprobado.

## H7 — RLS de INSERT público en appointments demasiado permisivo

**Política actual:**
```sql
CREATE POLICY "Allow public to create appointments"
ON public.appointments FOR INSERT TO public
WITH CHECK (true);
```

**Problema:** `WITH CHECK (true)` permite insertar una cita con cualquier `tenant_id`
o `clinic_id`, incluyendo los de otros tenants. El servidor valida esto antes de
insertar, pero la BD no tiene segunda línea de defensa.

**Corrección propuesta (cuando se apruebe):**
```sql
-- Solo permitir insertar citas cuyo tenant_id corresponda a la clínica indicada
CREATE POLICY "Allow public to create appointments"
ON public.appointments FOR INSERT TO public
WITH CHECK (
  clinic_id IN (
    SELECT id FROM public.clinics WHERE is_active = true
  )
);
```

⚠️ Requiere verificar que la columna `is_active` exista en `clinics` antes de aplicar.

---

## H8 — updateWebsiteSettings no verifica tenant ownership

**Problema:** La acción `updateWebsiteSettings` en `src/app/superadmin/actions.ts`
verifica que el usuario esté autenticado pero no verifica que sea superadmin o que
el `clinic_id` que quiere editar pertenezca a su propio tenant.

**Corrección propuesta (cuando se apruebe):**
Antes del upsert, verificar que `clinic_id` pertenezca al tenant del usuario:
```ts
// For non-superadmin users:
const { data: tenantUser } = await supabase
  .from('tenant_users')
  .select('tenant_id')
  .eq('user_id', authData.user.id)
  .single()

if (!isSuperadmin && tenantUser?.tenant_id !== tenant_id) {
  return { success: false, error: 'No tienes permisos para editar esta clínica' }
}
```

⚠️ Requiere pasar `isSuperadmin` o `tenant_id` como contexto adicional — coordinar
con el builder pro para no romper el flujo actual.

---

## H2 — deleteAppointment sin verificación de rol

**Problema:** `deleteAppointment` no verifica el rol del usuario. La eliminación
ocurre con el cliente de usuario (RLS la protege), pero un staff sin permiso de
delete podría intentar llamarla directamente.

**Estado actual:** Protegido por RLS si la política lo restringe adecuadamente.
Revisar que `Staff can manage tenant appointments` no incluya DELETE para roles no-admin.
