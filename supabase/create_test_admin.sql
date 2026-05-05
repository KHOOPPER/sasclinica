-- Create test admin and tenant (Fixed ambiguity)
DO $$
DECLARE
  v_superadmin_id UUID := '00000000-0000-0000-0000-000000000000';
  v_tenant_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- 1. Auth User
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, role, aud, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
  VALUES (
    v_superadmin_id, 
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

  -- 2. Tenant
  INSERT INTO public.tenants (id, name, slug)
  VALUES (v_tenant_id, 'Clinica de Prueba', 'clinica-prueba')
  ON CONFLICT (id) DO NOTHING;

  -- 3. Profile
  INSERT INTO public.profiles (id, email, first_name, last_name, is_superadmin, tenant_id, role)
  VALUES (v_superadmin_id, 'admin@clinica.com', 'Super', 'Admin', true, v_tenant_id, 'admin')
  ON CONFLICT (id) DO NOTHING;

  -- 4. Linked to tenant_users as admin
  INSERT INTO public.tenant_users (tenant_id, user_id, role)
  VALUES (v_tenant_id, v_superadmin_id, 'admin')
  ON CONFLICT (tenant_id, user_id) DO NOTHING;

  -- 5. Create a default clinic
  INSERT INTO public.clinics (id, tenant_id, name)
  VALUES ('22222222-2222-2222-2222-222222222222', v_tenant_id, 'Sede Principal')
  ON CONFLICT (id) DO NOTHING;

END $$;
