-- Add denormalized fields directly to staff_members for reliable display
-- This avoids relying on a JOIN that silently fails due to RLS

ALTER TABLE public.staff_members 
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT;
