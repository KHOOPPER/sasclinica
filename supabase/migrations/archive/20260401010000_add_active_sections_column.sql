-- Migration: Add active_sections column to public_clinic_settings
-- This column will store the order and activation state of sections.

ALTER TABLE public.public_clinic_settings 
ADD COLUMN IF NOT EXISTS active_sections text[] DEFAULT ARRAY['header', 'hero', 'services', 'promotions', 'testimonials', 'footer', 'about'];

-- Asegurar que las clínicas existentes tengan todas las secciones activas por defecto
UPDATE public_clinic_settings 
SET active_sections = ARRAY['header', 'hero', 'services', 'promotions', 'testimonials', 'footer', 'about']
WHERE active_sections IS NULL;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
