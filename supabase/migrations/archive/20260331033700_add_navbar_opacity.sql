-- Migration: Add navbar_opacity to public_clinic_settings

ALTER TABLE public.public_clinic_settings
  ADD COLUMN IF NOT EXISTS navbar_opacity INTEGER DEFAULT 90;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
