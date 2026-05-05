-- Migration: Add website configuration fields to public_clinic_settings

ALTER TABLE public.public_clinic_settings
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT,
ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
ADD COLUMN IF NOT EXISTS show_services BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_address TEXT,
ADD COLUMN IF NOT EXISTS contact_whatsapp TEXT;

-- Update existing data with defaults if needed
UPDATE public.public_clinic_settings
SET 
  hero_title = 'Atención médica privada de primer nivel.',
  hero_subtitle = 'Tu tiempo y tu salud son nuestra prioridad. Consultas el mismo día, sin tiempos de espera y con el mejor equipo médico.',
  show_services = true
WHERE hero_title IS NULL;
