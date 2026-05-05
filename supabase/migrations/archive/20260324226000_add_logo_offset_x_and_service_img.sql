-- Add Logo Offset X
ALTER TABLE public_clinic_settings 
ADD COLUMN IF NOT EXISTS logo_offset_x INTEGER DEFAULT 0;

-- Ensure services has image_url if not present
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'services' AND COLUMN_NAME = 'image_url') THEN
        ALTER TABLE services ADD COLUMN image_url TEXT;
    END IF;
END $$;
