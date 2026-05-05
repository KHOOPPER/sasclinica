-- Update Patients table with clinical fields
ALTER TABLE public.patients 
  ADD COLUMN IF NOT EXISTS dui TEXT,
  ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE,
  ADD COLUMN IF NOT EXISTS genero TEXT,
  ADD COLUMN IF NOT EXISTS direccion_completa TEXT,
  ADD COLUMN IF NOT EXISTS tipo_sangre TEXT,
  ADD COLUMN IF NOT EXISTS alergias TEXT,
  ADD COLUMN IF NOT EXISTS antecedentes_familiares TEXT;

-- Create Clinical Records table for unlimited consultation history
CREATE TABLE IF NOT EXISTS public.clinical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fecha_consulta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  motivo_consulta TEXT,
  sintomas TEXT,
  diagnostico TEXT,
  tratamiento_recetado TEXT,
  notas_internas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.clinical_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Patients
DROP POLICY IF EXISTS "Users can view tenant patients" ON public.patients;
CREATE POLICY "Users can view tenant patients" ON public.patients
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Staff can manage tenant patients" ON public.patients;
CREATE POLICY "Staff can manage tenant patients" ON public.patients
FOR ALL
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid() AND role IN ('admin'::user_role, 'staff'::user_role)
  )
);

-- RLS Policies for Clinical Records
DROP POLICY IF EXISTS "Users can view tenant clinical records" ON public.clinical_records;
CREATE POLICY "Users can view tenant clinical records" ON public.clinical_records
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Doctors can manage clinical records" ON public.clinical_records;
CREATE POLICY "Doctors can manage clinical records" ON public.clinical_records
FOR ALL
USING (
  tenant_id IN (
    SELECT tenant_id FROM public.tenant_users
    WHERE user_id = auth.uid() AND role IN ('admin'::user_role, 'staff'::user_role)
  )
);
