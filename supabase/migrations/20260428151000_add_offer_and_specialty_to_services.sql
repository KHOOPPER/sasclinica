-- Create specialties table
CREATE TABLE IF NOT EXISTS public.specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add specialty_id and offer columns to services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS specialty_id UUID REFERENCES public.specialties(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_offer BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS offer_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS offer_description TEXT;

-- Enable RLS for specialties
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view specialties for their tenant"
    ON public.specialties FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert specialties for their tenant"
    ON public.specialties FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()));
