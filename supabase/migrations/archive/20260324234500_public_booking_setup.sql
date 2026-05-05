-- Migration: Create public_clinic_settings and update appointments for public booking

-- 1. Create public_clinic_settings table
CREATE TABLE IF NOT EXISTS public.public_clinic_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    welcome_text TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_public_clinic_slug ON public.public_clinic_settings(slug);

-- 2. Update appointments table with patient fields for public bookings
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS patient_name TEXT,
ADD COLUMN IF NOT EXISTS patient_phone TEXT,
ADD COLUMN IF NOT EXISTS patient_dui TEXT,
ADD COLUMN IF NOT EXISTS patient_email TEXT;

-- 3. Add clinic_id to appointments if not exist (it already exists in schema)
-- 4. Ensure RLS for public access (only for these tables/operations)
ALTER TABLE public.public_clinic_settings ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read public settings by slug
CREATE POLICY "Allow public read access to clinic settings"
ON public.public_clinic_settings
FOR SELECT
TO public
USING (is_active = true);

-- Policy to allow anyone to create appointments (public booking)
CREATE POLICY "Allow public to create appointments"
ON public.appointments
FOR INSERT
TO public
WITH CHECK (true);

-- Policy to allow anyone to read clinic details (needed for portal)
-- Note: Clinics table already has RLS, we need a public policy for it or join it.
CREATE POLICY "Allow public read access to clinics"
ON public.clinics
FOR SELECT
TO public
USING (true);

-- Policy for public read services (needed to show on booking page)
CREATE POLICY "Allow public read access to services"
ON public.services
FOR SELECT
TO public
USING (is_active = true);

-- Policy for public read business hours
CREATE POLICY "Allow public read access to business hours"
ON public.business_hours
FOR SELECT
TO public
USING (true);
