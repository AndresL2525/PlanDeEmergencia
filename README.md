# Prevención y Plan de Emergencia

Aplicación web académica para gestionar información de prevención de riesgos y generar planes de emergencia familiares personalizados con apoyo de Inteligencia Artificial.

## Descripción

El sistema permite administrar cuatro recursos relacionados entre sí:

1. **Tipos de riesgo**: sismos, inundaciones, incendios, etc.
2. **Protocolos**: acciones antes, durante y después de cada tipo de riesgo.
3. **Elementos del kit**: artículos recomendados para el kit de emergencia.
4. **Planes familiares**: información de cada familia o persona y su plan de emergencia.

A partir de un plan familiar, la aplicación solicita a una API externa de IA un plan de emergencia personalizado y estructurado.

**Flujo de la IA:** React → API Django → API externa de IA → API Django → React.
El frontend nunca se comunica directamente con la IA, y las claves se guardan en variables de entorno (`.env`).

## Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Python, Django, Django REST Framework |
| Documentación API | Swagger |
| Frontend | React, Vite, TypeScript |
| IA | API externa (por definir) |
| Control de versiones | Git |

## Estructura del proyecto

```
PlanDeMejoramiento/
├── backend/        # API REST en Django
├── frontend/       # Aplicación React + Vite + TypeScript
├── docs/
│   └── bitacora/   # Bitácora individual de prompts
├── .gitignore
└── README.md
```

## Requisitos previos

- Python 3.13 o superior
- Node.js 24 o superior
- pnpm
- Git

## Instalación y ejecución

_Se completará a medida que se desarrollen el backend y el frontend._

## Integrantes

- Camilo
- Cristian
- Andrés

## Estado del proyecto

- [x] Paso 1: Estructura inicial del proyecto
- [ ] Backend: modelos y CRUDs
- [ ] Documentación Swagger
- [ ] Frontend: CRUDs
- [ ] Integración con IA
- [ ] Documentación final
