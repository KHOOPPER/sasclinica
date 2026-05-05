-- Migration: Add missing contact and map customization columns to public_clinic_settings
-- This fixes the "column not found" error during save operations.

ALTER TABLE public.public_clinic_settings
  ADD COLUMN IF NOT EXISTS contact_bg_color TEXT,
  ADD COLUMN IF NOT EXISTS contact_text_color TEXT,
  ADD COLUMN IF NOT EXISTS contact_layout TEXT DEFAULT 'split',
  ADD COLUMN IF NOT EXISTS map_style TEXT DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS map_link TEXT;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
