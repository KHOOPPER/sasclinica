-- Add Header Chevron toggle for Elite V3
ALTER TABLE public_clinic_settings 
ADD COLUMN IF NOT EXISTS show_header_chevron BOOLEAN DEFAULT true;
