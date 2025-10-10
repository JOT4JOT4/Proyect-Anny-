const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export async function fetchMalla() {
  const res = await fetch(`${BASE_URL}/api/malla`, { credentials: 'include' })
  if (!res.ok) throw new Error('Error cargando malla')
  return res.json()
}

export async function fetchEstados() {
  const res = await fetch(`${BASE_URL}/api/estados`, { credentials: 'include' })
  if (!res.ok) throw new Error('Error cargando estados')
  return res.json()
}

export async function actualizarEstado(courseId, estado) {
  const res = await fetch(`${BASE_URL}/api/estados/${courseId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ estado })
  })
  if (!res.ok) throw new Error('No se pudo actualizar el estado')
  return res.json()
}
