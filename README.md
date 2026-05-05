# SaaS Clínicas — Plataforma de Gestión Médica Multi-tenant

Sistema integral para la automatización y gestión de clínicas médicas, diseñado para ofrecer aislamiento total de datos (multi-tenant) y una experiencia premium tanto para administradores como para pacientes.

## 🚀 Tecnologías (Stack)

- **Frontend:** Next.js 16 (App Router) con TypeScript.
- **Backend:** Supabase (PostgreSQL, Auth, RLS, Storage).
- **Estilos:** Tailwind CSS v4.
- **Despliegue:** Vercel.

## 📋 Características Principales

- **Aislamiento Multi-tenant:** Los datos de cada clínica están protegidos mediante Row Level Security (RLS) a nivel de base de datos.
- **Paneles de Control:** 
  - **Superadmin:** Gestión global de la plataforma y tenants.
  - **Admin:** Gestión completa de la clínica (servicios, horarios, staff, pacientes).
  - **Staff:** Agenda y perfiles de pacientes.
- **Sitio Público:** Portal de reservas personalizado para clientes de cada clínica.

## 🛠️ Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd saas-clinicas
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo `.env.example` a `.env.local` y rellena los valores.
   ```bash
   cp .env.example .env.local
   ```

4. **Iniciar entorno local (Docker requerido):**
   ```bash
   npx supabase start
   ```

5. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## 🔐 Variables de Entorno

El sistema requiere las siguientes variables de entorno para funcionar:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu instancia de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima pública de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (Solo servidor) |
| `NEXT_PUBLIC_SITE_URL` | URL base para redirecciones de Auth |

## 📦 Despliegue (Deploy)

### Vercel
1. Conecta tu repositorio de GitHub a Vercel.
2. Configura las variables de entorno mencionadas anteriormente en el panel de Vercel.
3. El build command es `npm run build`.

### Supabase
1. Crea un nuevo proyecto en Supabase.
2. Ejecuta las migraciones localizadas en `supabase/migrations`.
3. Configura las políticas RLS y los proveedores de Auth (Email/Google) en el dashboard de Supabase.

## 📂 Estructura del Proyecto

- `src/app/`: Rutas y páginas de la aplicación (App Router).
- `src/components/`: Componentes UI reutilizables.
- `src/lib/`: Utilidades, clientes de Supabase y helpers.
- `supabase/`: Migraciones, configuración y seed de la base de datos.
- `docs/`: Documentación técnica e interna.

## 🛡️ Notas de Seguridad

- **RLS (Row Level Security):** Nunca desactivar RLS en producción. Todas las tablas deben tener políticas que validen el `tenant_id`.
- **Claves de Servicio:** La `SUPABASE_SERVICE_ROLE_KEY` jamás debe usarse en el cliente (browser). Solo en Server Actions o rutas de servidor.
- **Validaciones:** Se implementan validaciones tanto en frontend (Zod/HTML5) como en el servidor para garantizar la integridad de los datos.

---
© 2026 SaaS Clínicas. Todos los derechos reservados.
