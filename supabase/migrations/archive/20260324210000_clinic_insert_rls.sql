-- Add INSERT policy for Admins on Clinics
DROP POLICY IF EXISTS "Admins can insert their tenant clinic" ON public.clinics;
CREATE POLICY "Admins can insert their tenant clinic" ON public.clinics
FOR INSERT
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Add INSERT policy for Admins on Business Hours
DROP POLICY IF EXISTS "Admins can insert business hours" ON public.business_hours;
CREATE POLICY "Admins can insert business hours" ON public.business_hours
FOR INSERT
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);
