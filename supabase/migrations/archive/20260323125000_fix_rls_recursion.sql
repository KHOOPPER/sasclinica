-- 1. Helper function to check if a user is a superadmin without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.check_is_superadmin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_uuid AND is_superadmin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update tenant_users policies
DROP POLICY IF EXISTS "Superadmins can view all tenant memberships" ON public.tenant_users;
CREATE POLICY "Superadmins can view all tenant memberships" ON public.tenant_users
FOR SELECT
USING (public.check_is_superadmin(auth.uid()));

-- 3. Update profiles policies to break recursion
DROP POLICY IF EXISTS "Admins can view tenant member profiles" ON public.profiles;
CREATE POLICY "Admins can view tenant member profiles" ON public.profiles
FOR SELECT
USING (
  EXISTS (
    -- We use a simpler check that doesn't trigger secondary profile RLS
    SELECT 1 FROM public.tenant_users as tu_subject
    WHERE tu_subject.user_id = profiles.id
      AND tu_subject.tenant_id IN (
        SELECT tenant_id FROM public.tenant_users
        WHERE user_id = auth.uid() AND role = 'admin'
      )
  )
);
