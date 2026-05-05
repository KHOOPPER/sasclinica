-- Add About section image focus columns
ALTER TABLE public.public_clinic_settings
  ADD COLUMN IF NOT EXISTS about_blur INTEGER DEFAULT 20,
  ADD COLUMN IF NOT EXISTS about_overlay_opacity INTEGER DEFAULT 70;

-- Update schema cache
NOTIFY pgrst, 'reload schema';
