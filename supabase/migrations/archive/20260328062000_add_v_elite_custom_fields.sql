-- Migration: Add V-Elite custom fields to public_clinic_settings

ALTER TABLE public.public_clinic_settings
ADD COLUMN IF NOT EXISTS hero_cta_text TEXT,
ADD COLUMN IF NOT EXISTS hero_stat_1_value TEXT,
ADD COLUMN IF NOT EXISTS hero_stat_1_text TEXT,
ADD COLUMN IF NOT EXISTS hero_stat_2_value TEXT,
ADD COLUMN IF NOT EXISTS hero_stat_2_text TEXT,
ADD COLUMN IF NOT EXISTS hero_stat_3_value TEXT,
ADD COLUMN IF NOT EXISTS hero_stat_3_text TEXT,

ADD COLUMN IF NOT EXISTS show_top_banner BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS top_banner_text TEXT,
ADD COLUMN IF NOT EXISTS top_banner_color TEXT,

ADD COLUMN IF NOT EXISTS header_cta_text TEXT,
ADD COLUMN IF NOT EXISTS nav_link_1 TEXT,
ADD COLUMN IF NOT EXISTS nav_link_2 TEXT,
ADD COLUMN IF NOT EXISTS nav_link_3 TEXT,
ADD COLUMN IF NOT EXISTS nav_link_4 TEXT,
ADD COLUMN IF NOT EXISTS nav_link_5 TEXT,

ADD COLUMN IF NOT EXISTS about_title TEXT,
ADD COLUMN IF NOT EXISTS about_subtitle TEXT,
ADD COLUMN IF NOT EXISTS about_description TEXT,
ADD COLUMN IF NOT EXISTS about_image_url TEXT,
ADD COLUMN IF NOT EXISTS show_about BOOLEAN DEFAULT true,

ADD COLUMN IF NOT EXISTS show_specialties BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS specialties_title TEXT,
ADD COLUMN IF NOT EXISTS specialties JSONB DEFAULT '[]'::jsonb,

ADD COLUMN IF NOT EXISTS insurance_text TEXT,
ADD COLUMN IF NOT EXISTS schedule_weekdays TEXT,
ADD COLUMN IF NOT EXISTS schedule_weekends TEXT,
ADD COLUMN IF NOT EXISTS emergency_phone TEXT;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
