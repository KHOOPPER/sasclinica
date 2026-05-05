-- Migration: Add show_navbar_border toggle

ALTER TABLE public.public_clinic_settings
  ADD COLUMN IF NOT EXISTS show_navbar_border BOOLEAN DEFAULT TRUE;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
