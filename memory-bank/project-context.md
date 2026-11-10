# Memoria del repositorio

Este documento separa hechos verificables de propuestas. No atribuir al producto capacidades, usuarios, integraciones o planes que no estén demostrados por los archivos citados.

## 1. Overview del producto

### Hechos del repositorio

- `README.es.md` describe el proyecto como un dashboard de métricas financieras con frontend React + TypeScript y backend FastAPI.
- `frontend/src/App.tsx` solicita `GET /api/metrics`, calcula KPI y agregados mensuales, y muestra tarjetas y gráficos de ingresos/resultados.
- `backend/app/routes.py` expone movimientos, facets, resúmenes, categorías principales, comparaciones y alertas; también tiene endpoints B2B/B2C.
- Los movimientos de la API son datos generados: `generate_mock_movements()` crea 360 registros sintéticos con semilla `42`. No hay integración con cuentas bancarias ni persistencia en la implementación inspeccionada (`backend/app/routes.py`, `backend/requirements.txt`).

### Límite de las afirmaciones

El código prueba que existe un dashboard demo y una API de métricas con datos mock. No prueba que procese transacciones reales, se conecte con bancos, tenga usuarios/autenticación, almacene información, o esté desplegado como servicio. No se encontró un archivo de roadmap o plan de producto en el repositorio; no presentar funcionalidades futuras como comprometidas.

## 2. Stack tecnológico

### Lenguajes y frameworks

- **Backend:** Python 3.13 (`backend/Dockerfile`), FastAPI y modelos Pydantic (`backend/requirements.txt`, `backend/app/main.py`, `backend/app/routes.py`). Uvicorn sirve la aplicación (`backend/requirements.txt`, `backend/Dockerfile`).
- **Frontend:** TypeScript 6 y React/React DOM 19 (`frontend/package.json`); Vite 8 es el servidor de desarrollo y build (`frontend/package.json`, `frontend/vite.config.ts`).

### Dependencias clave

- **Visualización/UI:** Recharts, lucide-react, Tailwind CSS 4 y `@tailwindcss/vite` (`frontend/package.json`, `frontend/vite.config.ts`).
- **Utilidades UI:** `class-variance-authority`, `clsx` y `tailwind-merge` (`frontend/package.json`).
- **Pruebas/calidad:** Vitest y ESLint en frontend (`frontend/package.json`); pytest y pytest-cov en backend (`backend/requirements.txt`).
- **Depuración backend:** debugpy aparece como dependencia y se inicia desde `backend/Dockerfile` (`backend/requirements.txt`, `backend/Dockerfile`).

### Infraestructura y tooling

- `docker-compose.yml` construye y ejecuta frontend y backend; publica `5173`, `8000` y `5678`.
- `frontend/vite.config.ts` reenvía `/api` a `http://backend:8000` y define el alias `@` a `frontend/src`.
- `backend/Dockerfile` usa `python:3.13-slim`; `frontend/Dockerfile` usa `node:24-alpine`.
- `frontend/package.json` define `npm run dev`, `npm test`, `npm run lint` y `npm run build`. Las pruebas backend se ejecutan con `pytest` desde `backend/`.
- `CORS_ALLOWED_ORIGINS` se pasa desde `docker-compose.yml`; el valor predeterminado del backend es `http://localhost:5173` (`backend/app/main.py`).

## 3. Estado actual

Estado deducido de la implementación inspeccionada; no equivale a una verificación de despliegue o producción.

### Funciona según el código

- `GET /api/metrics` sirve movimientos mock y admite filtros de fecha, categoría y tipo de operación (`backend/app/routes.py`).
- La API implementa endpoints para health, facets, resumen por periodo, categorías top, comparación, alertas y segmentos B2B/B2C (`backend/app/routes.py`).
- El dashboard carga `/api/metrics`, calcula ingresos, gastos, beneficio, porcentaje y agregados mensuales (`frontend/src/App.tsx`, `frontend/src/lib/financial-utils.ts`). El periodo de cabecera se deriva de las fechas devueltas por la API (`frontend/src/lib/financial-utils.ts`).
- Hay pruebas de endpoints en `backend/tests/test_routes.py` y de utilidades financieras en `frontend/src/lib/financial-utils.test.ts`.

### Gaps conocidos

- La API usa registros sintéticos; no se observa almacenamiento ni fuente de datos externa (`backend/app/routes.py`, `backend/requirements.txt`).
- Las pruebas frontend cubren utilidades, no la carga HTTP ni los estados de carga/error de `frontend/src/App.tsx` (`frontend/src/lib/financial-utils.test.ts`, `frontend/src/App.tsx`).
- El Dockerfile backend inicia `debugpy` en `0.0.0.0:5678` y Uvicorn con `--reload`; Compose publica `5678` (`backend/Dockerfile`, `docker-compose.yml`). Esta configuración corresponde a desarrollo y requiere revisión antes de exposición no local.
- En esta sesión no se completó la ejecución de tests: `pytest` no pudo importar `fastapi`; Vitest no estaba instalado y `npm install` falló por permisos en `frontend/node_modules`. Esto describe el entorno de validación actual, no demuestra que las suites fallen cuando las dependencias están instaladas.

### Prioridades de mantenimiento sugeridas

Estas prioridades se derivan de los gaps anteriores; no son un roadmap aprobado:

1. Ejecutar backend y frontend tests en un entorno con dependencias instaladas y corregir cualquier fallo observado (`backend/requirements.txt`, `frontend/package.json`).
2. Añadir pruebas del fetch y estados de carga/error del dashboard (`frontend/src/App.tsx`), hoy no cubiertos por `frontend/src/lib/financial-utils.test.ts`.
3. Separar configuración de desarrollo y despliegue para que `debugpy`, `--reload` y el puerto `5678` no queden expuestos fuera del entorno local (`backend/Dockerfile`, `docker-compose.yml`).
4. Antes de afirmar soporte para datos reales o persistencia, definir e implementar una fuente de datos verificable; hoy los endpoints generan mocks (`backend/app/routes.py`).

## Referencias de trabajo

- Reglas propuestas, cada una con alcance y evidencia: `.agents/rules/`.
- Arquitectura y comandos locales documentados: `README.es.md`, `docker-compose.yml`, `frontend/package.json`, `backend/requirements.txt`.