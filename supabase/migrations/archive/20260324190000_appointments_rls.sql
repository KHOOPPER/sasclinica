-- RLS Policies for Appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view tenant appointments" ON public.appointments;
CREATE POLICY "Users can view tenant appointments" ON public.appointments
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Staff can manage tenant appointments" ON public.appointments;
CREATE POLICY "Staff can manage tenant appointments" ON public.appointments
FOR ALL
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid() AND role IN ('admin'::user_role, 'staff'::user_role)
  )
);
