-- Add is_published column to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Update existing records to have is_published = true (since it was missing)
UPDATE public.services SET is_published = true WHERE is_published IS NULL;
