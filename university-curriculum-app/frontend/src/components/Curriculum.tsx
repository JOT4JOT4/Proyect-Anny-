import React, { useEffect, useState } from 'react';

interface Carrera {
  codigo: string;
  nombre: string;
  catalogo: string;
}

interface UserData {
  rut: string;
  carreras: Carrera[];
}

const Curriculum: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mallas, setMallas] = useState<Record<string, any[]>>({});
  const [avances, setAvances] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('userData');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as UserData;
      setUserData(parsed);
    } catch (err) {
      console.error('Invalid userData in localStorage', err);
    }
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      if (!userData) return;
      setLoading(true);
      setError(null);
      try {
        const newMallas: Record<string, any[]> = {};
        const newAvances: Record<string, any[]> = {};

        for (const carrera of userData.carreras) {
          const key = `${carrera.codigo}-${carrera.catalogo}`;
          // Fetch malla
          try {
            const res = await fetch(`http://localhost:3000/mallas/${carrera.codigo}/${carrera.catalogo}`);
            if (res.ok) {
              const m = await res.json();
              newMallas[key] = m;
            } else {
              newMallas[key] = [];
            }
          } catch (err) {
            console.error('Error fetching malla', err);
            newMallas[key] = [];
          }

          // Fetch avance
          try {
            const avRes = await fetch(`http://localhost:3000/mallas/avance?rut=${encodeURIComponent(userData.rut)}&codcarrera=${encodeURIComponent(carrera.codigo)}`);
            if (avRes.ok) {
              const a = await avRes.json();
              newAvances[carrera.codigo] = a;
            } else {
              newAvances[carrera.codigo] = [];
            }
          } catch (err) {
            console.error('Error fetching avance', err);
            newAvances[carrera.codigo] = [];
          }
        }

        setMallas(newMallas);
        setAvances(newAvances);
      } catch (err) {
        setError('Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userData]);

  if (!userData) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>No has iniciado sesión</h2>
        <p>Por favor, inicia sesión para ver tu malla curricular.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', paddingBottom: 80 }}>
      <header style={{ background: '#fff', padding: '20px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#2563eb', fontSize: 20, margin: 0 }}>🎓 Universidad</h1>
            <div style={{ fontSize: 14, color: '#374151' }}>Malla Curricular</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600 , color: '#4b5563'}}>{userData.rut}</div>
            <div style={{ fontSize: 13, color: '#4b5563' }}>Cuenta activa</div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '24px auto', padding: '0 16px' }}>
        {loading && <div style={{ padding: 12, background: '#fff', borderRadius: 8 }}>Cargando mallas y avances...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        {userData.carreras.map((carrera) => {
          const key = `${carrera.codigo}-${carrera.catalogo}`;
          const malla = mallas[key] || [];
          const avance = avances[carrera.codigo] || [];

          return (
            <section key={key} style={{ background: '#fff', borderRadius: 8, padding: 20, marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: '#111827' }}>{carrera.nombre} ({carrera.codigo} - {carrera.catalogo})</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 16 }}>
                <div>
                  <h3 style={{ fontSize: 16, marginBottom: 8, color: "blue" }}>Malla</h3>
                  {malla.length === 0 ? (
                    <div style={{ color: '#6b7280' }}>No hay malla disponible</div>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {malla.map((curso: any) => (
                        <li key={curso.codigo} style={{ padding: '8px 12px', color: "black", borderBottom: '1px solid #eee' }}>
                          <div style={{ fontWeight: 600 }}>{curso.codigo} — {curso.asignatura}</div>
                          <div style={{ fontSize: 13, color: '#6b7280' }}>{curso.creditos} créditos • Nivel {curso.nivel}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: 16, marginBottom: 8, color: "blue"}}>Avance</h3>
                  {avance.length === 0 ? (
                    <div style={{ color: '#6b7280' }}>No hay registros de avance</div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ textAlign: 'left', color: "blue", borderBottom: '1px solid #e5e7eb' }}>
                          <th style={{ padding: '8px 6px' }}>NRC</th>
                          <th style={{ padding: '8px 6px' }}>Periodo</th>
                          <th style={{ padding: '8px 6px' }}>Asignatura</th>
                          <th style={{ padding: '8px 6px' }}>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {avance.map((a: any, i: number) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', color: "black" }}>
                            <td style={{ padding: '8px 6px' }}>{a.nrc}</td>
                            <td style={{ padding: '8px 6px' }}>{a.period}</td>
                            <td style={{ padding: '8px 6px' }}>{a.course}</td>
                            <td style={{ padding: '8px 6px' }}>{a.status || a.inscriptionType || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default Curriculum;
