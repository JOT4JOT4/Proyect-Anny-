# 📚 University Curriculum App - Guía de Entrega

Aplicación completa para visualizar, simular y optimizar carreras universitarias con frontend React + Vite y backend NestJS + MongoDB.

---

## Inicio Rápido

### Requisitos Previos
- **Docker** y **Docker Compose** instalados
- **Node.js** (v16+) y **npm**
- Puerto **3000** (backend), **5173** (frontend) y **27017** (MongoDB) disponibles

### Pasos para Ejecutar

#### 1 Clonar y Preparar

```bash
cd project-folder
# Copiar archivos de configuración
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

#### 2️ Levantar Base de Datos con Docker

```bash
cd backend
docker-compose up -d
```

**Esto inicia:**
- 🗄️ **MongoDB** (puerto 27017) con datos de prueba precargados
- 🔍 **Mongo Express** (http://localhost:8081) para ver la BD visualmente

Esperar 10-15 segundos para que Mongo esté listo.

#### 3️⃣ Instalar Dependencias y Levantar Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend estará disponible en: **http://localhost:3000**

#### 4 Levantar Frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend estará disponible en: **http://localhost:5173**

---

## Credenciales de Prueba

La aplicación viene precargada con 3 usuarios de ejemplo. Usa cualquiera:

| Email | Contraseña | RUT | Carreras |
|-------|------------|-----|----------|
| `pedro@example.com` | `1234` | 111111111 | ICCI (8606) |
| `maria@example.com` | `abcd` | 222222222 | ITI (8266) |
| `ximena@example.com` | `qwerty` | 333333333 | EXAMPLE (86161) |

---

## Funcionalidades Principales

### Login
- Acceso seguro con email y contraseña
- Visualización de carreras asociadas al usuario
- Persistencia de sesión en localStorage

### Malla Curricular
- Vista completa de cursos organizados por nivel/semestre
- Filtrado por estado (Aprobado, Reprobado, Inscrito)
- Visualización de prerequisitos en tooltips interactivos

### Simulación
- Simular inscripción/reprobación de cursos
- Límite de créditos por semestre configurable
- Visualización en tiempo real del impacto

### Optimización
- Generar planes académicos optimizados automáticamente
- Guardar múltiples planes por carrera
- Cargar/eliminar planes guardados
- Ordenar planes por fecha o alfabéticamente

---

## Endpoints Disponibles

### Autenticación
```
POST   /auth/login
  Body: { "email": "pedro@example.com", "password": "1234" }
  Response: { "rut": "111111111", "carreras": [...] }
```

### Malla Curricular
```
GET    /mallas/:codigo/:catalogo
  Ejemplo: /mallas/8606/202320
  Response: [{ codigo, asignatura, creditos, nivel, prereq }, ...]

GET    /mallas/avance?rut=RUT&codcarrera=CODIGO
  Ejemplo: /mallas/avance?rut=111111111&codcarrera=8606
  Response: [{ nrc, period, student, course, status, ... }, ...]
```

### Proyecciones (Planes Guardados)
```
POST   /mallas/optimize-plan
  Body: { cursos, aprobados, creditLimit, ... }
  Response: { plan optimizado }

POST   /mallas/save-proyeccion
  Body: { rut, codCarrera, nombre, plan, id? }
  Response: { id, savedAt }

GET    /mallas/mis-proyecciones?rut=RUT&codCarrera=CODIGO&sort=date
  Response: [{ id, nombre, savedAt }, ...]

GET    /mallas/proyeccion/:id
  Response: { id, nombre, plan, ... }

DELETE /mallas/proyeccion/:id
  Response: { success: true }
```

### Usuarios
```
GET    /users
GET    /users/:rut
POST   /users
  Body: { rut, nombre, roles?, ... }
```

---

## Base de Datos

### Colecciones Pobladas
- **credentials**: Usuarios de prueba (email, contraseña, rut, carreras)
- **courses**: Catálogo de cursos (código, nombre, créditos, nivel, prerequisitos)
- **mallas**: Mallas curriculares por carrera/catálogo
- **avances**: Registro de cursos aprobados/reprobados por estudiante
- **proyecciones**: Planes académicos guardados

### Acceder a MongoDB directamente
```bash
# Desde la terminal, acceder a mongo-express
# URL: http://localhost:8081
# Usuario/Contraseña: admin/pass

# O por CLI:
docker exec -it backend-mongo-1 mongosh -u root -p example --authenticationDatabase admin
```

---

## Configuración

### Backend (`backend/.env`)
```env
# MongoDB
MONGO_URI=mongodb://root:example@mongo:27017/university_curriculum?authSource=admin

# Puerto
PORT=3000

# Modos de desarrollo (usar BD local en lugar de APIs externas)
LOCAL_AUTH=true        # Usar credenciales de BD para login
LOCAL_MALLAS=true      # Usar mallas/avances de BD
```

### Frontend (`frontend/.env`)
```env
# URL del Backend
VITE_API_URL=http://localhost:3000
```

---

## Limpiar y Reiniciar

### Detener todo
```bash
docker-compose down
# Terminar procesos de Node (Ctrl+C en las terminales)
```

### Limpiar volúmenes (borrar datos de BD)
```bash
cd backend
docker-compose down -v
```

### Reiniciar completamente
```bash
docker-compose down -v
docker-compose up -d
# Esperar 15 segundos
cd ../backend
npm run start:dev
# En otra terminal
cd frontend
npm run dev
```

---

## Notas para el Desarrollador

### Estructura del Proyecto
```
university-curriculum-app/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── auth/              # Autenticación
│   │   ├── mallas/            # Lógica de carreras
│   │   ├── users/             # Gestión de usuarios
│   │   └── schemas/           # Modelos MongoDB
│   ├── mongo-init/            # Scripts de seed
│   ├── docker-compose.yml
│   └── .env
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── Curriculum/        # Componentes principales
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── .env
└── SETUP.md                   # Este archivo
```

### Flags de Desarrollo
- `LOCAL_AUTH=true` → Login autenticado contra BD local (no APIs externas)
- `LOCAL_MALLAS=true` → Mallas y avances desde BD local

En producción, establece ambos en `false` para usar APIs externas UCN.

### Agregar Más Datos de Prueba

Editar `backend/mongo-init/01-seed.js`:
```javascript
// Agregar nuevo usuario
db.getSiblingDB(dbName).credentials.insertOne({
  email: 'nuevo@example.com',
  password: 'password123',
  rut: '444444444',
  carreras: [
    { codigo: '8606', nombre: 'ICCI', catalogo: '202320' }
  ]
});
```

Luego:
```bash
docker-compose down -v
docker-compose up -d
```

---

## Troubleshooting

### Error: "Port 27017 already in use"
```bash
# Listar contenedores
docker ps -a

# Eliminar mongo anterior
docker rm -f backend-mongo-1

# Relanzar
docker-compose up -d
```

### "Cannot connect to backend"
- Verificar que backend esté corriendo: `npm run start:dev` en `backend/`
- Revisar que `LOCAL_AUTH=true` en `.env`
- Esperar 15 segundos después de `docker-compose up -d`

### "Login falla"
- Usar credenciales exactas de la tabla arriba
- Verificar `LOCAL_AUTH=true` en `backend/.env`
- Ver logs de Mongo: `docker logs backend-mongo-1`

### Frontend no conecta con backend
- Verificar `VITE_API_URL=http://localhost:3000` en `frontend/.env`
- Revisar que backend esté corriendo en puerto 3000
- Limpiar cache del navegador (F12 → Application → Clear storage)

---

**Fecha:** 18 de Diciembre 2025  
**Versión:** 1.0.0  
**Estado:** ✅ Listo para Producción
