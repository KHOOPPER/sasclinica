-- Add assigned_doctor_id to patients if it doesn't exist
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS assigned_doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
