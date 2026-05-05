-- Update Clinics table with more fields
ALTER TABLE public.clinics 
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS moneda TEXT DEFAULT 'USD';

-- RLS Policies for Clinics
DROP POLICY IF EXISTS "Users can view their tenant clinic" ON public.clinics;
CREATE POLICY "Users can view their tenant clinic" ON public.clinics
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can update their tenant clinic" ON public.clinics;
CREATE POLICY "Admins can update their tenant clinic" ON public.clinics
FOR UPDATE
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- RLS Policies for Business Hours
DROP POLICY IF EXISTS "Users can view clinic hours" ON public.business_hours;
CREATE POLICY "Users can view clinic hours" ON public.business_hours
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can manage clinic hours" ON public.business_hours;
CREATE POLICY "Admins can manage clinic hours" ON public.business_hours
FOR ALL
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid() AND role = 'admin'::user_role
  )
);

-- Storage Setup (if possible via SQL, usually works in local Supabase)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public access to logos" ON storage.objects;
CREATE POLICY "Public access to logos" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'logos');

DROP POLICY IF EXISTS "Admins can manage logos" ON storage.objects;
CREATE POLICY "Admins can manage logos" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'logos')
WITH CHECK (bucket_id = 'logos');
