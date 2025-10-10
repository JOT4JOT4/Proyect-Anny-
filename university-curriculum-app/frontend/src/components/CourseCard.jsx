import React from 'react'

const EstadoBadge = ({ estado }) => {
  const map = {
    aprobado: { label: 'Aprobado', className: 'badge dark' },
    reprobado: { label: 'Reprobado', className: 'badge dark' },
    pendiente: { label: 'No cursado', className: 'badge' },
  }
  const m = map[estado] || map['pendiente']
  return <span className={m.className}>{m.label}</span>
}

export default function CourseCard({ course, estado, onChange }) {
  const cls = estado === 'aprobado' ? 'approved' : estado === 'reprobado' ? 'failed' : 'pending'
  return (
    <div className={`course ${cls}`}>
      <div className="course-header">
        <span>{course.codigo} • {course.nombre}</span>
        <EstadoBadge estado={estado} />
      </div>
      <div className="meta">
        <span>{course.creditos} créditos</span>
        {course.prerrequisitos?.length ? <span>Pre: {course.prerrequisitos.join(', ')}</span> : null}
      </div>
      <div className="controls">
        <select value={estado} onChange={e => onChange(course.id, e.target.value)}>
          <option value="pendiente">No cursado</option>
          <option value="aprobado">Aprobado</option>
          <option value="reprobado">Reprobado</option>
        </select>
      </div>
    </div>
  )
}
