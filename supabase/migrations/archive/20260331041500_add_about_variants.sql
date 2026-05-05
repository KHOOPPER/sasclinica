-- Add about section variants and customization columns
ALTER TABLE public.public_clinic_settings
  ADD COLUMN IF NOT EXISTS about_variant TEXT DEFAULT 'split',
  ADD COLUMN IF NOT EXISTS about_badge TEXT DEFAULT '+10 Años',
  ADD COLUMN IF NOT EXISTS about_badge_subtext TEXT DEFAULT 'Experiencia Clínica';

-- Update schema cache for PostgREST
NOTIFY pgrst, 'reload schema';
