# Fechas y periodos

## Alcance

Aplica al generar movimientos, presentar el intervalo del dashboard y agrupar fechas ISO por día, semana o mes.

## Justificación

`generate_mock_movements()` en `backend/app/routes.py` usa una instancia local `random.Random(seed)`. `_year_for_month()` asigna años usando `date.today()`, y `frontend/src/App.tsx` obtiene el periodo visible con `formatMovementPeriod()` a partir de las fechas recibidas. `computeMonthlyData()` en `frontend/src/lib/financial-utils.ts` agrupa por los primeros siete caracteres de `create_date` (`YYYY-MM`).

## Guía específica

- Conserva la instancia local de `random.Random` en `generate_mock_movements()`; no la sustituyas por `random.seed()` ni por llamadas al generador global.
- Mantén el periodo del encabezado sincronizado con las fechas que entrega `GET /api/metrics`, o fija explícitamente el intervalo del dataset demo.
- Al agrupar `create_date` (`YYYY-MM-DD`), usa el año-mes ISO sin convertirlo a una fecha local. `frontend/src/lib/financial-utils.test.ts` debe conservar un caso con fecha del día 1 del mes.
- Mantén la prueba de aislamiento del estado aleatorio en `backend/tests/test_routes.py` junto con los casos del generador.