INSERT INTO public.profiles (id, email, first_name, last_name, role, is_superadmin)
VALUES ('00000000-0000-0000-0000-000000000000', 'admin@clinica.com', 'Super', 'Admin', 'superadmin', true)
ON CONFLICT (id) DO UPDATE SET role = 'superadmin', is_superadmin = true;

INSERT INTO public.tenants (id, name, slug)
VALUES ('11111111-1111-1111-1111-111111111111', 'Clinica de Prueba', 'clinica-prueba')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.clinics (id, tenant_id, name)
VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Clínica Principal')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.public_clinic_settings (tenant_id, clinic_id, slug, is_active, welcome_text, hero_title, hero_subtitle, primary_color)
VALUES ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'clinica-prueba', true, 'Bienvenido a Clínica Principal', 'Clínica Principal', 'Tu salud es nuestra prioridad', '#003366')
ON CONFLICT (tenant_id, clinic_id) DO NOTHING;