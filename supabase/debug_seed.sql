-- Debug seed for tenants
INSERT INTO public.tenants (id, name, slug)
VALUES ('11111111-1111-1111-1111-111111111111', 'Clinica de Prueba', 'clinica-prueba')
ON CONFLICT (id) DO NOTHING;
