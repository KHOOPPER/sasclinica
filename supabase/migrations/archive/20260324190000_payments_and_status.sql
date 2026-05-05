-- 1. Add new status to appointment_status enum
-- Note: enums in Postgres can't easily be modified within a transaction in some environments, 
-- but this is the standard SQL for it.
ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'attended_pending_payment';

-- 2. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'transfer')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- We'll use the same pattern as other tables, checking tenant_id via tenant_users
CREATE POLICY "Users can view payments in their tenant"
  ON public.payments FOR SELECT
  USING (
    tenant_id IN (
      SELECT tu.tenant_id FROM public.tenant_users tu WHERE tu.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert payments in their tenant"
  ON public.payments FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tu.tenant_id FROM public.tenant_users tu WHERE tu.user_id = auth.uid()
    )
  );

-- 5. Add index for performance on revenue queries
CREATE INDEX IF NOT EXISTS idx_payments_tenant_date ON public.payments(tenant_id, created_at);
