# Contratos y mocks

## Alcance

Aplica al cambiar el esquema de movimientos financieros o las fuentes de datos de ejemplo consumidas por el frontend y el backend.

## Justificación

El backend define `FinancialMovement`, `OperationType`, `Category` y `BusinessType` en `backend/app/routes.py`. El frontend mantiene tipos correspondientes en `frontend/src/lib/financial-types.ts`. Además, `frontend/src/App.tsx` obtiene movimientos desde `/api/metrics`, mientras `frontend/src/lib/mock-data.ts` contiene una lista estática separada. `backend/tests/test_routes.py` verifica la forma del contrato HTTP.

## Guía específica

- Al modificar campos o valores permitidos, actualiza las definiciones Pydantic de `backend/app/routes.py` y los tipos de `frontend/src/lib/financial-types.ts` en el mismo cambio.
- Ajusta `test_metrics_endpoint_returns_financial_movement_contract()` en `backend/tests/test_routes.py` cuando cambie la respuesta HTTP; ajusta `frontend/src/lib/financial-utils.test.ts` cuando cambien los cálculos que consumen los movimientos.
- Antes de cambiar o probar una fuente mock, traza el flujo desde `frontend/src/App.tsx` hasta `/api/metrics` o desde el import concreto de `frontend/src/lib/mock-data.ts`; no asumas que los conjuntos coinciden.