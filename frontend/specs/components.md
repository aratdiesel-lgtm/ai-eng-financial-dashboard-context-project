# Especificación técnica de componentes UI

## Contratos de referencia

Esta especificación usa [`api-types.ts`](./api-types.ts) y [`param-types.ts`](./param-types.ts) como contratos TypeScript, contrastados con el OpenAPI vivo del backend. Los nombres de campos y query params que se muestran en este documento son los del contrato; las etiquetas visibles pueden ser más legibles, pero no son alias JSON.

## 1. Filtro de rango de fechas

**Componente:** `DateRangeFilterControl`.

**Contratos y estado:**

- El estado de filtro tiene la forma `DateRangeFilter`: `start_date?: string` y `end_date?: string`.
- El componente consulta `GET /api/metrics/facets` y consume `FacetsResponse`. Muestra `min_date` y `max_date` junto a los inputs como límites de fechas disponibles; el formato de ambos es `YYYY-MM-DD`.
- Las fechas seleccionadas se envían como query params `start_date` y `end_date` de `GET /api/metrics`, junto con los filtros de movimiento que correspondan. No se envían fechas a `/api/metrics/facets`, que no declara query params.
- Los inputs representan fechas ISO `YYYY-MM-DD`. Al enviar una selección, cada valor se conserva como string en ese formato.

**Comportamiento:**

- Si un input está vacío, se omite su query param. Si ambos están vacíos, se omiten ambos y se muestran todos los movimientos disponibles para los demás filtros aplicados.
- No se sustituye un input vacío por `min_date` o `max_date`; esos campos solo informan el rango disponible.
- `FacetsResponse.categories`, `operation_types` y `business_types` son las listas válidas de metadatos de filtro. Sus valores conservan los enums definidos en `api-types.ts`.

## 2. Tabla de alertas de anomalías

**Componente:** `AnomalyAlertsTable`.

**Contratos y estado:**

- Los resultados se reciben como `AlertsResponse` (`AlertEntry[]`). Las columnas corresponden a `period`, `outcome_total`, `baseline_average` e `increase_ratio`.
- Los filtros se representan con `AlertsParams`: `threshold?: number`, `group_by?: "day" | "week" | "month"`, `business_type?: BusinessType` y las fechas heredadas de `DateRangeFilter`.
- La carga consulta `GET /api/metrics/alerts`; solo se envían los query params seleccionados. Los valores disponibles para `business_type` proceden de `FacetsResponse.business_types`.

**Control de umbral:**

- El brief pide que el control numérico UI permita `0.01`–`1.0` y comience en `0.3`. Ese rango es una restricción de presentación del control, no una restricción del backend ni del tipo `AlertsParams`.
- OpenAPI define `threshold` como número opcional, con mínimo `0`, default `0.3` y sin máximo declarado. Si el usuario no cambia el valor inicial, se puede omitir el query param para que opere el default del servidor; si lo cambia, se envía `threshold` como número.
- `baseline_average` es el nombre de contrato para la media base. OpenAPI no define un campo `moving_average`. `increase_ratio` es un ratio numérico y no un porcentaje con formato declarado.

**Estado vacío:**

- Cuando `AlertsResponse` sea `[]`, se mantiene visible la tabla, sus encabezados y el mensaje explícito «No hay anomalías para los filtros seleccionados» en su área de contenido.
- No se representan filas ficticias ni se infiere un campo de alerta adicional.

## 3. Vista comparativa B2B vs B2C

**Componentes:** `B2BvsB2CComparisonView` con dos instancias/secciones de `TopCategoriesTable`.

**Contratos y solicitudes:**

- `GET /api/metrics/facets` proporciona `FacetsResponse.business_types` para identificar los valores `B2B` y `B2C`, y `FacetsResponse.categories` para la lista de categorías del contrato.
- Cada sección consulta `GET /api/metrics/categories/top` de forma independiente, una con `business_type: "B2B"` y otra con `business_type: "B2C"`.
- Ambas solicitudes usan `TopCategoriesParams` con `operation_type: "income"` y `limit: 5`; pueden incluir `start_date` y `end_date` si hay rango activo. Se envía `operation_type: "income"` de forma explícita porque el default del endpoint es `"outcome"`.
- Cada respuesta tiene forma `TopCategoriesResponse` (`CategoryEntry[]`). La tabla y la visualización usan exactamente `category`, `operation_type` y `total_amount`.

**Presentación y límites del contrato:**

- En escritorio, se muestran dos secciones paralelas, rotuladas B2B y B2C; en pantallas estrechas pueden apilarse sin cambiar los datos ni los contratos.
- El gráfico comparativo puede presentar barras agrupadas por `category`, con una serie por `business_type` y `total_amount` como valor. Las categorías disponibles para seleccionar o etiquetar provienen de `FacetsResponse.categories`.
- `TopCategoriesResponse` no incluye un campo de porcentaje o `share`; la interfaz no debe esperar ni atribuir ese dato a la respuesta.
- El endpoint devuelve categorías principales limitadas por `limit`; no entrega el total agregado de todos los ingresos de cada segmento. Por tanto, las barras comparan los montos por categoría devueltos, pero no deben etiquetarse como total general de ingresos B2B frente a B2C. Obtener ese total general requiere un contrato de API que lo exponga.