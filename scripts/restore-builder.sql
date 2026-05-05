-- 1. ADD MISSING COLUMNS TO public_clinic_settings
ALTER TABLE public.public_clinic_settings
  ADD COLUMN IF NOT EXISTS about_variant TEXT DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS about_badge TEXT,
  ADD COLUMN IF NOT EXISTS about_badge_subtext TEXT,
  ADD COLUMN IF NOT EXISTS about_accent_color TEXT,
  ADD COLUMN IF NOT EXISTS about_bg_opacity INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS about_blur INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS about_overlay_opacity INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS header_variant TEXT DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS hero_variant TEXT DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS footer_variant TEXT DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS services_layout TEXT DEFAULT 'grid',
  ADD COLUMN IF NOT EXISTS footer_text TEXT,
  ADD COLUMN IF NOT EXISTS font_headlines TEXT,
  ADD COLUMN IF NOT EXISTS font_body TEXT,
  ADD COLUMN IF NOT EXISTS font_headline_weight TEXT,
  ADD COLUMN IF NOT EXISTS font_body_weight TEXT,
  ADD COLUMN IF NOT EXISTS bg_main TEXT,
  ADD COLUMN IF NOT EXISTS bg_secondary TEXT,
  ADD COLUMN IF NOT EXISTS text_main TEXT,
  ADD COLUMN IF NOT EXISTS text_secondary TEXT,
  ADD COLUMN IF NOT EXISTS navbar_bg TEXT,
  ADD COLUMN IF NOT EXISTS footer_bg TEXT,
  ADD COLUMN IF NOT EXISTS logo_padding_top INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS navbar_opacity INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS navbar_text_color TEXT,
  ADD COLUMN IF NOT EXISTS navbar_border_color TEXT,
  ADD COLUMN IF NOT EXISTS navbar_border_width INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS show_navbar_border BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS promotions_title TEXT,
  ADD COLUMN IF NOT EXISTS promotions_subtitle TEXT,
  ADD COLUMN IF NOT EXISTS promotions_badge TEXT,
  ADD COLUMN IF NOT EXISTS promotions_cta_text TEXT,
  ADD COLUMN IF NOT EXISTS promo_text_color TEXT,
  ADD COLUMN IF NOT EXISTS promo_bg_color TEXT,
  ADD COLUMN IF NOT EXISTS promo_section_bg TEXT,
  ADD COLUMN IF NOT EXISTS promo_accent_color TEXT,
  ADD COLUMN IF NOT EXISTS promo_cta_bg_color TEXT,
  ADD COLUMN IF NOT EXISTS promo_cta_text_color TEXT,
  ADD COLUMN IF NOT EXISTS active_sections JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS footer_show_info BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS footer_info_title TEXT,
  ADD COLUMN IF NOT EXISTS footer_info_desc TEXT,
  ADD COLUMN IF NOT EXISTS footer_show_nav BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS footer_nav_title TEXT,
  ADD COLUMN IF NOT EXISTS footer_nav_1_label TEXT,
  ADD COLUMN IF NOT EXISTS footer_nav_2_label TEXT,
  ADD COLUMN IF NOT EXISTS footer_nav_3_label TEXT,
  ADD COLUMN IF NOT EXISTS footer_nav_4_label TEXT,
  ADD COLUMN IF NOT EXISTS footer_nav_5_label TEXT,
  ADD COLUMN IF NOT EXISTS footer_show_schedule BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS footer_schedule_title TEXT,
  ADD COLUMN IF NOT EXISTS footer_schedule_weekdays_label TEXT,
  ADD COLUMN IF NOT EXISTS footer_schedule_weekends_label TEXT,
  ADD COLUMN IF NOT EXISTS footer_show_contact BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS footer_contact_title TEXT,
  ADD COLUMN IF NOT EXISTS footer_address_label TEXT,
  ADD COLUMN IF NOT EXISTS footer_phone_label TEXT,
  ADD COLUMN IF NOT EXISTS footer_cta_text TEXT;

-- 2. CREATE DEFAULT SUPERADMIN USER
DO $$
DECLARE
  superadmin_id UUID := '00000000-0000-0000-0000-000000000000';
  tenant_id UUID := '11111111-1111-1111-1111-111111111111';
  clinic_id UUID := '22222222-2222-2222-2222-222222222222';
BEGIN
  -- Insert Auth User (if not exists)
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

  -- Insert Profile (if not exists)
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

  -- Insert Default Public Settings (with the missing columns populated)
  INSERT INTO public.public_clinic_settings (tenant_id, clinic_id, slug, is_active, welcome_text, hero_title, hero_subtitle, primary_color)
  VALUES (tenant_id, clinic_id, 'clinica-prueba', true, 'Bienvenido a Clínica Principal', 'Clínica Principal', 'Tu salud es nuestra prioridad', '#003366')
  ON CONFLICT (tenant_id, clinic_id) DO NOTHING;

END $$;

-- Reload PostgREST schema cache
SELECT pg_notify('pgrst', 'reload schema');