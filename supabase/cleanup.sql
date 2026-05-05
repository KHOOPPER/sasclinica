-- Clear all data in correct order
BEGIN;
  -- Child tables first
  DELETE FROM public.appointment_status_history;
  DELETE FROM public.appointments;
  DELETE FROM public.staff_availability;
  DELETE FROM public.staff_members;
  DELETE FROM public.tenant_feature_flags;
  DELETE FROM public.tenant_users;
  DELETE FROM public.patients;
  DELETE FROM public.services;
  DELETE FROM public.business_hours;
  DELETE FROM public.whatsapp_settings;
  DELETE FROM public.clinics;
  DELETE FROM public.tenants;
  DELETE FROM public.profiles;
  -- System tables
  DELETE FROM auth.users;
COMMIT;
