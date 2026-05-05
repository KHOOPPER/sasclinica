-- Add Logo Height customization
ALTER TABLE public_clinic_settings 
ADD COLUMN IF NOT EXISTS logo_height INTEGER DEFAULT 40;
