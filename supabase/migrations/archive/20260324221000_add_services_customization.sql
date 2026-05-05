-- Add Services customization for Elite V2
ALTER TABLE public_clinic_settings 
ADD COLUMN IF NOT EXISTS services_title TEXT DEFAULT 'Nuestros Servicios',
ADD COLUMN IF NOT EXISTS services_subtitle TEXT DEFAULT 'Cuidado integral para todas las edades.';
