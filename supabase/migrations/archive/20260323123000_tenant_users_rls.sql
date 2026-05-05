-- Allow users to read their own memberships
CREATE POLICY "Users can view own tenant memberships" ON public.tenant_users
FOR SELECT
USING (auth.uid() = user_id);

-- Allow Superadmins to see all memberships
CREATE POLICY "Superadmins can view all tenant memberships" ON public.tenant_users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_superadmin = true
  )
);
