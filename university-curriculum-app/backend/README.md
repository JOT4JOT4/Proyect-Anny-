# 🔧 Backend - University Curriculum API

API REST construida con **NestJS** para gestionar datos curriculares, autenticación y optimización de planes académicos.

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar BD (en paralelo)
docker-compose up -d

# 3. Ejecutar en desarrollo (con hot reload)
npm run start:dev
```

Servidor disponible en: **http://localhost:3000**

---

## 📋 Estructura

```
backend/
├── src/
│   ├── auth/                 # 🔐 Autenticación
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── mallas/               # 📚 Currículas y planes
│   │   ├── mallas.controller.ts
│   │   ├── mallas.module.ts
│   │   ├── mallas.service.ts
│   │   └── plan-calculator.util.ts
│   ├── users/                # 👥 Gestión de usuarios
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   ├── schemas/              # 🗄️ Modelos MongoDB
│   │   ├── avance.schema.ts
│   │   ├── course.schema.ts
│   │   ├── credential.schema.ts
│   │   ├── malla.schema.ts
│   │   ├── proyeccion.schema.ts
│   │   └── user.schema.ts
│   ├── app.module.ts         # Módulo principal
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts               # Punto de entrada
├── mongo-init/
│   └── 01-seed.js            # 🌱 Datos iniciales
├── docker-compose.yml
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔌 Endpoints

### 🔐 Autenticación
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "1234"
}

# Response:
{
  "rut": "111111111",
  "carreras": [
    { "codigo": "8606", "nombre": "ICCI", "catalogo": "202320" }
  ]
}
```

### 📚 Mallas Curriculares
```bash
# Obtener malla de una carrera
GET /mallas/8606/202320

# Response: Array de cursos
[
  {
    "codigo": "DCCB-00107",
    "asignatura": "Álgebra I",
    "creditos": 6,
    "nivel": 1,
    "prereq": "DDOC-00102,SSED-00102"
  },
  ...
]
```

### 📊 Avance Académico
```bash
# Obtener cursos aprobados/reprobados
GET /mallas/avance?rut=111111111&codcarrera=8606

# Response:
[
  {
    "nrc": "21943",
    "period": "202320",
    "student": "111111111",
    "course": "ECIN-00704",
    "status": "APROBADO"
  },
  ...
]
```

### 🎯 Optimización y Planes
```bash
# Generar plan optimizado
POST /mallas/optimize-plan
{ "cursos": [...], "aprobados": [...], "creditLimit": 18 }

# Guardar plan
POST /mallas/save-proyeccion
{ "rut": "111111111", "codCarrera": "8606", "nombre": "Mi Plan", "plan": {...} }

# Listar planes guardados
GET /mallas/mis-proyecciones?rut=111111111&codCarrera=8606&sort=date

# Obtener plan específico
GET /mallas/proyeccion/:id

# Eliminar plan
DELETE /mallas/proyeccion/:id
```

### 👥 Usuarios
```bash
# Listar todos los usuarios
GET /users

# Obtener usuario por RUT
GET /users/:rut

# Crear nuevo usuario
POST /users
{ "rut": "555555555", "nombre": "Juan Pérez", "roles": ["student"] }
```

---

## 🗄️ Base de Datos

### Colecciones MongoDB

#### `credentials` - Autenticación
```javascript
{
  email: String,
  password: String,
  rut: String,
  carreras: [
    { codigo: String, nombre: String, catalogo: String }
  ]
}
```

#### `courses` - Catálogo de Cursos
```javascript
{
  codigo: String,
  nombre: String,
  creditos: Number,
  nivel: Number,
  prerequisitos: [String]
}
```

#### `mallas` - Mallas Curriculares
```javascript
{
  carreraKey: String,      // "8606-202320"
  catalogo: String,
  cursos: [String]         // Códigos de cursos
}
```

#### `avances` - Progreso Estudiantil
```javascript
{
  nrc: String,
  period: String,
  student: String,         // RUT
  course: String,          // Código de curso
  status: String,          // APROBADO, REPROBADO
  codcarrera: String
}
```

#### `proyecciones` - Planes Guardados
```javascript
{
  rut: String,
  codCarrera: String,
  nombre: String,
  plan: Object,            // Plan generado
  savedAt: Date
}
```

---

## 📝 Configuración

### `.env`
```env
# MongoDB (Docker)
MONGO_URI=mongodb://root:example@mongo:27017/university_curriculum?authSource=admin

# Puerto
PORT=3000

# Modos de desarrollo
LOCAL_AUTH=true         # Usar credenciales locales para login
LOCAL_MALLAS=true       # Usar mallas/avances de BD
```

### Variables de Entorno
- `MONGO_URI`: Conexión a MongoDB (conecta a contenedor `mongo` si usa Docker)
- `PORT`: Puerto del servidor (default: 3000)
- `LOCAL_AUTH`: Si es `true`, autentica contra BD local (sin APIs externas)
- `LOCAL_MALLAS`: Si es `true`, carga mallas y avances de BD local

---

## 📦 Scripts

```bash
npm run start:dev      # Desarrollo con hot reload (recomendado)
npm run build          # Compilar TypeScript
npm run start          # Ejecutar versión compilada
npm run watch          # Compilar en modo watch
npm run dev            # Alternativa: ts-node-dev
```

---

## 🐳 Docker

### Levantar MongoDB
```bash
docker-compose up -d
```

Esto inicia:
- 🗄️ **MongoDB** en puerto 27017
- 🔍 **Mongo Express** en puerto 8081 (interfaz web)

### Conectarse a MongoDB
```bash
# Via Mongo Express
http://localhost:8081

# Via CLI
docker exec -it backend-mongo-1 mongosh -u root -p example --authenticationDatabase admin

# Desde tu máquina (si no usas Docker)
mongosh "mongodb://root:example@localhost:27017/university_curriculum?authSource=admin"
```

### Limpiar BD
```bash
docker-compose down -v
docker-compose up -d
```

---

## 🧪 Datos de Prueba

El script `mongo-init/01-seed.js` carga automáticamente:

| Email | Contraseña | RUT | Carrera |
|-------|------------|-----|---------|
| juan@example.com | 1234 | 111111111 | ICCI (8606) |
| maria@example.com | abcd | 222222222 | ITI (8266) |
| ximena@example.com | qwerty | 333333333 | EXAMPLE (86161) |

---

## 🚨 Troubleshooting

### ❌ "Cannot connect to MongoDB"
```bash
# Ver logs de Mongo
docker logs backend-mongo-1

# Verificar que esté corriendo
docker ps | grep mongo

# Reiniciar
docker-compose down -v && docker-compose up -d
```

### ❌ "Port 3000 already in use"
```bash
# Cambiar puerto en .env
PORT=3001

# O liberar puerto actual
lsof -i :3000 | grep LISTEN
kill -9 <PID>
```

### ❌ "MODULE_NOT_FOUND"
```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Tecnologías

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| NestJS | ^9.0.0 | Framework API |
| Mongoose | ^7.8.7 | ODM para MongoDB |
| TypeScript | ^4.5.0 | Tipado estático |
| Axios | ^1.12.2 | HTTP client |
| class-validator | ^0.14.2 | Validación de datos |

---

**Versión:** 1.0.0  
**Última actualización:** 18 de Diciembre 2025  
**Mantenedor:** Tu Nombre

### Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License.