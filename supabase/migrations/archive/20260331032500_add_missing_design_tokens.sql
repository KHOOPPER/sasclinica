-- Migration: Add missing design tokens to public_clinic_settings
-- This migration adds support for the new variants, fonts and background colors in the "Premium Black & Gold" update.

ALTER TABLE public.public_clinic_settings
  ADD COLUMN IF NOT EXISTS header_variant TEXT DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS hero_variant TEXT DEFAULT 'centered',
  ADD COLUMN IF NOT EXISTS footer_variant TEXT DEFAULT 'classic',
  ADD COLUMN IF NOT EXISTS services_layout TEXT DEFAULT 'grid',
  ADD COLUMN IF NOT EXISTS footer_text TEXT,
  ADD COLUMN IF NOT EXISTS font_headlines TEXT DEFAULT 'Manrope',
  ADD COLUMN IF NOT EXISTS font_body TEXT DEFAULT 'Inter',
  ADD COLUMN IF NOT EXISTS font_headline_weight INTEGER DEFAULT 800,
  ADD COLUMN IF NOT EXISTS font_body_weight INTEGER DEFAULT 400,
  ADD COLUMN IF NOT EXISTS bg_main TEXT DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS bg_secondary TEXT DEFAULT '#f8fafc',
  ADD COLUMN IF NOT EXISTS text_main TEXT DEFAULT '#0f172a',
  ADD COLUMN IF NOT EXISTS text_secondary TEXT DEFAULT '#64748b',
  ADD COLUMN IF NOT EXISTS navbar_bg TEXT DEFAULT '#ffffff',
  ADD COLUMN IF NOT EXISTS footer_bg TEXT DEFAULT '#f8fafc',
  ADD COLUMN IF NOT EXISTS logo_padding_top INTEGER DEFAULT 0;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
