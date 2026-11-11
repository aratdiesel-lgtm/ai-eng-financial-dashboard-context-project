# Contrato de datos del dashboard financiero

Este documento consolida las especificaciones de API y UI para filtro de fechas, alertas y comparativa B2B/B2C. Las rutas y esquemas indicados se verificaron contra el OpenAPI del backend en `http://localhost:8000/docs`. Los tipos de referencia están en [`api-types.ts`](./api-types.ts), [`param-types.ts`](./param-types.ts) y la especificación de componentes en [`components.md`](./components.md).

## 1. Filtro de rango de fechas

### Endpoints

- `GET /api/metrics/facets`: obtiene `FacetsResponse`; no declara parámetros de query.
- `GET /api/metrics`: recibe los filtros de movimientos, incluidos `start_date` y `end_date` opcionales.

### Tipos asociados

- Petición de fechas: `DateRangeFilter` en `param-types.ts` (`start_date?: string`, `end_date?: string`).
- Respuesta de metadatos: `FacetsResponse` en `api-types.ts`, con `min_date`, `max_date`, `categories`, `operation_types` y `business_types`.
- El OpenAPI de `/api/metrics` devuelve movimientos, pero los tipos de especificación actuales no definen una interfaz TypeScript para esa respuesta. No se debe tratar `FacetsResponse` como respuesta de movimientos.

### Parámetros y restricciones

- `start_date` y `end_date` son opcionales; su formato OpenAPI es `string` con formato `date` (`YYYY-MM-DD`).
- `/api/metrics` también admite `category` (`suppliers`, `sales`, `operational`, `administrative`, `others`) y `operation_type` (`income`, `outcome`), ambos opcionales. No declara `business_type` en esta ruta.
- `min_date` y `max_date` de `FacetsResponse` son fechas de referencia disponibles; no son parámetros de `/api/metrics/facets`.

### Casos límite y UI

- **Ambas fechas vacías:** omitir `start_date` y `end_date`; mostrar todos los movimientos que correspondan a los demás filtros. Los inputs permanecen vacíos, no se rellenan con `min_date`/`max_date`.
- **Solo una fecha informada:** enviar únicamente el parámetro correspondiente y dejar el otro omitido. El input vacío debe seguir visible y vacío.
- **Rango fuera de `min_date`/`max_date`:** marcar el input fuera del intervalo disponible y mostrar «Selecciona una fecha entre `min_date` y `max_date`»; no enviar ese rango hasta que sea corregido. Este límite es validación de UI, no una restricción de query declarada por OpenAPI.
- **Fecha inicial posterior a la final:** mostrar «La fecha inicial debe ser anterior o igual a la fecha final» y no enviar la petición hasta corregir el rango. Es una validación de UI; OpenAPI no declara esta regla.

## 2. Alertas de anomalías

### Endpoint

- `GET /api/metrics/alerts` devuelve un array de alertas.

### Tipos asociados

- Parámetros: `AlertsParams` en `param-types.ts`, que extiende `DateRangeFilter` y contiene `threshold`, `group_by` y `business_type`.
- Respuesta: `AlertsResponse` (`AlertEntry[]`) en `api-types.ts`. Cada fila tiene `period`, `outcome_total`, `baseline_average` e `increase_ratio`.

### Parámetros y restricciones

- `threshold` es opcional, de tipo numérico; OpenAPI declara mínimo `0`, default `0.3` y ningún máximo. La interfaz solicitada por producto restringe el control visual a `0.01`–`1.0`, con valor inicial `0.3`; este intervalo UI no debe documentarse como límite del backend.
- `group_by` es opcional y acepta `day`, `week` o `month`; default `month`.
- `start_date`, `end_date` son opcionales con formato `YYYY-MM-DD`; `business_type` es opcional y acepta `B2B` o `B2C`.
- Los nombres reales de respuesta son `baseline_average` e `increase_ratio`. No hay un campo OpenAPI `moving_average` ni un campo separado de porcentaje.

### Casos límite y UI

- **Respuesta vacía (`[]`):** mantener visible la tabla y sus encabezados; mostrar en el cuerpo «No hay anomalías para los filtros seleccionados» y no crear filas ficticias.
- **Umbral fuera del rango del control UI (`0.01`–`1.0`):** mostrar «El umbral debe estar entre 0.01 y 1.0» y no enviar ese valor. El backend declara `threshold >= 0` sin máximo, por lo que la validación del límite superior pertenece a la UI.
- **No se define `moving_average`:** la columna de media debe etiquetarse con el campo real `baseline_average`; no renombrar ni calcular un valor distinto como si viniera de la respuesta.
- **No se define un porcentaje:** mostrar `increase_ratio` como ratio numérico según la decisión de presentación del producto; no agregar símbolo `%` ni cambiarlo a `percentage` como campo de API.

## 3. Comparativa B2B vs B2C

### Endpoints

- `GET /api/metrics/facets`: devuelve los valores de `business_types` y `categories` disponibles.
- `GET /api/metrics/categories/top`: obtiene las categorías principales para un único `business_type` por solicitud.

### Tipos asociados

- Filtros: `TopCategoriesParams` en `param-types.ts`, que extiende `DateRangeFilter` e incluye `operation_type`, `limit` y `business_type`.
- Facetas: `FacetsResponse` en `api-types.ts`.
- Respuesta de cada segmento: `TopCategoriesResponse` (`CategoryEntry[]`) en `api-types.ts`; cada elemento tiene `category`, `operation_type` y `total_amount`.

### Parámetros y restricciones

- Consultar `/api/metrics/categories/top` dos veces: una con `business_type=B2B` y otra con `business_type=B2C`; el parámetro es opcional en OpenAPI y acepta esos dos valores.
- Para la vista solicitada, enviar `operation_type=income` explícitamente. OpenAPI permite `income` u `outcome`, pero el default del endpoint es `outcome`.
- `limit` es opcional, entero entre `1` y `20`, default `5`; la vista pide `limit=5`.
- `start_date` y `end_date` son opcionales y usan formato `YYYY-MM-DD`.
- `FacetsResponse.categories` da el enum de categorías permitido; `TopCategoriesResponse` solo contiene los elementos devueltos por la consulta limitada.

### Casos límite y UI

- **Una respuesta de segmento vacía:** mantener visibles ambas secciones B2B y B2C; en la vacía mostrar «Sin categorías para este segmento y filtros» y conservar la respuesta de la otra sección sin alterarla.
- **Categoría ausente en una respuesta limitada:** no asumir que el monto es cero, porque `limit=5` solo devuelve categorías principales. Si se alinean categorías entre secciones, mostrar «No incluida entre las categorías devueltas» para el segmento sin esa fila, no una barra de valor cero.
- **El esquema no contiene `share`:** no crear ni mostrar una columna de porcentaje de participación basada en `TopCategoriesResponse`; el único importe por fila es `total_amount`.
- **No hay total general por segmento:** el endpoint entrega montos por categoría, no la suma global de ingresos B2B o B2C. El gráfico puede comparar `total_amount` por categoría en dos secciones o series paralelas, pero no titularlo «ingreso total B2B vs B2C» ni presentar una suma general como dato recibido de la API.