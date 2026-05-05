-- Expand customization for Elite V2
ALTER TABLE public_clinic_settings 
ADD COLUMN IF NOT EXISTS hero_badge TEXT DEFAULT 'CLÍNICA PRIVADA ÉLITE',
ADD COLUMN IF NOT EXISTS hero_title_italic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS hero_subtitle_italic BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS trust_badge_1 TEXT DEFAULT 'SEGUROS MÉDICOS',
ADD COLUMN IF NOT EXISTS trust_badge_2 TEXT DEFAULT 'ISO 9001:2015',
ADD COLUMN IF NOT EXISTS trust_badge_3 TEXT DEFAULT 'CLÍNICA CERTIFICADA',
ADD COLUMN IF NOT EXISTS contact_title TEXT DEFAULT 'Estamos ubicados en el corazón de la ciudad',
ADD COLUMN IF NOT EXISTS contact_subtitle TEXT DEFAULT 'Disponibles las 24 horas para emergencias críticas y citas preventivas de lunes a sábado.';
