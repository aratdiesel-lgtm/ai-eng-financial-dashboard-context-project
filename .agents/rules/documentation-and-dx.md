# Documentación y experiencia de desarrollo

## Alcance

Aplica a instrucciones de configuración local y documentación de variables de entorno del frontend.

## Justificación

`frontend/src/App.tsx` lee `VITE_API_BASE_URL`, y Vite carga configuración local desde `frontend/.env.local`. `frontend/vite.config.ts` configura el proxy `/api` hacia `backend:8000` cuando no se especifica otra base.

## Guía específica

- Para apuntar a otro backend, indica crear `frontend/.env.local` y definir `VITE_API_BASE_URL`; no indiques copiar un archivo de ejemplo que no está versionado.
- Si cambia `VITE_API_BASE_URL` o el proxy de desarrollo, actualiza conjuntamente `frontend/src/App.tsx`, `frontend/vite.config.ts` y las instrucciones de `README.es.md` y `README.md`.
- Comprueba que toda ruta de configuración documentada existe en el repositorio antes de darla por válida.