# Deployment Guide

## Prerequisites
- Docker and Docker Compose
- Set environment variables (PowerShell example):
```powershell
$env:DRF_SECRET_KEY = "<strong-secret>"
$env:JWT_SECRET = "<strong-secret>"
$env:SALT = "<strong-secret>"
$env:DRF_SERVICE_TOKEN = "<shared-token>"
```

## Build and Run
```bash
docker compose up -d --build
```

## Services
- DRF: http://localhost:8000/api/health/
- API: http://localhost:3000/api/health
- Client: http://localhost:5173

## Configuration
- Node Server (Server)
  - MONGODB_URI: mongodb://mongo:27017/LangSQL
  - CORS_ORIGINS: comma-separated origins (e.g., http://localhost:5173)
  - COOKIE_SECURE=true, COOKIE_SAMESITE=strict (prod)
  - DRF_SERVER_HOST: http://drf:8000/
  - DRF_SERVICE_TOKEN: shared token for DRF calls
- DRF Server (DRF-Server)
  - SECRET_KEY: Django secret key
  - ALLOWED_HOSTS: e.g., * for local compose
  - DB_HOST: mongodb://mongo:27017
  - CORS_ALLOW_ALL=True or set CORS_ALLOWED_ORIGINS

## Notes
- For production, set real domain origins and enable HTTPS; keep COOKIE_SECURE=true.
- If using text-to-SQL, install ML dependencies in the DRF image or a separate service.
- Ensure MySQL target hosts allow connections from the API container (firewall, bind-address, user host).
