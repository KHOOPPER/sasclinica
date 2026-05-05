-- Add notified column to appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS notified BOOLEAN DEFAULT false;
