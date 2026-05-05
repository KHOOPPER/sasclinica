-- Allow admins to see profiles of users in their own tenant
CREATE POLICY "Admins can view tenant member profiles" ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.tenant_users as tu_subject
    WHERE tu_subject.user_id = profiles.id
      AND EXISTS (
        SELECT 1 FROM public.tenant_users as tu_viewer
        WHERE tu_viewer.user_id = auth.uid()
          AND tu_viewer.tenant_id = tu_subject.tenant_id
          AND tu_viewer.role = 'admin'
      )
  )
);
