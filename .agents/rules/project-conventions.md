# Reglas propuestas para el proyecto

Cada regla incluye el hecho del repositorio que la justifica.

## Arquitectura y contratos

### Regla: sincronizar el contrato frontend/backend

Al cambiar campos o valores permitidos de movimientos, actualizar el modelo Pydantic y los tipos TypeScript en el mismo cambio, y ajustar las pruebas afectadas.

**Hecho del repo:** `backend/app/routes.py` define `FinancialMovement`, `OperationType`, `Category` y `BusinessType`; `frontend/src/lib/financial-types.ts` mantiene definiciones correspondientes por separado.

### Regla: no asumir que los mocks son intercambiables

Al probar o modificar datos financieros, identifica explícitamente cuál fuente mock consume el flujo; no uses los datos del frontend como si fueran los que sirve la API.

**Hecho del repo:** los endpoints en `backend/app/routes.py` generan movimientos con semilla `42`, mientras `frontend/src/lib/mock-data.ts` contiene una lista estática distinta.

## Datos y fechas

### Regla: aislar el estado aleatorio

No inicializar el generador aleatorio global desde funciones de generación de datos; usa un generador local para evitar modificar el estado aleatorio del proceso.

**Hecho del repo:** `generate_mock_movements()` en `backend/app/routes.py` llama a `random.seed(seed)`, que cambia el estado global del módulo `random`.

### Regla: mantener el periodo visible consistente con los datos

Derivar el periodo mostrado desde las fechas servidas o fijar explícitamente el intervalo del conjunto demo; no mostrar un año fijo junto a datos cuyo año cambia con la fecha actual.

**Hecho del repo:** `_year_for_month()` en `backend/app/routes.py` usa `date.today()`, mientras `frontend/src/App.tsx` pasa `2024 - Full Year` a `frontend/src/components/dashboard/dashboard-header.tsx`.

### Regla: tratar `YYYY-MM-DD` como fecha civil al agrupar

Al convertir fechas ISO sin hora a meses, evitar una conversión UTC seguida de getters locales; cubrir con pruebas una fecha de primer día de mes en más de una zona horaria.

**Hecho del repo:** `computeMonthlyData()` en `frontend/src/lib/financial-utils.ts` ejecuta `new Date(m.create_date)` y obtiene año/mes con `getFullYear()` y `getMonth()`.

## Seguridad y ejecución

### Regla: restringir CORS y depuración antes de desplegar

En despliegues no locales, configura orígenes CORS explícitos y no publiques el puerto del depurador salvo que esté protegido y sea necesario.

**Hecho del repo:** `backend/app/main.py` configura `allow_origins=["*"]` con credenciales; `backend/Dockerfile` inicia `debugpy` en `0.0.0.0:5678` y `docker-compose.yml` publica el puerto `5678`.

## Testing

### Regla: probar el flujo que se modifica

Al cambiar el fetch o los estados de carga/error, añade pruebas de ese flujo; al cambiar cálculos, extiende las pruebas unitarias existentes.

**Hecho del repo:** `frontend/src/lib/financial-utils.test.ts` prueba utilidades, pero no cubre `fetchFinancialData()` ni los estados de `frontend/src/App.tsx`.

### Regla: usar los comandos de validación existentes

Ejecuta `npm test`, `npm run lint` y `npm run build` para cambios frontend pertinentes; ejecuta `pytest` desde `backend/` para cambios backend.

**Hecho del repo:** los tres scripts frontend están declarados en `frontend/package.json`; las pruebas backend están en `backend/tests/test_routes.py` y `pytest` figura en `backend/requirements.txt`.

## Documentación y DX

### Regla: mantener las instrucciones de configuración ejecutables

Antes de indicar que se copie un archivo de entorno, confirma que existe; si no existe, actualiza la instrucción o añade el archivo de ejemplo correspondiente.

**Hecho del repo:** `README.es.md` indica copiar `frontend/.env.example`, pero el archivo no existe; `frontend/src/App.tsx` lee `VITE_API_BASE_URL` y `frontend/vite.config.ts` configura el proxy `/api` a `backend:8000`.