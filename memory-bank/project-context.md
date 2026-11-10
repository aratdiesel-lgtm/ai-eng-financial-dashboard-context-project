# Mapa del proyecto por categoría

## Arquitectura

- `frontend/src/App.tsx` solicita `GET /api/metrics`; `frontend/src/lib/financial-utils.ts` calcula KPI y totales mensuales; `frontend/src/components/dashboard/` contiene cabecera, KPI y gráficos.
- `backend/app/routes.py` declara modelos Pydantic, genera datos mock e implementa filtros, agregaciones y endpoints.
- El contrato de movimientos también está definido como tipos TypeScript en `frontend/src/lib/financial-types.ts`.

## Testing

- Pruebas backend: `backend/tests/test_routes.py` (endpoints, contrato de movimientos, estado RNG y CORS). Pruebas de utilidades frontend: `frontend/src/lib/financial-utils.test.ts` (KPI, agrupación mensual y periodo visible).
- Scripts frontend definidos en `frontend/package.json`: `npm test`, `npm run lint`, `npm run build`. Backend: `pytest` desde `backend/`.

## DX y ejecución

- `docker-compose.yml` publica el frontend en `5173`, la API en `8000` y `debugpy` en `5678`.
- `docker-compose.yml` pasa `CORS_ALLOWED_ORIGINS` al backend; el valor predeterminado es `http://localhost:5173`.
- `frontend/vite.config.ts` reenvía `/api` a `backend:8000`; `frontend/src/App.tsx` lee `VITE_API_BASE_URL` para usar otra base.
- Ambos README indican crear `frontend/.env.local` para configurar `VITE_API_BASE_URL`.

## Comportamientos y límites concretos

- Datos/fechas: `backend/app/routes.py` produce 360 movimientos con una instancia local `random.Random(seed)`; el año sigue dependiendo de `date.today()`. `frontend/src/App.tsx` presenta el rango calculado desde los movimientos.
- Seguridad/ejecución: `backend/app/main.py` permite por defecto `http://localhost:5173` y acepta una lista mediante `CORS_ALLOWED_ORIGINS`; `backend/Dockerfile` inicia `debugpy` en `0.0.0.0:5678`, publicado por `docker-compose.yml`.
- `frontend/src/lib/financial-utils.ts` agrupa fechas ISO por el prefijo `YYYY-MM`, evitando conversión a hora local.
- Ver el detalle categorizado y los archivos relacionados en `.agents/rules/project-conventions.md`.