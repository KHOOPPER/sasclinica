ALTER TABLE public_clinic_settings 
ADD COLUMN IF NOT EXISTS border_radius TEXT DEFAULT 'rounded-2xl',
ADD COLUMN IF NOT EXISTS hero_layout TEXT DEFAULT 'left';
