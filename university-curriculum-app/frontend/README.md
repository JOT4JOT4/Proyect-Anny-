# Malla Curricular (React + Vite)

Frontend en React para visualizar una malla curricular por semestres y marcar ramos como **aprobados**, **reprobados** o **no cursados**.

## Ejecutar

```bash
npm install
npm run dev
```

Puedes configurar la URL del backend creando un archivo `.env` con:

```
VITE_API_BASE_URL=http://localhost:3000
```

## Endpoints esperados del backend

- `GET /api/malla` → Lista de cursos:
```json
[
  { "id": 1, "codigo": "MAT101", "nombre": "Cálculo I", "creditos": 8, "semestre": 1, "prerrequisitos": [] }
]
```
- `GET /api/estados` → Diccionario `{ [courseId]: "aprobado" | "reprobado" | "pendiente" }`
- `PUT /api/estados/:courseId` → Body: `{ "estado": "aprobado" | "reprobado" | "pendiente" }`

Si el backend no está listo, la app usa mocks locales para poder visualizar y probar.
