import React, { useEffect, useMemo, useState } from 'react'
import { fetchMalla, fetchEstados, actualizarEstado } from './services/api'
import CourseCard from './components/CourseCard'
import Login from './components/Login'


const groupBySemester = (courses) => {
  const by = {}
  for (const c of courses) {
    by[c.semestre] = by[c.semestre] || []
    by[c.semestre].push(c)
  }
  const semesters = Object.keys(by).sort((a,b)=>Number(a)-Number(b))
  return semesters.map(s => ({ semestre: Number(s), cursos: by[s]}))
}

export default function App() {
  const [courses, setCourses] = useState([])
  const [estadoById, setEstadoById] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('todos')

  useEffect(() => {
    (async () => {
      try {
        // Cargamos malla y estados; si el backend aún no está listo, usamos mock
        let malla
        try {
          malla = await fetchMalla()
        } catch {
          malla = MOCK_MALLA
        }
        setCourses(malla)

        let estados
        try {
          estados = await fetchEstados()
        } catch {
          estados = {}
        }
        setEstadoById(estados)
      } catch (e) {
        setError(e.message || 'Error desconocido')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleChangeEstado = async (courseId, estado) => {
    setEstadoById(prev => ({ ...prev, [courseId]: estado }))
    try {
      await actualizarEstado(courseId, estado)
    } catch {
      // si falla, mantenemos en memoria pero podríamos revertir si quieres
    }
  }

  const semesters = useMemo(() => groupBySemester(courses), [courses])

  const counts = useMemo(() => {
    let a=0,r=0,p=0
    for (const c of courses) {
      const e = estadoById[c.id] || 'pendiente'
      if (e === 'aprobado') a++
      else if (e === 'reprobado') r++
      else p++
    }
    return { aprobados: a, reprobados: r, pendientes: p, total: courses.length }
  }, [courses, estadoById])

  const filtered = (id) => {
    const e = estadoById[id] || 'pendiente'
    if (filter === 'todos') return true
    if (filter === 'aprobado') return e === 'aprobado'
    if (filter === 'reprobado') return e === 'reprobado'
    if (filter === 'pendiente') return e === 'pendiente'
    return true
  }

  if (loading) return <div className="app"><div className="container"><p>Cargando...</p></div></div>
  if (error) console.warn(error)

  return (
    <div className="app">
      <div className="container">
        <nav className="nav">
          <div className="brand">Universidad · Malla Curricular</div>
          <div className="summary">
            <span className="tag">Total: {counts.total}</span>
            <span className="tag">Aprobados: {counts.aprobados}</span>
            <span className="tag">Reprobados: {counts.reprobados}</span>
            <span className="tag">No cursados: {counts.pendientes}</span>
          </div>
          <div className="filterbar">
            <label>Filtrar:</label>
            <select value={filter} onChange={e=>setFilter(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="aprobado">Aprobados</option>
              <option value="reprobado">Reprobados</option>
              <option value="pendiente">No cursados</option>
            </select>
          </div>
        </nav>

        <div className="grid">
          {semesters.map(({ semestre, cursos }) => (
            <div key={semestre} className="column">
              <div className="semester-title">Semestre {semestre}</div>
              <div className="column-body" style={{display:'flex',flexDirection:'column',gap:8}}>
                {cursos.filter(c=>filtered(c.id)).map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    estado={estadoById[course.id] || 'pendiente'}
                    onChange={handleChangeEstado}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <footer>
          <span>© {new Date().getFullYear()} · Malla Curricular</span>
          <span>API: <code>{import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}</code></span>
        </footer>
      </div>
    </div>
  )
}

// Mocks de ejemplo para desarrollo sin backend
const MOCK_MALLA = [
  { id: 1, codigo: 'MAT101', nombre: 'Cálculo I', creditos: 8, semestre: 1, prerrequisitos: [] },
  { id: 2, codigo: 'INF100', nombre: 'Programación I', creditos: 6, semestre: 1, prerrequisitos: [] },
  { id: 3, codigo: 'FIS101', nombre: 'Física I', creditos: 6, semestre: 1, prerrequisitos: [] },
  { id: 4, codigo: 'MAT102', nombre: 'Cálculo II', creditos: 8, semestre: 2, prerrequisitos: ['MAT101'] },
  { id: 5, codigo: 'INF200', nombre: 'Estructuras de Datos', creditos: 6, semestre: 2, prerrequisitos: ['INF100'] },
  { id: 6, codigo: 'HUM110', nombre: 'Comunicación Efectiva', creditos: 4, semestre: 2, prerrequisitos: [] },
  { id: 7, codigo: 'BD201', nombre: 'Bases de Datos', creditos: 6, semestre: 3, prerrequisitos: ['INF200'] },
  { id: 8, codigo: 'SIS210', nombre: 'Sistemas Operativos', creditos: 6, semestre: 3, prerrequisitos: ['INF200'] },
  { id: 9, codigo: 'PRO300', nombre: 'Ingeniería de Software', creditos: 6, semestre: 4, prerrequisitos: ['BD201'] },
]
