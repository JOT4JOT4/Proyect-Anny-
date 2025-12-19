# 🎓 University Curriculum App

Aplicación full-stack para visualizar, simular y optimizar carreras universitarias. Construida con **NestJS** (backend), **React + Vite** (frontend) y **MongoDB** (base de datos).

---

## 📖 Documentación Rápida

👉 **[Ver Guía Completa de Entrega → SETUP.md](./SETUP.md)**

### Inicio Rápido (3 pasos)
```bash
# 1️⃣ Levantar BD
cd backend && docker-compose up -d

# 2️⃣ Backend (terminal 1)
npm install && npm run start:dev

# 3️⃣ Frontend (terminal 2)
cd ../frontend && npm install && npm run dev
```

Accede a: http://localhost:5173 (Frontend) | http://localhost:3000 (Backend API)

### 🧪 Credenciales de Prueba
```
Email: pedro@example.com       | Contraseña: qwerty
Email: maria@example.com      | Contraseña: abcd
Email: ximena@example.com     | Contraseña: qwerty
```

---

## 📁 Estructura del Proyecto

```
university-curriculum-app/
├── backend/                    # 🔧 API NestJS
│   ├── src/
│   │   ├── auth/              # 🔐 Autenticación
│   │   ├── mallas/            # 📚 Lógica de carreras
│   │   ├── users/             # 👥 Gestión de usuarios
│   │   ├── schemas/           # 🗄️ Modelos MongoDB
│   │   └── main.ts
│   ├── mongo-init/            # 🌱 Scripts de seed
│   ├── docker-compose.yml
│   ├── package.json
│   └── .env.example
├── frontend/                   # ⚛️ React + Vite
│   ├── src/
│   │   ├── Curriculum/        # 🎨 Componentes principales
│   │   │   ├── components/    # Subcómponentes
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── styles/        # CSS
│   │   │   └── utils/         # Utilidades
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
└── SETUP.md                   # 📋 Guía de entrega
```

---

## ✨ Características Principales

✅ **Autenticación segura** con email y contraseña  
✅ **Visualización interactiva** de mallas curriculares  
✅ **Simulación académica** con límite de créditos  
✅ **Optimización automática** de planes  
✅ **Gestión de planes guardados** por estudiante  
✅ **Visualización de prerequisitos** en tooltips  
✅ **Filtros avanzados** por estado de curso  
✅ **Datos persistentes** en localStorage + MongoDB  

---

## 🔌 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/login` | Autenticación |
| `GET` | `/mallas/:codigo/:catalogo` | Obtener malla de carrera |
| `GET` | `/mallas/avance?rut=X&codcarrera=Y` | Ver progreso del estudiante |
| `POST` | `/mallas/optimize-plan` | Generar plan optimizado |
| `POST` | `/mallas/save-proyeccion` | Guardar plan |
| `GET` | `/mallas/mis-proyecciones` | Listar planes guardados |
| `DELETE` | `/mallas/proyeccion/:id` | Eliminar plan |

---

## 🚀 Uso en Producción

### Preparar para Entrega
1. Actualizar credenciales en `backend/mongo-init/01-seed.js`
2. Cambiar `LOCAL_AUTH=false` y `LOCAL_MALLAS=false` en `.env`
3. Configurar variables de entorno para APIs externas UCN
4. Ejecutar `npm run build` en frontend
5. Usar servicio de hosting (Heroku, AWS, Azure, etc.)

### Despliegue con Docker (Opcional)
```bash
# Crear imagen del backend
docker build -t curriculum-backend:latest ./backend

# Crear imagen del frontend
docker build -t curriculum-frontend:latest ./frontend

# Usar docker-compose con servicios en producción
```

---

## 📚 Documentación Adicional

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Guía Completa SETUP.md](./SETUP.md)

---

## 🛠️ Tech Stack

| Componente | Tecnología |
|-----------|-----------|
| Backend | NestJS, TypeScript, Mongoose |
| Frontend | React 19, Vite, TypeScript |
| BD | MongoDB 6.0 |
| Gestión BD | Mongo Express |
| Contenerización | Docker, Docker Compose |

---

## 📞 Soporte y Troubleshooting

### ❓ Preguntas Frecuentes
- **"¿Cómo reinicio todo?"** → Ver [SETUP.md - Limpiar y Reiniciar](./SETUP.md#-limpiar-y-reiniciar)
- **"¿Dónde veo los datos de BD?"** → Mongo Express: http://localhost:8081
- **"¿Cómo agrego más usuarios?"** → Editar `backend/mongo-init/01-seed.js` y reiniciar

### 🐛 Troubleshooting Rápido
```bash
# Puerto ocupado
docker rm -f backend-mongo-1

# Problemas de conexión
docker logs backend-mongo-1

# Limpiar todo
docker-compose down -v
```

---

**Versión:** 1.0.0  
**Última actualización:** 18 de Diciembre 2025  
**Estado:** ✅ Listo para Producción
   npm install
   npm run start:dev
   ```


### API Endpoints

The backend provides several API endpoints for managing the curriculum. Refer to the backend README.md for detailed information on available routes and their usage.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

### License

This project is licensed under the MIT License. See the LICENSE file for more details.