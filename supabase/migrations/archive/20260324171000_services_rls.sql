-- RLS Policies for Services table

-- 1. Enable RLS (already enabled in initial schema, but just in case)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Users can view services in their own tenant
CREATE POLICY "Users can view tenant services" ON public.services
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid()
  )
);

-- 3. Policy: Admins can manage services in their own tenant
CREATE POLICY "Admins can manage tenant services" ON public.services
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
