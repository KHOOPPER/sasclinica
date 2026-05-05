-- Migration: Add 'plan' column to 'tenants' table
-- Created at: 2026-04-19

ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'profesional';

-- COMMENT ON COLUMN public.tenants.plan IS 'Subscription plan level: trial, profesional, elite';
