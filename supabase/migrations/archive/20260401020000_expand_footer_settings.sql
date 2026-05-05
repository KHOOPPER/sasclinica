-- Migration: Expand footer customization options in public_clinic_settings
-- This adds support for granular column control and editable labels in the Classic Footer.

ALTER TABLE public.public_clinic_settings
  -- Info Column
  ADD COLUMN IF NOT EXISTS footer_show_info BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS footer_info_title TEXT,
  ADD COLUMN IF NOT EXISTS footer_info_desc TEXT,
  
  -- Nav Column
  ADD COLUMN IF NOT EXISTS footer_show_nav BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS footer_nav_title TEXT DEFAULT 'Navegación',
  ADD COLUMN IF NOT EXISTS footer_nav_1_label TEXT DEFAULT 'Inicio',
  ADD COLUMN IF NOT EXISTS footer_nav_2_label TEXT DEFAULT 'Nuestro Equipo',
  ADD COLUMN IF NOT EXISTS footer_nav_3_label TEXT DEFAULT 'Servicios',
  ADD COLUMN IF NOT EXISTS footer_nav_4_label TEXT DEFAULT 'Blog',
  ADD COLUMN IF NOT EXISTS footer_nav_5_label TEXT DEFAULT 'Preguntas Frecuentes',
  
  -- Schedule Column
  ADD COLUMN IF NOT EXISTS footer_show_schedule BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS footer_schedule_title TEXT DEFAULT 'Horarios',
  ADD COLUMN IF NOT EXISTS footer_schedule_weekdays_label TEXT DEFAULT 'Lunes a Viernes',
  ADD COLUMN IF NOT EXISTS footer_schedule_weekends_label TEXT DEFAULT 'Sábados',
  
  -- Contact Column
  ADD COLUMN IF NOT EXISTS footer_show_contact BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS footer_contact_title TEXT DEFAULT 'Ubicación & Citas',
  ADD COLUMN IF NOT EXISTS footer_address_label TEXT,
  ADD COLUMN IF NOT EXISTS footer_phone_label TEXT,
  ADD COLUMN IF NOT EXISTS footer_cta_text TEXT DEFAULT 'Agendar Cita';

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
