-- Add Logo Width and Offset customization
ALTER TABLE public_clinic_settings 
ADD COLUMN IF NOT EXISTS logo_width INTEGER DEFAULT 160,
ADD COLUMN IF NOT EXISTS logo_offset_y INTEGER DEFAULT 0;
