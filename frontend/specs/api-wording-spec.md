# Nota de especificación: equivalencias entre términos del PM y API

## Fuente y regla de traducción

Esta nota concilia el lenguaje de las solicitudes del Product Manager con el contrato publicado por OpenAPI en `http://localhost:8000/docs`. Los términos de negocio pueden usarse como etiquetas de interfaz; en query strings y payloads se usan exclusivamente los nombres y valores enumerados aquí. No se deben tratar las etiquetas de negocio como campos JSON.

## Diccionario

| Término del PM | Traducción al contrato técnico | Aclaración |
| --- | --- | --- |
| Filtro de rango de fechas | Query params opcionales `start_date` y `end_date`, formato `date` (`YYYY-MM-DD`), en `GET /api/metrics`; también están declarados en `/api/metrics/alerts` y `/api/metrics/categories/top`. | `GET /api/metrics/facets` no recibe esos filtros: su respuesta ofrece `min_date` y `max_date` como límites disponibles. El campo de fecha de cada movimiento es `create_date`. |
| Outcome registrado, para un movimiento individual | `FinancialMovement.operation_type = "outcome"` identifica el tipo; `FinancialMovement.amount` contiene el importe numérico. | El esquema no contiene un campo `registered_outcome` ni `outcome` individual como campo de importe. |
| Outcome registrado, en una alerta agregada | `MetricsAlert.outcome_total`. | Es un total por `period`, distinto de `amount` de un movimiento. La respuesta de alerta también incluye `baseline_average` e `increase_ratio`. |
| Tabla de alertas de anomalías | `GET /api/metrics/alerts`; respuesta: array de `MetricsAlert` con `period`, `outcome_total`, `baseline_average` e `increase_ratio`. | El contrato no declara campos booleanos de anomalía, descripción ni etiqueta de severidad. |
| Umbral de anomalía | Query param `threshold` en `GET /api/metrics/alerts`: número, predeterminado `0.3`, mínimo `0` y sin máximo declarado en OpenAPI. | El resultado expresa `increase_ratio`; no renombrar ninguno de los dos campos como porcentaje sin una decisión adicional de producto. |
| Ingresos u outcomes como tipo de operación | Query `operation_type` con valor `income` u `outcome`; en `FinancialMovement`, el campo `operation_type` usa esos mismos valores. | En el endpoint de categorías, el importe agregado se llama `total_amount`, no `income` ni `outcome`. |
| Vista comparativa B2B vs B2C | Query param opcional `business_type` con un valor `B2B` o `B2C` en `GET /api/metrics/categories/top` y `/api/metrics/alerts`; `GET /api/metrics/facets` expone `business_types`. | OpenAPI no define para estas rutas una respuesta combinada o un objeto de comparación B2B/B2C. El esquema de categorías es un array de `TopCategoryItem`: `category`, `operation_type`, `total_amount`. |
| Categorías principales / Top 5 | `GET /api/metrics/categories/top`; `limit` tiene default `5` y rango `1`–`20`; `operation_type` acepta `income` o `outcome` y por defecto es `outcome`. | Cada elemento expone `category`, `operation_type` y `total_amount`; no hay un campo llamado `top_category` ni `rank` en el esquema. |

## Aplicación

- Mantener los identificadores técnicos de OpenAPI en solicitudes y respuestas; las etiquetas del PM son vocabulario de presentación, no alias del contrato.
- Cuando “outcome registrado” se refiera a una fila, usar `operation_type` y `amount`; cuando se refiera al total de una alerta por período, usar `outcome_total`.
- Para la vista B2B/B2C, no documentar una respuesta conjunta inexistente: el contrato expone el filtro `business_type` y las facetas permitidas, pero no un modelo de comparación combinado.