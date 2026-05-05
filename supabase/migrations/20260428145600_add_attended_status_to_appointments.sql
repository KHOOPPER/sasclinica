-- Add attended_pending_payment to appointment_status enum
ALTER TYPE public.appointment_status ADD VALUE IF NOT EXISTS 'attended_pending_payment';
