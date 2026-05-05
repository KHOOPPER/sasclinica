-- Migration: Add navbar_text_color to public_clinic_settings

ALTER TABLE public.public_clinic_settings
  ADD COLUMN IF NOT EXISTS navbar_text_color TEXT DEFAULT '#0f172a';

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
