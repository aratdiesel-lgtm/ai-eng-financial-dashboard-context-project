/** Tipos de operación expuestos por el contrato OpenAPI. */
export type OperationType = "income" | "outcome";

/** Segmentos de negocio expuestos por el contrato OpenAPI. */
export type BusinessType = "B2B" | "B2C";

/** Categorías permitidas por el contrato OpenAPI. */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

/**
 * Respuesta de GET /api/metrics/facets con los valores disponibles para filtros.
 */
export interface FacetsResponse {
  /** Tipos de operación permitidos: income u outcome. */
  operation_types: OperationType[];

  /** Tipos de negocio permitidos: B2B o B2C. */
  business_types: BusinessType[];

  /** Categorías permitidas: suppliers, sales, operational, administrative u others. */
  categories: Category[];

  /** Fecha mínima disponible, representada como fecha ISO YYYY-MM-DD. */
  min_date: string;

  /** Fecha máxima disponible, representada como fecha ISO YYYY-MM-DD. */
  max_date: string;
}

/** Un elemento de la respuesta de GET /api/metrics/alerts. */
export interface AlertEntry {
  /** Etiqueta del período; OpenAPI la define como string sin formato más específico. */
  period: string;

  /** Total de outcomes del período, según el nombre del campo en la API. */
  outcome_total: number;

  /** Promedio base numérico; OpenAPI no declara un campo llamado moving average. */
  baseline_average: number;

  /** Ratio de incremento numérico; la respuesta no incluye un campo percentage. */
  increase_ratio: number;
}

/** Array de alertas devuelto por GET /api/metrics/alerts. */
export type AlertsResponse = AlertEntry[];

/** Un elemento de la respuesta de GET /api/metrics/categories/top. */
export interface CategoryEntry {
  /** Categoría: suppliers, sales, operational, administrative u others. */
  category: Category;

  /** Tipo de operación: income u outcome. */
  operation_type: OperationType;

  /** Monto agregado de la categoría; el esquema no expone un campo share. */
  total_amount: number;
}

/** Array de categorías devuelto por GET /api/metrics/categories/top. */
export type TopCategoriesResponse = CategoryEntry[];