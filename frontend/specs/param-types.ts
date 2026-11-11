import type { BusinessType, OperationType } from "./api-types";

/** Filtros opcionales de fecha compartidos por los endpoints analíticos. */
export interface DateRangeFilter {
  /** Fecha inicial opcional como string ISO YYYY-MM-DD. */
  start_date?: string;

  /** Fecha final opcional como string ISO YYYY-MM-DD. */
  end_date?: string;
}

/** Parámetros de query admitidos por GET /api/metrics/alerts. */
export interface AlertsParams extends DateRangeFilter {
  /** Umbral numérico; mínimo 0, default 0.3 y sin máximo declarado en OpenAPI. */
  threshold?: number;

  /** Agrupación temporal permitida; default month. */
  group_by?: "day" | "week" | "month";

  /** Filtro opcional de segmento de negocio: B2B o B2C. */
  business_type?: BusinessType;
}

/** Parámetros de query admitidos por GET /api/metrics/categories/top. */
export interface TopCategoriesParams extends DateRangeFilter {
  /** Tipo de operación permitido; default outcome. */
  operation_type?: OperationType;

  /** Cantidad máxima de categorías; entero entre 1 y 20, default 5. */
  limit?: number;

  /** Filtro opcional de segmento de negocio: B2B o B2C. */
  business_type?: BusinessType;
}