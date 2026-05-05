-- Add About section customization columns
ALTER TABLE public.public_clinic_settings
  ADD COLUMN IF NOT EXISTS about_accent_color TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS about_bg_opacity INTEGER DEFAULT 10;

-- Update schema cache
NOTIFY pgrst, 'reload schema';
