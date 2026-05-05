-- Permitir a los superadmin leer todas las clinicas (tenants)
CREATE POLICY "Superadmins can view all tenants" ON public.tenants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.is_superadmin = true
  )
);
