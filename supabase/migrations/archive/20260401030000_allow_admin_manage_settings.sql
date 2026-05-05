-- Migration: Allow clinic administrators to manage their own public settings
-- This enables administrators to use the "Configuración del Sitio" panel

-- 1. Policy for SELECT: Allow clinic admins to read their own clinic's settings
-- We first drop existing policies if any, but "Allow public read access to clinic settings" should stay (for public site)
DROP POLICY IF EXISTS "Admins can manage their own clinic settings" ON public.public_clinic_settings;

CREATE POLICY "Admins can manage their own clinic settings"
ON public.public_clinic_settings
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.staff_members sm
        WHERE sm.user_id = auth.uid() 
        AND sm.clinic_id = public.public_clinic_settings.clinic_id
        AND sm.role = 'admin'
    )
    OR
    EXISTS (
        SELECT 1 FROM public.tenant_users tu
        WHERE tu.user_id = auth.uid() 
        AND tu.tenant_id = public.public_clinic_settings.tenant_id
        AND tu.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.staff_members sm
        WHERE sm.user_id = auth.uid() 
        AND sm.clinic_id = public.public_clinic_settings.clinic_id
        AND sm.role = 'admin'
    )
    OR
    EXISTS (
        SELECT 1 FROM public.tenant_users tu
        WHERE tu.user_id = auth.uid() 
        AND tu.tenant_id = public.public_clinic_settings.tenant_id
        AND tu.role = 'admin'
    )
);
