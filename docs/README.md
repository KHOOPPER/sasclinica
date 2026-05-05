# Documentación Técnica — SaaS Clínicas

Esta carpeta contiene la documentación técnica del proyecto **SaaS Clínicas**.

---

## Índice

| Documento | Contenido |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Visión general, stack, módulos, estructura de carpetas y decisiones técnicas |
| [DATABASE.md](./DATABASE.md) | Esquema de tablas, migraciones, RLS y acceso a Supabase |
| [AUTH.md](./AUTH.md) | Flujo de autenticación, roles, clientes de Supabase y variables de entorno |
| [SECURITY.md](./SECURITY.md) | Riesgos pendientes con análisis de impacto y correcciones propuestas |
| [MAINTENANCE.md](./MAINTENANCE.md) | Checklist operativo de mantenimiento, despliegue y deuda técnica |

---

## Documentos en la Raíz

| Archivo | Propósito |
|---|---|
| `README.md` | Introducción técnica, stack, entorno local y referencia rápida |
| `SKILL.md` | Guía operativa permanente — reglas, fases y disciplina de trabajo |

---

## Estado del Proyecto

- **Completitud:** ~90%
- **Entorno:** Desplegado en Vercel (producción activa)
- **Base de datos:** Supabase (54 migraciones aplicadas)
- **Última fase de hardening:** 2026-04-01

> Para la guía operativa de desarrollo, ver siempre `SKILL.md` primero.
