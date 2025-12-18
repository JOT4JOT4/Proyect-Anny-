@echo off
setlocal enabledelayedexpansion

REM Colors (simulated with output)
echo.
echo ========================================================
echo     University Curriculum App - Docker Compose
echo ========================================================
echo.

REM Validar Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker no está instalado
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Compose no está instalado
    exit /b 1
)

echo [OK] Docker está instalado

REM Crear archivos .env si no existen
echo.
echo Configurando archivos .env...

if not exist "backend\.env" (
    copy backend\.env.example backend\.env
    echo [OK] Creado backend\.env
) else (
    echo [SKIP] backend\.env ya existe
)

if not exist "frontend\.env" (
    copy frontend\.env.example frontend\.env
    echo [OK] Creado frontend\.env
) else (
    echo [SKIP] frontend\.env ya existe
)

REM Iniciar servicios
echo.
echo Iniciando servicios con Docker Compose...
docker-compose up -d

REM Esperar a que los servicios estén listos
echo.
echo Esperando a que los servicios estén listos...
timeout /t 10 /nobreak

REM Verificar estado
echo.
echo Estado de servicios:
docker-compose ps

REM Mostrar información de acceso
echo.
echo ========================================================
echo             Servicios iniciados exitosamente
echo ========================================================
echo.
echo Frontend:      http://localhost
echo Backend:       http://localhost:3000
echo MongoDB Admin: http://localhost:8081
echo.
echo MongoDB Credentials:
echo Usuario: root
echo Contraseña: example
echo.
echo ========================================================
echo.
echo Comandos útiles:
echo   Ver logs:        docker-compose logs -f
echo   Detener:         docker-compose down
echo   Reconstruir:     docker-compose up -d --build
echo   Limpiar todo:    docker-compose down -v
echo.
