DO $$
DECLARE
  superadmin_id UUID := '00000000-0000-0000-0000-000000000000';
  tenant_id UUID := '11111111-1111-1111-1111-111111111111';
  clinic_id UUID := '22222222-2222-2222-2222-222222222222';
BEGIN
  -- Insert Auth User
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = superadmin_id) THEN
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
    );
  END IF;

  -- Insert Profile
  INSERT INTO public.profiles (id, email, first_name, last_name, role, is_superadmin)
  VALUES (superadmin_id, 'admin@clinica.com', 'Super', 'Admin', 'superadmin', true)
  ON CONFLICT (id) DO UPDATE SET 
    role = 'superadmin',
    is_superadmin = true;

  -- Insert Tenant
  INSERT INTO public.tenants (id, name, slug)
  VALUES (tenant_id, 'Clinica de Prueba', 'clinica-prueba')
  ON CONFLICT (id) DO NOTHING;

  -- Insert Clinic
  INSERT INTO public.clinics (id, tenant_id, name)
  VALUES (clinic_id, tenant_id, 'Clínica Principal')
  ON CONFLICT (id) DO NOTHING;

  -- Insert Default Public Settings
  INSERT INTO public.public_clinic_settings (tenant_id, clinic_id, slug, is_active, welcome_text, hero_title, hero_subtitle, primary_color)
  VALUES (tenant_id, clinic_id, 'clinica-prueba', true, 'Bienvenido a Clínica Principal', 'Clínica Principal', 'Tu salud es nuestra prioridad', '#003366')
  ON CONFLICT (tenant_id, clinic_id) DO NOTHING;

END $$;