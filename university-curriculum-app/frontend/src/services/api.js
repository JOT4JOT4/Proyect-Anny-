const BASE_URL = 'https://puclaro.ucn.cl/eross/avance';

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login.php?email=${email}&password=${password}`);
    if (!response.ok) {
      throw new Error('Error en la autenticación');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

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
