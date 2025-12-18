# ⚛️ Frontend - University Curriculum App

Interfaz interactiva construida con **React 19**, **Vite** y **TypeScript** para visualizar, simular y optimizar carreras universitarias.

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en desarrollo
npm run dev
```

Acceder a: **http://localhost:5173**

---

## 📋 Estructura

```
frontend/
├── src/
│   ├── Curriculum/               # 🎨 Componentes principales
│   │   ├── Curriculum.tsx        # Página principal
│   │   ├── types.ts              # Tipos TypeScript
│   │   ├── components/           # Subcómponentes
│   │   │   ├── CourseCube.tsx           # Tarjeta de curso
│   │   │   ├── CurriculumGrid.tsx       # Grilla de cursos
│   │   │   ├── CurriculumHeader.tsx     # Encabezado
│   │   │   ├── FilterBar.tsx            # Filtros
│   │   │   ├── Login.tsx                # Pantalla login
│   │   │   ├── PrerequisiteToolTip.tsx  # Tooltips
│   │   │   ├── SimulationControls.tsx   # Controles de simulación
│   │   │   └── ToastNotification.tsx    # Notificaciones
│   │   ├── hooks/                # Custom React Hooks
│   │   │   ├── useCourseData.ts         # Procesa datos de cursos
│   │   │   ├── useCurriculumData.ts     # Fetch inicial
│   │   │   ├── useDecorationCourses.ts  # Decora cursos con estado
│   │   │   ├── useOptimization.ts       # Lógica de planes
│   │   │   ├── useSimulation.ts         # Simulador académico
│   │   │   ├── useToast.ts              # Notificaciones
│   │   │   └── useUIState.ts            # Estado UI
│   │   ├── styles/               # CSS
│   │   │   ├── Curriculum.css
│   │   │   └── Login.css
│   │   └── utils/                # Utilidades
│   │       ├── curriculumHelper.ts
│   │       └── Optimizador.ts      # Algoritmo de optimización
│   ├── App.tsx                   # Componente raíz
│   ├── App.css
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Estilos globales
│   └── assets/
├── index.html
├── vite.config.ts
├── package.json
└── .env
```

---

## 🎨 Componentes Principales

### `Login.tsx` - Autenticación
```tsx
- Entrada de email y contraseña
- Validación básica
- Almacenamiento en localStorage
- Redireccionamiento a Curriculum
```

### `Curriculum.tsx` - Página Principal
```tsx
- Visualización de malla curricular
- Selector de carrera
- Filtros de cursos
- Simulación de semestre
- Generador de planes optimizados
```

### `CurriculumGrid.tsx` - Grilla de Cursos
```tsx
- Renderización de cursos por nivel
- Indicadores de estado visual
- Interactividad para simulación
- Tooltips de prerequisitos
```

### Otros Componentes
- **CourseCube** → Tarjeta visual del curso
- **FilterBar** → Filtros y búsqueda
- **SimulationControls** → Controles del simulador
- **PrerequisiteToolTip** → Info de prerequisitos

---

## 🪝 Custom Hooks

### `useCurriculumData()`
Fetch inicial de datos:
- `userData` → Info del usuario desde login
- `mallas` → Mallas de cada carrera
- `avances` → Progreso académico
- `loading`, `error` → Estados de carga

### `useSimulation()`
Simulador de cursos:
- Marcar cursos como "en simulación"
- Validar prerequisitos
- Calcular créditos por semestre
- Gestionar cambios manuales

### `useOptimization()`
Generador de planes:
- `generateOptimization()` → Crear plan automático
- `savePlan()` → Guardar en servidor
- `loadPlan()` → Cargar plan guardado
- `deletePlan()` → Eliminar plan

### `useUIState()`
Estado de la interfaz:
- Filtros activos
- Hover en cursos
- Posición de tooltips

---

## 🔌 Conexión con Backend

### Variables de Entorno (`.env`)
```env
VITE_API_URL=http://localhost:3000
```

### Fetch API Endpoints

#### Login
```typescript
POST /auth/login
Body: { email, password }
```

#### Obtener Malla
```typescript
GET /mallas/:codigo/:catalogo
// Ejemplo: /mallas/8606/202320
```

#### Obtener Avance
```typescript
GET /mallas/avance?rut=RUT&codcarrera=CODIGO
```

#### Optimizar Plan
```typescript
POST /mallas/optimize-plan
Body: { cursos, aprobados, creditLimit, ... }
```

#### Guardar/Cargar/Eliminar Planes
```typescript
POST   /mallas/save-proyeccion
GET    /mallas/mis-proyecciones
GET    /mallas/proyeccion/:id
DELETE /mallas/proyeccion/:id
```

---

## 📦 Scripts

```bash
npm run dev           # Desarrollo con HMR (recomendado)
npm run build         # Compilar para producción
npm run lint          # Linter con ESLint
npm run preview       # Previsualizar build
```

---

## 🎯 Flujo de Usuario

```
Login
  ↓
[Ingresa email/contraseña]
  ↓
[Obtiene RUT y carreras]
  ↓
Curriculum
  ↓
[Selecciona carrera]
  ↓
[Se cargan: Malla + Avance]
  ↓
Opciones:
  ├→ Ver estado actual
  ├→ Simular inscripciones
  ├→ Generar plan optimizado
  ├→ Guardar/cargar planes
  └→ Cerrar sesión
```

---

## 🎨 Características Visuales

### Estados de Cursos
- 🟢 **Aprobado** → Verde
- 🔴 **Reprobado** → Rojo
- 🔵 **Inscrito** → Azul
- ⚪ **No cursado** → Gris
- 🟡 **En simulación** → Amarillo

### Filtros
- Mostrar/ocultar aprobados
- Mostrar/ocultar reprobados
- Mostrar/ocultar inscritos
- Filtrar por nivel/semestre
- Búsqueda por código/nombre

### Interactividad
- Click en curso → Ver detalles
- Hover → Ver prerequisitos
- Simular → Cambiar estado
- Drag & drop (opcional) → Mover cursos

---

## 📱 Responsividad

El diseño se adapta a:
- 📱 Móvil (< 768px)
- 📊 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

---

## 🛠️ Tecnologías

| Librería | Propósito |
|----------|-----------|
| React 19 | Framework UI |
| TypeScript | Tipado estático |
| Vite | Build tool |
| ESLint | Linter |
| CSS3 | Estilos |

---

## 🔐 Autenticación

### localStorage
```javascript
{
  userData: {
    rut: "111111111",
    carreras: [{ codigo, nombre, catalogo }]
  }
}
```

### Logout
```typescript
// Borrar datos
localStorage.removeItem('userData')
// Recargar página
window.location.reload()
```

---

## 🐛 Debugging

### F12 DevTools
- Console → Ver errores de API
- Network → Ver requests al backend
- Application → Ver localStorage

### Logs Útiles
```typescript
console.log('userData:', userData)
console.log('mallas:', mallas)
console.log('avances:', avances)
console.log('simulatedStatus:', simulatedStatus)
```

---

## 📝 Notas de Desarrollo

1. **Hooks de datos** se actualizan automáticamente en cada cambio
2. **localStorage** persiste sesión del usuario
3. **CORS** debe estar habilitado en backend
4. **Vite proxy** redirige `/api/*` a backend en desarrollo

---

## 🚀 Build para Producción

```bash
# Compilar
npm run build

# Previsualizar build
npm run preview

# Desplegar contenido de 'dist/' a hosting
# (Vercel, Netlify, GitHub Pages, etc.)
```

---

**Versión:** 1.0.0  
**Última actualización:** 18 de Diciembre 2025  
**Mantenedor:** Tu Nombre
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
