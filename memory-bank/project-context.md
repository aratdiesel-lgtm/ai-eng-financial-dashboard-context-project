# Mapa del proyecto por categoría

## Arquitectura

- `frontend/src/App.tsx` solicita `GET /api/metrics`; `frontend/src/lib/financial-utils.ts` calcula KPI y totales mensuales; `frontend/src/components/dashboard/` contiene cabecera, KPI y gráficos.
- `backend/app/routes.py` declara modelos Pydantic, genera datos mock e implementa filtros, agregaciones y endpoints.
- El contrato de movimientos también está definido como tipos TypeScript en `frontend/src/lib/financial-types.ts`.

## Testing

- Pruebas backend: `backend/tests/test_routes.py`. Pruebas de utilidades frontend: `frontend/src/lib/financial-utils.test.ts`.
- Scripts frontend definidos en `frontend/package.json`: `npm test`, `npm run lint`, `npm run build`. Backend: `pytest` desde `backend/`.

## DX y ejecución

- `docker-compose.yml` publica el frontend en `5173`, la API en `8000` y `debugpy` en `5678`.
- `frontend/vite.config.ts` reenvía `/api` a `backend:8000`; `frontend/src/App.tsx` lee `VITE_API_BASE_URL` para usar otra base.
- `README.es.md` referencia `frontend/.env.example`, que no existe en el repositorio.

## Riesgos concretos

- Datos/fechas: `backend/app/routes.py` produce 360 movimientos con semilla `42`, pero el año depende de `date.today()`; `frontend/src/App.tsx` muestra `2024 - Full Year`.
- Seguridad/ejecución: `backend/app/main.py` permite cualquier origen CORS; `backend/Dockerfile` inicia `debugpy` en `0.0.0.0:5678`, publicado por `docker-compose.yml`.
- Ver el detalle categorizado y los archivos relacionados en `.agents/rules/project-conventions.md`.