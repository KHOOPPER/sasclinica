-- Allow tenant admins to SELECT their own tenant
CREATE POLICY "Admins can view their own tenant" ON public.tenants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_users
    WHERE tenant_users.tenant_id = id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.role = 'admin'
  )
);
