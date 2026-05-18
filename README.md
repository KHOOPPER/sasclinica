```
██╗  ██╗ ██████╗██╗     ██╗███╗   ██╗██╗ ██████╗███████╗
██║  ██║██╔════╝██║     ██║████╗  ██║██║██╔════╝██╔════╝
█████╔╝ ██║     ██║     ██║██╔██╗ ██║██║██║     ███████╗
██╔═██╗ ██║     ██║     ██║██║╚██╗██║██║██║     ╚════██║
██║  ██╗╚██████╗███████╗██║██║ ╚████║██║╚██████╗███████║
╚═╝  ╚═╝ ╚═════╝╚══════╝╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝╚══════╝
```


Una solucion integral B2B (Business-to-Business) construida para digitalizar, automatizar y escalar clinicas medicas. Diseñada con un enfoque "API-first" y arquitectura multi-tenant (aislamiento de datos por inquilino), ofreciendo una experiencia premium, rapida y segura tanto para el personal medico como para los pacientes.

## Tecnologias Core (Stack)

El proyecto esta desarrollado utilizando tecnologias modernas y estandares de la industria para garantizar escalabilidad, rendimiento y mantenibilidad:

- **Frontend & Framework:** Next.js 14+ (App Router), React, TypeScript.
- **Backend & Base de Datos:** Supabase (PostgreSQL), Edge Functions.
- **Autenticacion & Seguridad:** Supabase Auth, Row Level Security (RLS) estricto.
- **UI/UX & Estilos:** Tailwind CSS v4, Framer Motion (Micro-interacciones), UI Components personalizados (glassmorphism, dark mode).
- **Despliegue & CI/CD:** Vercel.

## Arquitectura y Caracteristicas Principales

### 1. Arquitectura Multi-tenant Segura
- **Aislamiento a nivel de base de datos:** Cada clinica (tenant) opera en su propio espacio logico, garantizando que los datos jamas se crucen mediante politicas RLS (Row Level Security) que inyectan el `tenant_id` en el contexto de cada consulta.

### 2. Ecosistema de Paneles de Control (Role-Based Access)
- **Superadmin Dashboard:** Gestion global de la plataforma, facturacion SaaS, metricas globales, y control de inquilinos (clinicas).
- **Admin Dashboard (Propietario de Clinica):** Control absoluto sobre su clinica. Incluye un CMS visual (Builder Pro) para personalizar su portal web, gestion de servicios, horarios, staff y configuracion de marca (marca blanca).
- **Staff Dashboard (Medicos y Recepcionistas):** Herramientas especializadas para el dia a dia. Gestion de citas, expedientes medicos de pacientes, recetas (generacion de PDFs) y control de pagos.

### 3. Portal Publico Dinamico (Sitio Web por Clinica)
- Cada clinica obtiene automaticamente un portal web publico de reservas y presentacion.
- Personalizacion en tiempo real (colores, tipografias, logos, hero sections, testimonios) reflejada al instante.

### 4. Optimizaciones de Rendimiento
- **Generacion Estatica (SSG) y Server-Side Rendering (SSR):** Paginas optimizadas para SEO y carga instantanea.
- **Paralelizacion de Consultas (Promises):** Reduccion drastica del tiempo de carga (TTFB) en los dashboards ejecutando llamadas a la base de datos de manera concurrente.

## Instalacion y Configuracion Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/saas-clinicas.git
   cd saas-clinicas
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env.local` basado en el template de seguridad:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_key (solo backend)
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Migraciones de Base de Datos:**
   Ejecuta las migraciones en tu instancia de Supabase utilizando el CLI.
   ```bash
   npx supabase db push
   ```

5. **Iniciar entorno de desarrollo:**
   ```bash
   pnpm run dev
   ```
