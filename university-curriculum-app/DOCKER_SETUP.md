# 🎓 University Curriculum App - Guía de Entrega con Docker

## 📋 Requisitos Previos

- **Docker** y **Docker Compose** instalados
- Puertos disponibles: `80` (frontend), `3000` (backend), `27017` (MongoDB), `8081` (MongoDB Express)

## 🚀 Inicio Rápido - 1 Solo Comando

### Para Windows:
```bash
START.bat
```

### Para Mac/Linux:
```bash
bash START.sh
```

O ejecuta manualmente:
```bash
docker-compose up -d
```

## 📱 Acceso a la Aplicación

Una vez que los servicios están corriendo:

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Frontend** | http://localhost | - |
| **Backend API** | http://localhost:3000 | - |
| **MongoDB Admin** | http://localhost:8081 | user: `root` / pass: `example` |

## 🛠️ Comandos Útiles

### Ver los servicios en ejecución
```bash
docker-compose ps
```

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Ver logs de un servicio específico
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

### Detener todos los servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes (limpiar base de datos)
```bash
docker-compose down -v
```

### Reconstruir las imágenes (después de cambios en el código)
```bash
docker-compose up -d --build
```

### Reiniciar un servicio específico
```bash
docker-compose restart backend
docker-compose restart frontend
```

## 📁 Estructura del Proyecto

```
university-curriculum-app/
├── backend/
│   ├── Dockerfile (nuevo)
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── src/
├── frontend/
│   ├── Dockerfile (nuevo)
│   ├── nginx.conf (nuevo)
│   ├── .env.example
│   ├── .env
│   └── src/
├── docker-compose.yml (mejorado)
├── START.bat (nuevo - para Windows)
├── START.sh (nuevo - para Mac/Linux)
└── .env.example (nuevo)
```

## 🔧 Configuración

### Variables de Entorno

Los archivos `.env` están preconfigurados para Docker. Si necesitas cambiarlos:

**backend/.env:**
```env
MONGO_URI=mongodb://root:example@mongo:27017/university_curriculum?authSource=admin
PORT=3000
LOCAL_AUTH=true
LOCAL_MALLAS=true
NODE_ENV=production
```

**frontend/.env:**
```env
VITE_API_URL=http://localhost:3000
```

## 🏗️ Arquitectura de Docker

### Servicios incluidos:

1. **MongoDB** (mongo:6.0)
   - Base de datos principal
   - Inicialización automática con seeds desde `mongo-init/01-seed.js`
   - Datos persisten en volumen `mongo-data`

2. **MongoDB Express** (mongo-express:1.0.0)
   - Interfaz web para administrar MongoDB
   - Puerto 8081
   - Acceso: user `root` / password `example`

3. **Backend** (NestJS)
   - Build multi-etapa para optimización
   - Puerto 3000
   - Espera a que MongoDB esté listo antes de iniciar

4. **Frontend** (React + Nginx)
   - Build multi-etapa para optimización
   - Servido por Nginx
   - Proxy automático a Backend para API calls
   - Puerto 80

### Red:
- Todos los servicios están en la red `curriculum-network`
- Los servicios se comunican usando sus nombres (ej: `http://backend:3000`)

## 🐛 Troubleshooting

### Puerto ya en uso
```bash
# Encontrar qué está usando el puerto (Windows PowerShell)
netstat -ano | findstr :80
netstat -ano | findstr :3000
netstat -ano | findstr :27017

# En Mac/Linux
lsof -i :80
lsof -i :3000
lsof -i :27017

# Matar el proceso (Windows)
taskkill /PID <PID> /F

# Matar el proceso (Mac/Linux)
kill -9 <PID>
```

### MongoDB no inicia
```bash
# Limpiar volumen y reiniciar
docker-compose down -v
docker-compose up -d
```

### Frontend no conecta con Backend
- Verifica que backend esté corriendo: `docker-compose ps`
- Revisa los logs: `docker-compose logs backend`
- Asegúrate que `VITE_API_URL=http://localhost:3000` en `frontend/.env`

### Reconstruir todo desde cero
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## 📦 Entrega

Para entregar el proyecto:

1. **Asegurate que todo está commitido en Git:**
   ```bash
   git add .
   git commit -m "Docker setup complete"
   git push
   ```

2. **Verifica que los scripts funcionan:**
   - Windows: `START.bat`
   - Mac/Linux: `bash START.sh`

3. **Prueba en una carpeta limpia:**
   ```bash
   git clone <repo>
   cd university-curriculum-app
   # Windows:
   START.bat
   # Mac/Linux:
   bash START.sh
   ```

4. **Accede a http://localhost y verifica que funciona**

## ✨ Ventajas de esta configuración

✅ **Un solo comando** para levantar todo
✅ **Multi-etapa builds** para imágenes optimizadas
✅ **Health checks** automáticos
✅ **Volúmenes nombrados** para persistencia
✅ **Red privada** segura entre servicios
✅ **Proxy automático** de API
✅ **Logs centralizados**
✅ **Compatible con Windows, Mac y Linux**

---

¿Necesitas ayuda? Revisa los logs con: `docker-compose logs -f`
