-- Migration: Change navbar_border_width to NUMERIC to allow decimal values (e.g. 0.5)

ALTER TABLE public.public_clinic_settings 
  ALTER COLUMN navbar_border_width TYPE NUMERIC USING navbar_border_width::NUMERIC;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
