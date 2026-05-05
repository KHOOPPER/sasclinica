-- Migration: Add image_url to profiles and staff_members
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.staff_members ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update RLS policies if necessary (profiles already has basic RLS)
-- staff_members also has RLS
