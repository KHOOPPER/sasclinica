-- Seed minimal data
DO $$
DECLARE
  superadmin_id UUID := '00000000-0000-0000-0000-000000000000';
  tenant_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- 1. Auth User
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, role, aud, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
  VALUES (
    superadmin_id, 
    '00000000-0000-0000-0000-000000000000',
    'admin@clinica.com', 
    crypt('password123', gen_salt('bf', 10)), 
    now(), 
    'authenticated', 
    'authenticated', 
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"first_name":"Super","last_name":"Admin"}'::jsonb,
    now(),
    now(),
    ''
  ) ON CONFLICT (id) DO NOTHING;

  -- 2. Profile
  INSERT INTO public.profiles (id, email, first_name, last_name, is_superadmin)
  VALUES (superadmin_id, 'admin@clinica.com', 'Super', 'Admin', true)
  ON CONFLICT (id) DO NOTHING;

  -- 3. Tenant
  INSERT INTO public.tenants (id, name, slug)
  VALUES (tenant_id, 'Clinica de Prueba', 'clinica-prueba')
  ON CONFLICT (id) DO NOTHING;

END $$;
