# Seguridad y ejecución

## Alcance

Aplica a la configuración de CORS, depuración y puertos al ejecutar o desplegar el backend.

## Justificación

`backend/app/main.py` toma `CORS_ALLOWED_ORIGINS` y usa `http://localhost:5173` como valor local predeterminado. `docker-compose.yml` pasa esa variable al contenedor. `backend/Dockerfile` todavía inicia `debugpy` escuchando en `0.0.0.0:5678`, publicado por `docker-compose.yml`.

## Guía específica

- Antes de desplegar fuera del entorno local, define `CORS_ALLOWED_ORIGINS` con los orígenes exactos separados por comas; el valor predeterminado solo permite `http://localhost:5173`.
- No incluyas `debugpy` ni publiques `5678` en una configuración de despliegue salvo que exista una necesidad explícita y acceso restringido.
- Si cambias puertos o configuración local, actualiza conjuntamente `backend/Dockerfile` y `docker-compose.yml`.