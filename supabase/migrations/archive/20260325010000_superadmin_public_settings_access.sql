-- Migration: Superadmin access to public_clinic_settings
-- This ensures the "Guardar" button in the visual editor works for superadmins

DROP POLICY IF EXISTS "Superadmins can manage all public settings" ON public.public_clinic_settings;
CREATE POLICY "Superadmins can manage all public settings" ON public.public_clinic_settings
FOR ALL 
USING (public.check_is_superadmin(auth.uid()))
WITH CHECK (public.check_is_superadmin(auth.uid()));
