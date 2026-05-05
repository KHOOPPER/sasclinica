-- Migration: Add navbar border styling fields

ALTER TABLE public.public_clinic_settings
  ADD COLUMN IF NOT EXISTS navbar_border_color TEXT DEFAULT 'rgba(255,255,255,0.1)',
  ADD COLUMN IF NOT EXISTS navbar_border_width INTEGER DEFAULT 1;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
