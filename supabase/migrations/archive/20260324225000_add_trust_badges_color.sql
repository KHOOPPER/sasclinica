-- Add Trust Badges Color customization
ALTER TABLE public_clinic_settings 
ADD COLUMN IF NOT EXISTS trust_badges_color TEXT DEFAULT '#94a3b8';
