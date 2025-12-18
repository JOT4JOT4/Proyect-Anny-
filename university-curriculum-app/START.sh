#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║     🎓 University Curriculum App - Docker Compose     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Validar Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker no está instalado${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker está instalado${NC}"

# Crear archivos .env si no existen
echo -e "\n${BLUE}Configurando archivos .env...${NC}"

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Creado backend/.env${NC}"
else
    echo -e "${YELLOW}⊘ backend/.env ya existe${NC}"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}✓ Creado frontend/.env${NC}"
else
    echo -e "${YELLOW}⊘ frontend/.env ya existe${NC}"
fi

# Iniciar servicios
echo -e "\n${BLUE}Iniciando servicios con Docker Compose...${NC}"
docker-compose up -d

# Esperar a que los servicios estén listos
echo -e "\n${BLUE}Esperando a que los servicios estén listos...${NC}"
sleep 10

# Verificar estado
echo -e "\n${BLUE}Estado de servicios:${NC}"
docker-compose ps

# Mostrar información de acceso
echo -e "\n${GREEN}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║             ✓ Servicios iniciados exitosamente       ║"
echo "╠════════════════════════════════════════════════════════╣"
echo "║  Frontend:      http://localhost                      ║"
echo "║  Backend:       http://localhost:3000                 ║"
echo "║  MongoDB Admin: http://localhost:8081                 ║"
echo "║                                                        ║"
echo "║  MongoDB Credentials:                                 ║"
echo "║  Usuario: root                                        ║"
echo "║  Contraseña: example                                  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "\n${BLUE}Comandos útiles:${NC}"
echo "  Ver logs:        docker-compose logs -f"
echo "  Detener:         docker-compose down"
echo "  Reconstruir:     docker-compose up -d --build"
echo "  Limpiar todo:    docker-compose down -v"
