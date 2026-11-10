# Testing

## Alcance

Aplica al modificar cálculos financieros, endpoints, carga de datos o estados visibles del dashboard.

## Justificación

`frontend/src/lib/financial-utils.test.ts` cubre cálculos, fechas y formateadores, pero no `fetchFinancialData()` ni los estados de carga y error de `frontend/src/App.tsx`. `backend/tests/test_routes.py` cubre endpoints, forma del contrato de movimientos, aislamiento del estado aleatorio y CORS. `frontend/package.json` declara los scripts `test`, `lint` y `build`; `backend/requirements.txt` incluye `pytest`.

## Guía específica

- Al cambiar cálculos KPI, agrupaciones mensuales o el rango mostrado, añade o ajusta casos en `frontend/src/lib/financial-utils.test.ts`.
- Al cambiar parámetros, respuestas, generación de datos o CORS, añade o ajusta pruebas en `backend/tests/test_routes.py`.
- Al cambiar el fetch o los estados de carga/error, cubre ese flujo de `frontend/src/App.tsx`; las pruebas actuales de utilidades no lo ejercitan.
- Valida cambios frontend con `npm test`, `npm run lint` y `npm run build` desde `frontend/`; valida cambios backend con `pytest` desde `backend/`.