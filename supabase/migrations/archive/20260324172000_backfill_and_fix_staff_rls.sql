-- Backfill existing staff_members with data from profiles
UPDATE public.staff_members sm
SET
  full_name = CONCAT(p.first_name, ' ', p.last_name),
  email = p.email,
  role = p.role
FROM public.profiles p
WHERE sm.user_id = p.id
  AND (sm.full_name IS NULL OR sm.email IS NULL OR sm.role IS NULL);

-- Add RLS policy to allow admins to SELECT staff in their tenant
DROP POLICY IF EXISTS "Admins can view tenant staff" ON public.staff_members;
CREATE POLICY "Admins can view tenant staff" ON public.staff_members
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid()
  )
);

-- Allow admins to insert/update/delete in their tenant
DROP POLICY IF EXISTS "Admins can manage tenant staff" ON public.staff_members;
CREATE POLICY "Admins can manage tenant staff" ON public.staff_members
FOR ALL
TO authenticated
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
