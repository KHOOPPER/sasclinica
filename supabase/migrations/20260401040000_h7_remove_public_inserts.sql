-- Migration: Resolve H7 (Public Booking Vulnerability)

-- 1. Remove the completely open public insert policy.
-- This prevents any malicious external actor from calling the Supabase 
-- REST API and flooding our database with spam appointments.
-- The Next.js Backend (via Service Key) is now the sole gateway for public bookings.
DROP POLICY IF EXISTS "Allow public to create appointments" ON public.appointments;

-- 2. Fix Database Shape for Public Booking Flow.
-- The frontend inserts temporal patients via text fields (patient_name, etc.)
-- because they don't have a registered UUID yet.
-- This fixes the constraint block to allow legitimate public bookings.
ALTER TABLE public.appointments ALTER COLUMN patient_id DROP NOT NULL;
