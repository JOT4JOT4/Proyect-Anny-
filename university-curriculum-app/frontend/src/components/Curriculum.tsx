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
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'failed' | 'other'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCareerIndex, setSelectedCareerIndex] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [simulatedMap, setSimulatedMap] = useState<Record<string, string[]>>({});

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

  // Load simulated selections from localStorage (single map for all careers)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('simulatedMap');
      if (raw) setSimulatedMap(JSON.parse(raw) as Record<string, string[]>);
    } catch (err) {
      console.error('Error parsing simulatedMap from localStorage', err);
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

  const selectedCareer = userData.carreras[selectedCareerIndex] || userData.carreras[0];

  // Helper to compute merged list for a career
  const mergedCoursesFor = (c: Carrera) => {
    const key = `${c.codigo}-${c.catalogo}`;
    const malla = mallas[key] || [];
    const avance = avances[c.codigo] || [];

    const avanceMap: Record<string, any> = {};
    for (const a of avance) {
      const candidates = [a.codigo, a.course, a.courseCode, a['course_code'], a['courseCodigo'], a.asignatura];
      const found = candidates.find((f: any) => f !== undefined && f !== null);
      if (found) avanceMap[String(found).trim()] = a;
    }

    const findAv = (codigo: string) => {
      if (!codigo) return undefined;
      if (avanceMap[codigo]) return avanceMap[codigo];
      const lower = codigo.toLowerCase();
      const exact = Object.keys(avanceMap).find(k => k.toLowerCase() === lower);
      if (exact) return avanceMap[exact];
      const contains = Object.keys(avanceMap).find(k => k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase()));
      if (contains) return avanceMap[contains];
      return avance.find((a: any) => {
        const fields = [a.codigo, a.course, a.asignatura, a.student, a.nrc];
        return fields.some((f: any) => f && String(f).toLowerCase().includes(lower));
      });
    };

    return malla.map((curso: any) => ({ curso, avance: findAv(String(curso.codigo || curso.code || curso.id || '')) }));
  };

  const merged = mergedCoursesFor(selectedCareer);

  // Build a quick lookup of courses by code for the selected career (to show names for prereqs)
  const selectedKey = `${selectedCareer.codigo}-${selectedCareer.catalogo}`;
  const selectedMalla = mallas[selectedKey] || [];
  const courseMap: Record<string, any> = {};
  for (const c of selectedMalla) {
    const code = String(c.codigo || c.code || c.id || '').trim();
    if (code) courseMap[code] = c;
  }

  const parsePrereqs = (curso: any): Array<{ code: string; name?: string }> => {
    // try several possible fields that might contain prereqs
    const raw = curso.prereq || curso.prerequisitos || curso.requisitos || curso.reqs || curso.prerequisitos_codes || curso.prereq_codes || curso.requires || curso.corequisites || curso.requisite;
    if (!raw) return [];
    let tokens: string[] = [];
    if (Array.isArray(raw)) {
      tokens = raw.map(r => String(r));
    } else if (typeof raw === 'string') {
      // split by common separators
      tokens = raw.split(/[;,|\/()\[\]\s]+/).filter(Boolean);
    } else {
      tokens = [String(raw)];
    }

    const out: Array<{ code: string; name?: string }> = [];
    for (const t of tokens) {
      const code = t.trim();
      if (!code) continue;
      const name = courseMap[code] ? (courseMap[code].asignatura || courseMap[code].nombre || courseMap[code].courseName) : undefined;
      out.push({ code, name });
    }
    return out;
  };

  // Apply filters and search
  const filtered = merged.filter(({ curso, avance }) => {
    // level filter
    if (levelFilter !== 'all') {
      const nivel = String(curso.nivel || curso.level || '').trim();
      if (nivel !== levelFilter) return false;
    }

    // status filter
    const rawStatus = (avance && (avance.status || avance.inscriptionType || avance.result || '')) || '';
    const statusStr = String(rawStatus).toLowerCase();
    if (statusFilter === 'approved' && !statusStr.includes('aprob')) return false;
    if (statusFilter === 'failed' && !(statusStr.includes('reprob') || statusStr.includes('repr') || statusStr.includes('failed'))) return false;
    if (statusFilter === 'other' && (statusStr === '' || statusStr.includes('aprob') || statusStr.includes('reprob') || statusStr.includes('repr') || statusStr.includes('failed'))) return false;

    // search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const fields = [curso.codigo, curso.asignatura, curso.nombre, (avance && (avance.course || avance.asignatura || avance.courseName))];
      const found = fields.some((f: any) => f && String(f).toLowerCase().includes(q));
      if (!found) return false;
    }

    return true;
  });

  const totalCount = merged.length;
  const approvedCount = merged.filter(({ avance }) => {
    const s = String((avance && (avance.status || avance.result || avance.inscriptionType)) || '').toLowerCase();
    return s.includes('aprob');
  }).length;
  const progressPercent = totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  const careerSimKey = `${selectedCareer.codigo}-${selectedCareer.catalogo}`;
  const simulatedForCareer = simulatedMap[careerSimKey] || [];
  const isSimulated = (code: string) => simulatedForCareer.includes(code);

  const toggleSimulated = (code: string) => {
    setSimulatedMap(prev => {
      const copy: Record<string, string[]> = { ...prev };
      const arr = new Set(copy[careerSimKey] || []);
      if (arr.has(code)) arr.delete(code); else arr.add(code);
      copy[careerSimKey] = Array.from(arr);
      try { localStorage.setItem('simulatedMap', JSON.stringify(copy)); } catch (e) { console.error(e); }
      return copy;
    });
  };

  const clearSimulation = () => {
    setSimulatedMap(prev => {
      const copy = { ...prev };
      copy[careerSimKey] = [];
      try { localStorage.setItem('simulatedMap', JSON.stringify(copy)); } catch (e) { console.error(e); }
      return copy;
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', paddingBottom: 80 }}>
      <header style={{ background: '#fff', padding: '12px 24px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#2563eb', fontSize: 20, margin: 0 }}>🎓 Universidad</h1>
            <div style={{ fontSize: 14, color: '#374151' }}>Malla Curricular</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600 , color: '#4b5563'}}>{userData.rut}</div>
              <div style={{ fontSize: 13, color: '#4b5563' }}>Cuenta activa</div>
            </div>
            <button onClick={() => { localStorage.removeItem('userData'); window.location.reload(); }} style={{ padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '24px auto', padding: '0 16px' }}>
        {loading && <div style={{ padding: 12, background: '#fff', borderRadius: 8 }}>Cargando mallas y avances...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <label style={{ fontWeight: 600 , color: "blue"}}>Carrera:</label>
          <select value={selectedCareerIndex} onChange={e => setSelectedCareerIndex(Number(e.target.value))}>
            {userData.carreras.map((c, i) => <option key={i} value={i}>{c.nombre} ({c.codigo})</option>)}
          </select>

          <label style={{ marginLeft: 12 , color: "blue"}}>Filtro estado:</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}>
            <option value="all">Todas</option>
            <option value="approved">Aprobadas</option>
            <option value="failed">Reprobadas</option>
            <option value="other">Otros</option>
          </select>

          <label style={{ marginLeft: 12 , color: "blue"}}>Nivel:</label>
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}>
            <option value="all">Todos</option>
            {/* try to auto-populate levels from merged */}
            {Array.from(new Set(merged.map(m => String(m.curso.nivel || m.curso.level || '').trim()).filter(v => v))).map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <input placeholder="Buscar materia..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ marginLeft: 'auto', padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db' }} />

        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 14, color: '#374151' }}>Simulación: <strong>{simulatedForCareer.length}</strong> ramos seleccionados</div>
          <button onClick={clearSimulation} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>Limpiar simulación</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, color: '#374151' }}>
          <div>Mostrando {filtered.length} de {totalCount} ramos • Progreso: {progressPercent}% ({approvedCount}/{totalCount} aprobadas)</div>
        </div>

        {filtered.length === 0 && <div style={{ padding: 12, background: '#fff', borderRadius: 8, color: '#374151'}}>No hay ramos para los filtros seleccionados.</div>}

        {filtered.length > 0 && (
          <section style={{ background: '#fff', borderRadius: 8, padding: 20, marginBottom: 20 }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
              {filtered.map(({ curso, avance }: any, idx) => {
                const cursoCodigo = String(curso.codigo || curso.code || curso.id || '').trim();
                const rawStatus = (avance && (avance.status || avance.inscriptionType || avance.result || '')) || '';
                const statusStr = String(rawStatus).toLowerCase();
                let background = '#f3f4f6';
                let color = '#111827';
                let label = '';

                if (statusStr.includes('aprob')) {
                  background = '#10b981';
                  color = '#fff';
                  label = 'APROBADO';
                } else if (statusStr.includes('reprob') || statusStr.includes('repr') || statusStr.includes('failed')) {
                  background = '#ef4444';
                  color = '#fff';
                  label = 'REPROBADO';
                } else if (statusStr) {
                  background = '#fde68a';
                  color = '#111827';
                  label = String(rawStatus).toUpperCase();
                }

                const prereqs = parsePrereqs(curso);
                return (
                  <li
                    key={cursoCodigo + idx}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    style={{ position: 'relative', padding: 12, borderRadius: 8, background: '#fff', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#374151' }}>{cursoCodigo} — {curso.asignatura || curso.nombre || curso.courseName}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{curso.creditos ? `${curso.creditos} créditos • Nivel ${curso.nivel}` : (curso.creditos_text || '')}</div>
                    </div>
                    <div style={{ marginLeft: 12, minWidth: 100, textAlign: 'right' }}>
                      <div style={{ display: 'inline-block', padding: '6px 10px', borderRadius: 6, background, color, fontWeight: 700, fontSize: 12 }}>
                        {label || '—'}
                      </div>
                      {avance && (
                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 6 }}>
                          {avance.period ? `${avance.period}` : ''} {avance.nrc ? `• ${avance.nrc}` : ''}
                        </div>
                      )}
                    </div>

                    <div style={{ marginLeft: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {/* Simulation toggle */}
                      <button onClick={() => toggleSimulated(cursoCodigo)} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db', background: isSimulated(cursoCodigo) ? '#bfdbfe' : '#eef2ff', cursor: 'pointer' }}>
                        {isSimulated(cursoCodigo) ? 'Quitar simulación' : 'Simular ramo'}
                      </button>
                      {/* Simulated badge */}
                      {isSimulated(cursoCodigo) && (
                        <div style={{ fontSize: 12, padding: '4px 8px', borderRadius: 6, background: '#3b82f6', color: '#fff', textAlign: 'center' }}>SIMULADO</div>
                      )}
                    </div>

                    {/* Prereq popup */}
                    {prereqs.length > 0 && hoveredIndex === idx && (
                      <div style={{ position: 'absolute', left: '8px', top: '100%', marginTop: 8, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.08)', zIndex: 40, minWidth: 220 }}>
                        <div style={{ fontWeight: 700, marginBottom: 6, color: '#374151' }}>Prerequisitos</div>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                          {prereqs.map((p, ii) => (
                            <li key={ii} style={{ padding: '4px 0', borderBottom: ii < prereqs.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                              <div style={{ fontWeight: 400, color: '#6b7280' }}>{p.code}{p.name ? ` — ${p.name}` : ''}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default Curriculum;
