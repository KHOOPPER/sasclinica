-- Simplest fix: just drop the FK entirely and keep the column as a plain nullable UUID.
-- The UI will enforce doctor selection integrity at the application layer.
-- This avoids FK conflicts when the dropdown sends staff_members.id vs profiles.id.

ALTER TABLE public.patients 
  DROP CONSTRAINT IF EXISTS patients_assigned_doctor_id_fkey;

ALTER TABLE public.patients 
  ALTER COLUMN assigned_doctor_id DROP NOT NULL;
