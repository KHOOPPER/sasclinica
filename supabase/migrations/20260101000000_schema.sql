

-- File: 000000_base_schema.sql
-- ============================================================================
-- 000000_base_schema.sql
-- ESTADO CONSOLIDADO, LIMPIO Y AUTÓNOMO (Hardened Edition)
-- ============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TIPOS ENUM (Unificación de Roles)
CREATE TYPE public.user_role AS ENUM ('superadmin', 'admin', 'staff', 'patient');
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');

-- 3. FUNCIONES DE SEGURIDAD (Hardening y search_path)
CREATE OR REPLACE FUNCTION public.check_is_superadmin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid AND is_superadmin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. TABLAS CORE (Estructura final sin ALTERs incrementales)

-- Tenants
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinics
CREATE TABLE public.clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  role public.user_role DEFAULT 'patient',
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  image_url TEXT,
  is_superadmin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tenant Users
CREATE TABLE public.tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.user_role NOT NULL DEFAULT 'patient',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- Public Clinic Settings
CREATE TABLE public.public_clinic_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  clinic_name TEXT NOT NULL,
  clinic_logo TEXT,
  
  -- Tokens de Diseño
  primary_color TEXT DEFAULT '#003366',
  secondary_color TEXT DEFAULT '#f8fafc',
  accent_color TEXT DEFAULT '#047857',
  animation_style TEXT DEFAULT 'slide',
  border_radius TEXT DEFAULT 'rounded-2xl',
  
  -- Estructura del Sitio
  hero_layout TEXT DEFAULT 'left',
  show_services BOOLEAN DEFAULT true,
  navbar_opacity DECIMAL DEFAULT 1.0,
  navbar_text_color TEXT DEFAULT '#000000',
  active_sections JSONB DEFAULT '["hero", "services", "promotions", "about", "contact"]',
  
  -- Contenido Builder Pro
  hero_badge TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image_url TEXT,
  logo_url TEXT,
  logo_height INTEGER DEFAULT 40,
  logo_width INTEGER DEFAULT 160,
  logo_offset_y INTEGER DEFAULT 0,
  logo_offset_x INTEGER DEFAULT 0,
  trust_badges_color TEXT DEFAULT '#94a3b8',
  
  -- Contacto y Mapas
  contact_title TEXT,
  contact_subtitle TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  contact_whatsapp TEXT,
  map_latitude DECIMAL,
  map_longitude DECIMAL,
  map_zoom INTEGER DEFAULT 15,
  
  -- Footer y Redes
  footer_text TEXT,
  social_facebook TEXT,
  social_instagram TEXT,
  social_twitter TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clinic_id)
);

-- Staff Members
CREATE TABLE public.staff_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialty TEXT,
  full_name TEXT, -- Denormalización para consultas rápidas
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patients
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  assigned_doctor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES public.staff_members(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status public.appointment_status NOT NULL DEFAULT 'pending',
  patient_name TEXT,
  patient_phone TEXT,
  patient_dui TEXT,
  patient_email TEXT,
  notes TEXT,
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ÍNDICES DE RENDIMIENTO (Búsqueda por Inquilino/Usuario)
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON public.tenants(slug);
CREATE INDEX IF NOT EXISTS idx_clinics_tenant_id ON public.clinics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant_id ON public.tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user_id ON public.tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_members_clinic_id ON public.staff_members(clinic_id);
CREATE INDEX IF NOT EXISTS idx_patients_tenant_id ON public.patients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_clinic_id ON public.services(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id ON public.appointments(clinic_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON public.audit_logs(tenant_id);

-- 6. SEGURIDAD (RLS Y POLÍTICAS CRUD COMPLETAS Y EXPLÍCITAS)

-- Habilitación masiva de RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_clinic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- TENANTS (Inquilinos)
-- -------------------------------------------------------------
CREATE POLICY "tenants_select" ON public.tenants FOR SELECT USING (
  public.check_is_superadmin(auth.uid()) OR 
  id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid())
);
CREATE POLICY "tenants_insert" ON public.tenants FOR INSERT WITH CHECK (
  public.check_is_superadmin(auth.uid())
);
CREATE POLICY "tenants_update" ON public.tenants FOR UPDATE USING (
  public.check_is_superadmin(auth.uid())
) WITH CHECK (
  public.check_is_superadmin(auth.uid())
);
CREATE POLICY "tenants_delete" ON public.tenants FOR DELETE USING (
  public.check_is_superadmin(auth.uid())
);

-- -------------------------------------------------------------
-- CLINICS (Sucursales)
-- -------------------------------------------------------------
CREATE POLICY "clinics_select" ON public.clinics FOR SELECT USING (
  public.check_is_superadmin(auth.uid()) OR
  tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid())
);
CREATE POLICY "clinics_insert" ON public.clinics FOR INSERT WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = clinics.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);
CREATE POLICY "clinics_update" ON public.clinics FOR UPDATE USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = clinics.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
) WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = clinics.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);
CREATE POLICY "clinics_delete" ON public.clinics FOR DELETE USING (
  public.check_is_superadmin(auth.uid())
);

-- -------------------------------------------------------------
-- PROFILES (Perfiles de Usuario Caché)
-- -------------------------------------------------------------
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (
  auth.uid() = id OR public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = profiles.tenant_id))
);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (
  auth.uid() = id OR public.check_is_superadmin(auth.uid())
);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (
  auth.uid() = id OR public.check_is_superadmin(auth.uid())
) WITH CHECK (
  auth.uid() = id OR public.check_is_superadmin(auth.uid())
);
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE USING (
  public.check_is_superadmin(auth.uid())
);

-- -------------------------------------------------------------
-- TENANT_USERS (Roles y Membresías: Fuente de verdad)
-- -------------------------------------------------------------
CREATE POLICY "tu_select" ON public.tenant_users FOR SELECT USING (
  user_id = auth.uid() OR public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);
CREATE POLICY "tu_insert" ON public.tenant_users FOR INSERT WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);
CREATE POLICY "tu_update" ON public.tenant_users FOR UPDATE USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
) WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);
CREATE POLICY "tu_delete" ON public.tenant_users FOR DELETE USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);

-- -------------------------------------------------------------
-- STAFF_MEMBERS (Miembros de Clínica)
-- -------------------------------------------------------------
CREATE POLICY "staff_select" ON public.staff_members FOR SELECT USING (
  public.check_is_superadmin(auth.uid()) OR
  tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid())
);
CREATE POLICY "staff_insert" ON public.staff_members FOR INSERT WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = staff_members.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);
CREATE POLICY "staff_update" ON public.staff_members FOR UPDATE USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = staff_members.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
) WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = staff_members.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);
CREATE POLICY "staff_delete" ON public.staff_members FOR DELETE USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = staff_members.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);

-- -------------------------------------------------------------
-- PATIENTS (Pacientes)
-- -------------------------------------------------------------
CREATE POLICY "patients_select" ON public.patients FOR SELECT USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = patients.tenant_id AND tu.user_id = auth.uid() AND tu.role IN ('admin', 'staff'))) OR
  user_id = auth.uid() -- El paciente puede ver su propio registro
);
CREATE POLICY "patients_insert" ON public.patients FOR INSERT WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = patients.tenant_id AND tu.user_id = auth.uid() AND tu.role IN ('admin', 'staff')))
);
CREATE POLICY "patients_update" ON public.patients FOR UPDATE USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = patients.tenant_id AND tu.user_id = auth.uid() AND tu.role IN ('admin', 'staff')))
) WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = patients.tenant_id AND tu.user_id = auth.uid() AND tu.role IN ('admin', 'staff')))
);
CREATE POLICY "patients_delete" ON public.patients FOR DELETE USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = patients.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);

-- -------------------------------------------------------------
-- SERVICES (Servicios)
-- -------------------------------------------------------------
CREATE POLICY "services_select" ON public.services FOR SELECT USING (true); -- Público
CREATE POLICY "services_insert" ON public.services FOR INSERT WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = services.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);
CREATE POLICY "services_update" ON public.services FOR UPDATE USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = services.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
) WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = services.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);
CREATE POLICY "services_delete" ON public.services FOR DELETE USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = services.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);

-- -------------------------------------------------------------
-- APPOINTMENTS (Citas)
-- -------------------------------------------------------------
CREATE POLICY "appointments_select" ON public.appointments FOR SELECT USING (
  public.check_is_superadmin(auth.uid()) OR
  patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = appointments.tenant_id AND tu.user_id = auth.uid() AND tu.role IN ('admin', 'staff')))
);
CREATE POLICY "appointments_insert" ON public.appointments FOR INSERT WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = appointments.tenant_id AND tu.user_id = auth.uid() AND tu.role IN ('admin', 'staff')))
);
CREATE POLICY "appointments_update" ON public.appointments FOR UPDATE USING (
  public.check_is_superadmin(auth.uid()) OR
  patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = appointments.tenant_id AND tu.user_id = auth.uid() AND tu.role IN ('admin', 'staff')))
) WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  patient_id IN (SELECT id FROM public.patients WHERE user_id = auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = appointments.tenant_id AND tu.user_id = auth.uid() AND tu.role IN ('admin', 'staff')))
);
CREATE POLICY "appointments_delete" ON public.appointments FOR DELETE USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = appointments.tenant_id AND tu.user_id = auth.uid() AND tu.role IN ('admin', 'staff')))
);

-- -------------------------------------------------------------
-- PUBLIC_CLINIC_SETTINGS (Builder Settings)
-- -------------------------------------------------------------
CREATE POLICY "settings_select" ON public.public_clinic_settings FOR SELECT USING (true); -- Público
CREATE POLICY "settings_insert" ON public.public_clinic_settings FOR INSERT WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = public_clinic_settings.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);
CREATE POLICY "settings_update" ON public.public_clinic_settings FOR UPDATE USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = public_clinic_settings.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
) WITH CHECK (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = public_clinic_settings.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);
CREATE POLICY "settings_delete" ON public.public_clinic_settings FOR DELETE USING (
  public.check_is_superadmin(auth.uid())
); -- Solo superadministradores borran settings enteros

-- -------------------------------------------------------------
-- AUDIT_LOGS (Auditoría)
-- -------------------------------------------------------------
CREATE POLICY "audit_select" ON public.audit_logs FOR SELECT USING (
  public.check_is_superadmin(auth.uid()) OR
  (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.tenant_id = audit_logs.tenant_id AND tu.user_id = auth.uid() AND tu.role = 'admin'))
);
CREATE POLICY "audit_insert" ON public.audit_logs FOR INSERT WITH CHECK (
  false -- Solo DB interna o Service Key (bypass RLS)
);
CREATE POLICY "audit_update" ON public.audit_logs FOR UPDATE USING (false) WITH CHECK (false);
CREATE POLICY "audit_delete" ON public.audit_logs FOR DELETE USING (false);



-- File: 20260401040000_h7_remove_public_inserts.sql
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


-- File: 20260418235500_sync_superadmin_flag.sql
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


-- File: 20260419110000_add_plan_to_tenants.sql
-- Migration: Add 'plan' column to 'tenants' table
-- Created at: 2026-04-19

ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'profesional';

-- COMMENT ON COLUMN public.tenants.plan IS 'Subscription plan level: trial, profesional, elite';


-- File: 20260428144200_add_is_published_to_services.sql
-- Add is_published column to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Update existing records to have is_published = true (since it was missing)
UPDATE public.services SET is_published = true WHERE is_published IS NULL;


-- File: 20260428145600_add_attended_status_to_appointments.sql
-- Add attended_pending_payment to appointment_status enum
ALTER TYPE public.appointment_status ADD VALUE IF NOT EXISTS 'attended_pending_payment';


-- File: 20260428150500_create_payments_table.sql
-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policies for payments
CREATE POLICY "Users can view payments for their tenant"
    ON public.payments
    FOR SELECT
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert payments for their tenant"
    ON public.payments
    FOR INSERT
    WITH CHECK (
        tenant_id IN (
            SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update payments for their tenant"
    ON public.payments
    FOR UPDATE
    USING (
        tenant_id IN (
            SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()
        )
    );


-- File: 20260428151000_add_offer_and_specialty_to_services.sql
-- Create specialties table
CREATE TABLE IF NOT EXISTS public.specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Add specialty_id and offer columns to services table
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS specialty_id UUID REFERENCES public.specialties(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_offer BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS offer_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS offer_description TEXT;

-- Enable RLS for specialties
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view specialties for their tenant"
    ON public.specialties FOR SELECT
    USING (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert specialties for their tenant"
    ON public.specialties FOR INSERT
    WITH CHECK (tenant_id IN (SELECT tenant_id FROM public.tenant_users WHERE user_id = auth.uid()));


-- File: 20260510150000_add_whatsapp_and_missing_tokens.sql
-- Migration: Add WhatsApp Floating Button and missing design tokens to public_clinic_settings
-- This enables the new Builder Pro features for granular customization.

ALTER TABLE public.public_clinic_settings
  -- WhatsApp Floating Button
  ADD COLUMN IF NOT EXISTS show_whatsapp BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_message TEXT DEFAULT 'Hola! Me gustaría agendar una cita...',
  ADD COLUMN IF NOT EXISTS whatsapp_position TEXT DEFAULT 'bottom-right';

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';


-- File: 20260510164000_add_plan_starts_at.sql
-- Add plan_starts_at to tenants

ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS plan_starts_at TIMESTAMP WITH TIME ZONE;


-- File: 20260510173200_create_system_notifications.sql
CREATE TABLE IF NOT EXISTS public.system_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;

-- Permitir a todos los usuarios autenticados leer las notificaciones globales
CREATE POLICY "Permitir lectura general a system_notifications" 
ON public.system_notifications FOR SELECT 
TO authenticated 
USING (true);


-- File: 20260510175000_add_clinic_id_to_notifications.sql
-- Añadir columna clinic_id para permitir notificaciones específicas por clínica además de las globales
ALTER TABLE public.system_notifications ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE;

-- Crear un índice para optimizar las consultas mixtas (globales y por clínica)
CREATE INDEX IF NOT EXISTS idx_system_notifications_clinic_id ON public.system_notifications(clinic_id);
