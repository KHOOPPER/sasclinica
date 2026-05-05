-- Fix: Sync is_superadmin boolean with role = 'superadmin'
-- This resolves the issue where users have role='superadmin' but is_superadmin=false
-- causing all superadmin permission checks to fail.

-- 1. Update all existing profiles: set is_superadmin=true where role='superadmin'
UPDATE public.profiles
SET is_superadmin = true
WHERE role = 'superadmin';

-- 2. Create a trigger to keep is_superadmin in sync with role automatically
CREATE OR REPLACE FUNCTION public.sync_is_superadmin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'superadmin' THEN
    NEW.is_superadmin := true;
  ELSIF OLD.role = 'superadmin' AND NEW.role != 'superadmin' THEN
    NEW.is_superadmin := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_is_superadmin ON public.profiles;

CREATE TRIGGER trg_sync_is_superadmin
  BEFORE INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_is_superadmin();
