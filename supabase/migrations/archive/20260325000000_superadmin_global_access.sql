-- RLS Policies for Superadmin global access
-- This migration ensures superadmins can manage any clinic or business hours

-- Clinics
DROP POLICY IF EXISTS "Superadmins can manage all clinics" ON public.clinics;
CREATE POLICY "Superadmins can manage all clinics" ON public.clinics
FOR ALL 
USING (public.check_is_superadmin(auth.uid()))
WITH CHECK (public.check_is_superadmin(auth.uid()));

-- Business Hours
DROP POLICY IF EXISTS "Superadmins can manage all business hours" ON public.business_hours;
CREATE POLICY "Superadmins can manage all business hours" ON public.business_hours
FOR ALL
USING (public.check_is_superadmin(auth.uid()))
WITH CHECK (public.check_is_superadmin(auth.uid()));
