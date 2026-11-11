# Registro de verificación

## Qué se verificó
Mapeo completo de la estructura del proyecto (backend + frontend) contrastado con el código.

## Discrepancias encontradas (2)

| # | Archivo | Afirmación | Realidad | Corregido |
|---|------|---------|--------|-------|
| 1 | `frontend/src/components/ui/card.tsx` | Variantes de Card: Header, Title, Description, Content, Action | También exporta **CardFooter** | ✅ |
| 2 | `frontend/src/lib/mock-data.ts` | 60 movimientos (5/mes × 12) | **57 movimientos** (junio, agosto y octubre tienen 4 cada uno) | ✅ |

## Seguimiento (2026-11-11)
- Se revisaron los contratos OpenAPI en vivo y el uso de fetch en frontend; las equivalencias entre términos del PM y la API quedaron documentadas en `frontend/specs/api-wording-spec.md`.
- No se modificaron archivos de implementación del frontend/backend ni se instalaron dependencias.

## Resultado
- ✅ Correctas: 69/71 verificaciones
- 🛠️ Discrepancias corregidas: 2
- ❌ Errores: 0