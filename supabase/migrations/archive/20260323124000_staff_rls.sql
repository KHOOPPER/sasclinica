-- Enable RLS on staff_members
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

-- Admins can do everything on staff members belonging to their tenant
CREATE POLICY "Admins can manage staff in their tenant" ON public.staff_members
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_users
    WHERE tenant_users.tenant_id = staff_members.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.tenant_users
    WHERE tenant_users.tenant_id = staff_members.tenant_id
      AND tenant_users.user_id = auth.uid()
      AND tenant_users.role = 'admin'
  )
);

-- Staff can view their own tenant colleagues
CREATE POLICY "Staff can view colleagues" ON public.staff_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_users
    WHERE tenant_users.tenant_id = staff_members.tenant_id
      AND tenant_users.user_id = auth.uid()
  )
);
