-- Add Promotions and Testimonials sections with JSONB support
ALTER TABLE public.public_clinic_settings
  ADD COLUMN IF NOT EXISTS show_promotions BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS promo_variant TEXT DEFAULT 'grid',
  ADD COLUMN IF NOT EXISTS promotions_data JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS show_testimonials BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS testimonials_variant TEXT DEFAULT 'grid',
  ADD COLUMN IF NOT EXISTS testimonials_data JSONB DEFAULT '[]';

-- Update schema cache
NOTIFY pgrst, 'reload schema';
