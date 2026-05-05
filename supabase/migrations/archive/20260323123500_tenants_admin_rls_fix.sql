-- Drop the old policy to replace it
DROP POLICY IF EXISTS "Admins can view their own tenant" ON public.tenants;

-- New more robust policy
CREATE POLICY "Clinic members can view their own tenant" ON public.tenants
FOR SELECT
USING (
  id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid()
  )
);
