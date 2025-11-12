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
  const [selectedCareerIndex, setSelectedCareerIndex] = useState<number>(0);
  // hoveredKey is a unique string per cube (e.g. `${cursoCodigo}-${nivel}`)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number } | null>(null);
  const [tooltipPrereqs, setTooltipPrereqs] = useState<Array<{ code: string; name?: string }>>([]);
  // Filters
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [showAprob, setShowAprob] = useState<boolean>(true);
  const [showReprob, setShowReprob] = useState<boolean>(true);
  const [showInscrito, setShowInscrito] = useState<boolean>(true);

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
      // Temporarily commented - simulation on hold
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

  // compute available niveles from merged
  const niveles = Array.from(new Set(merged.map((m: any) => String(m.curso.nivel || m.curso.level || m.curso.semestre || 'N/A').trim())))
    .sort((a: string, b: string) => (parseInt(a) || 999) - (parseInt(b) || 999));

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

  // Apply filters: we won't remove non-matching courses, instead we mark them as faded
  const decorated = merged.map((item: any) => {
    const curso = item.curso;
    const cursoCodigo = String(curso.codigo || curso.code || curso.id || '').trim();
    const nivel = String(curso.nivel || curso.level || curso.semestre || 'N/A').trim();

    const avance = item.avance || {};
    const rawStatus = String((avance.status || avance.inscriptionType || avance.result || '') || '').toLowerCase();
    const isAprob = rawStatus.includes('aprob');
    const isReprob = rawStatus.includes('reprob') || rawStatus.includes('repr') || rawStatus.includes('failed');
    const isInscrito = rawStatus.includes('inscr') || rawStatus.includes('registered') || rawStatus.includes('enrolled') || (!isAprob && !isReprob && rawStatus.length > 0);

    // status match
    const statusMatch = (isAprob && showAprob) || (isReprob && showReprob) || (isInscrito && showInscrito) || (!isAprob && !isReprob && !isInscrito && (showAprob || showReprob || showInscrito));

    const levelMatch = filterLevel === 'ALL' || filterLevel === nivel;

    // We will fade items that don't match either the level filter or the status toggles
    const shouldFade = !(statusMatch && levelMatch);

    return { ...item, cursoCodigo, nivel, isAprob, isReprob, isInscrito, shouldFade };
  });

  // Responsive styles for mobile
  // On mobile (≤768px), switch to rows per semester and make cubes full-width
  const responsiveStyle = `
    @media (max-width: 768px) {
      .curriculum-main {
        flex-direction: column !important;
        gap: 0 !important;
      }
      .curriculum-semester {
        flex-direction: row !important;
        min-width: 100% !important;
        margin-bottom: 16px;
        gap: 8px !important;
      }
      .curriculum-cube {
        width: 100% !important;
        min-width: 0 !important;
        margin-bottom: 8px;
      }
      .curriculum-semester-title {
        font-size: 15px !important;
        padding: 4px !important;
      }
    }
  `;
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6' }}>
      <style>{responsiveStyle}</style>
      {/* Header - Fixed at top */}
      <header style={{ background: '#fff', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb', zIndex: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#2563eb', fontSize: 24, margin: 0, fontWeight: 700 }}>🎓 Malla Curricular</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <select value={selectedCareerIndex} onChange={e => setSelectedCareerIndex(Number(e.target.value))} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14 }}>
              {userData.carreras.map((c, i) => <option key={i} value={i}>{c.nombre}</option>)}
            </select>
            <div style={{ textAlign: 'right', fontSize: 13 }}>
              <div style={{ fontWeight: 600, color: '#374151' }}>{userData.rut}</div>
              <div style={{ color: '#6b7280' }}>Activo</div>
            </div>
            <button onClick={() => { localStorage.removeItem('userData'); window.location.reload(); }} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>Logout</button>
          </div>
        </div>
      </header>

      {/* Main content - scrollable */}
      <main style={{ flex: 1, overflow: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
        {loading && (
          <div style={{ padding: 8, background: '#fff', borderRadius: 4, textAlign: 'center', color: '#374151' }}>
            Cargando mallas y avances...
          </div>
        )}
        {/* Filter bar */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '8px 0 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>Nivel</label>
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db' }}>
              <option value="ALL">Todos</option>
              {niveles.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 13 }}><input type="checkbox" checked={showAprob} onChange={e => setShowAprob(e.target.checked)} /> <span style={{ marginLeft: 6, color: '#374151' }}>Aprobados</span></label>
            <label style={{ fontSize: 13 }}><input type="checkbox" checked={showReprob} onChange={e => setShowReprob(e.target.checked)} /> <span style={{ marginLeft: 6, color: '#374151'  }}>Reprobados</span></label>
            <label style={{ fontSize: 13 }}><input type="checkbox" checked={showInscrito} onChange={e => setShowInscrito(e.target.checked)} /> <span style={{ marginLeft: 6, color: '#374151'  }}>Inscritos</span></label>
          </div>
        </div>

        {/* Global fixed tooltip to avoid clipping / z-index issues */}
        {tooltipPos && tooltipPrereqs.length > 0 && (
          <div style={{ position: 'fixed', left: tooltipPos.left, top: tooltipPos.top, background: '#fff', border: '1px solid #d1d5db', borderRadius: 4, padding: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 9999, minWidth: 160, fontSize: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: '#374151' }}>Req:</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {tooltipPrereqs.slice(0, 6).map((p, ii) => (
                <li key={ii} style={{ padding: '2px 0', color: '#374151' }}>{p.code}{p.name ? ` — ${p.name}` : ''}</li>
              ))}
              {tooltipPrereqs.length > 6 && <li style={{ padding: '2px 0', color: '#9ca3af' }}>+{tooltipPrereqs.length - 6}</li>}
            </ul>
          </div>
        )}
        {error && <div style={{ padding: 8, background: '#fee2e2', borderRadius: 4, color: '#991b1b' }}>Error: {error}</div>}

        {!loading && !error && decorated.length > 0 && (
          <div className="curriculum-main" style={{ display: 'flex', gap: 8, overflow: 'auto', paddingBottom: 10 }}>
            {/* Grouped by nivel (semestre) - Each is a column (desktop) or row (mobile) */}
            {Array.from(
              new Map(
                decorated.map(({ curso }: any) => {
                  const nivel = String(curso.nivel || curso.level || curso.semestre || 'N/A').trim();
                  return [nivel, { curso }];
                })
              ).entries()
            )
              .sort(([a], [b]) => {
                const aNum = parseInt(String(a)) || 999;
                const bNum = parseInt(String(b)) || 999;
                return aNum - bNum;
              })
              .map(([nivel]) => {
                const nivelCourses = decorated.filter(({ curso }: any) => {
                  const n = String(curso.nivel || curso.level || curso.semestre || 'N/A').trim();
                  return n === String(nivel);
                });

                return (
                  <section className="curriculum-semester" key={String(nivel)} style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: '60px', minWidth: '80px', flex: '0 0 auto' }}>
                    <h2 className="curriculum-semester-title" style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, padding: '2px', background: '#2563eb', borderRadius: 4, textAlign: 'center' }}>
                      Sem {String(nivel)}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                      {nivelCourses.map(({ curso, avance, shouldFade }: any, idx: number) => {
                        const cursoCodigo = String(curso.codigo || curso.code || curso.id || '').trim();
                        const rawStatus = (avance && (avance.status || avance.inscriptionType || avance.result || '')) || '';
                        const statusStr = String(rawStatus).toLowerCase();
                        const cubeKey = `${cursoCodigo}-${nivel}`;
                        
                        let bgColor = '#f3f4f6';
                        let borderColor = '#d1d5db';
                        let statusBgColor = '#f3f4f6';
                        let statusTextColor = '#6b7280';

                        if (statusStr.includes('aprob')) {
                          bgColor = '#d1fae5';
                          borderColor = '#10b981';
                          statusBgColor = '#10b981';
                          statusTextColor = '#fff';
                        } else if (statusStr.includes('reprob') || statusStr.includes('repr') || statusStr.includes('failed')) {
                          bgColor = '#fee2e2';
                          borderColor = '#ef4444';
                          statusBgColor = '#ef4444';
                          statusTextColor = '#fff';
                        }

                        const prereqs = parsePrereqs(curso);

                        // visual fade for non-matching filters
                        const isFaded = Boolean(shouldFade);
                        const transformValue = hoveredKey === cubeKey ? 'translateY(-3px) scale(1.02)' : 'translateY(0)';
                        const boxShadowValue = hoveredKey === cubeKey ? '0 6px 18px rgba(0,0,0,0.18)' : '0 1px 2px rgba(0,0,0,0.08)';

                        return (
                          <div
                            className="curriculum-cube"
                            key={cursoCodigo + idx}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              const rect = el.getBoundingClientRect();
                              // position tooltip to the right of the cube, aligned to its top
                              setTooltipPos({ left: Math.min(rect.right + 8, window.innerWidth - 180), top: rect.top });
                              setTooltipPrereqs(prereqs);
                              setHoveredKey(cubeKey);
                            }}
                            onMouseLeave={() => {
                              setHoveredKey(null);
                              setTooltipPos(null);
                              setTooltipPrereqs([]);
                            }}
                            style={{
                              position: 'relative',
                              width: '85%',
                              minHeight: '80px',
                              borderRadius: 4,
                              background: bgColor,
                              border: `2px solid ${borderColor}`,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              transition: 'transform 160ms ease, box-shadow 160ms ease, opacity 200ms ease, filter 200ms ease',
                              boxShadow: boxShadowValue,
                              transform: transformValue,
                              opacity: isFaded ? 0.38 : 1,
                              filter: isFaded ? 'grayscale(80%) blur(1px)' : 'none',
                            }}
                          >
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <div style={{ fontWeight: 700, fontSize: 10, color: '#374151', wordBreak: 'break-word' }}>
                                {curso.asignatura || curso.nombre || 'Sin nombre'}
                              </div>
                              <div style={{ fontSize: 9, color: '#6b7280', marginTop: 2, lineHeight: 1.2, wordBreak: 'break-word' }}>
                                {cursoCodigo }
                              </div>
                            </div>
                            <div style={{ fontSize: 8, padding: '2px 4px', borderRadius: 3, background: statusBgColor, color: statusTextColor, textAlign: 'center', fontWeight: 600, marginTop: 6 }}>
                              {statusStr.includes('aprob') ? '✓ APROB' : statusStr.includes('reprob') || statusStr.includes('repr') ? '✗ REPROB' : '—'}
                            </div>

                            {/* prerequisites tooltip is rendered globally (fixed) below to avoid clipping/z-index issues */}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })
            }
          </div>
        )}

  {!loading && decorated.length === 0 && (
          <div style={{ padding: 24, background: '#fff', borderRadius: 8, textAlign: 'center', color: '#6b7280' }}>
            No hay ramos para los filtros seleccionados
          </div>
        )}
      </main>
    </div>
  );
};

export default Curriculum;
