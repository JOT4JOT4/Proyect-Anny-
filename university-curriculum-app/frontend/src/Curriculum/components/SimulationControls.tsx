import React, { useState } from 'react';
import type { SimulationMode, ToastState, DecoratedCourse, Carrera } from '../types';
import { getCreditsFromCourse } from '../utils/curriculumHelper';

interface Props {
  isOptimizedView: boolean;
  totalOptimizedSemesters: number;
  
  semesterLimits: number[];
  onLimitChange: (idx: number, val: number) => void;
  onSetAllLimits?: (val: number) => void; 

  simulationMode: SimulationMode;
  onSimulationModeChange: (mode: SimulationMode) => void;

  onGenerate: () => void;
  onSave: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  
  savedPlans: any[];
  currentPlanName: string;
  currentPlanId: string | null;
  
  simulatedStatus: Record<string, any>;
  decoratedMap: Map<string, DecoratedCourse>;
  selectedCareer: Carrera | null;
  setToast: (toast: ToastState) => void;

  ignorePracticas: boolean;          
  setIgnorePracticas: (v: boolean) => void; 
}

export const SimulationControls: React.FC<Props> = (props) => {

  const [selectedLoadId, setSelectedLoadId] = useState<string>('');
  const [showConfig, setShowConfig] = useState<boolean>(true); 

  const handleLoadClick = () => {
    if(selectedLoadId) {
        props.onLoad(selectedLoadId);
        setSelectedLoadId(''); 
    }
  };

  const handleDeleteClick = () => {
     if (selectedLoadId) {
        props.onDelete(selectedLoadId);
        setSelectedLoadId(''); 
     }
  };

  const exportSimulated = (format: 'json' | 'csv') => {
    const simulatedInscritoCodes = Object.entries(props.simulatedStatus)
      .filter(([code, status]) => status === 'INSCRITO')
      .map(([code]) => code);

    if (simulatedInscritoCodes.length === 0) {
      props.setToast({ message: "No hay ramos 'INSCRITO' para exportar.", type: 'error' });
      return;
    }

    const items = simulatedInscritoCodes.map(code => {
      const it = props.decoratedMap.get(code);
      if (!it) return { codigo: code, nombre: 'Desconocido', nivel: '', creditos: 0, raw: {} };
      const curso = it.curso || {};
      return {
        codigo: code,
        nombre: curso.asignatura || curso.nombre || curso.title || '',
        nivel: it.nivel,
        creditos: getCreditsFromCourse(curso),
        raw: curso,
      };
    });
    
    const careerKey = `${props.selectedCareer?.codigo ?? 'unknown'}-${props.selectedCareer?.catalogo ?? 'unknown'}`;
    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
      filename = `simulacion-inscritos-${careerKey}.json`;
    } else { 
      const rows = [['codigo', 'nombre', 'nivel', 'creditos']];
      items.forEach(it => {
        rows.push([it.codigo, it.nombre, it.nivel, String(it.creditos)]);
      });
      const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      blob = new Blob([csv], { type: 'text/csv' });
      filename = `simulacion-inscritos-${careerKey}.csv`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

return (
    <div style={{ background: props.isOptimizedView ? '#e0f7fa' : '#fff', padding: 16, borderRadius: 8, margin: '8px 0 16px', border: '1px solid #ddd', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
        <h3 style={{ margin: 0, fontSize: 18, color: props.isOptimizedView ? '#006064' : '#1f2937', fontWeight: 700 }}>
          {props.isOptimizedView ? `✅ Plan Activo: ${props.currentPlanName || 'Sin Guardar'}` : '🎯 Configuración de Optimización'}
        </h3>
        
        <div style={{display:'flex', gap: 10}}>
             {props.isOptimizedView ? (
                <>
                    <button onClick={props.onSave} style={{ padding: '6px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
                        💾 Guardar
                    </button>
                    <button onClick={props.onClear} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #d1d5db', color: '#6b7280', borderRadius: 6, cursor: 'pointer' }}>
                        Salir / Nuevo
                    </button>
                </>
             ) : (
                <button onClick={() => setShowConfig(!showConfig)} style={{ fontSize: 12, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                    {showConfig ? 'Ocultar Config' : 'Mostrar Config'}
                </button>
             )}
        </div>
      </div>
      
      {/* CONFIGURACIÓN */}
      {!props.isOptimizedView && showConfig && (
          <div style={{ marginBottom: 20, padding: 10, background: '#f9fafb', borderRadius: 8, border: '1px solid #f3f4f6' }}>

            <div style={{ display: 'flex', gap: 15, marginBottom: 15, flexWrap: 'wrap' }}>
          

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', color: '#374151', fontWeight: 500 }}>
                  <input 
                    type="checkbox" 
                    checked={props.ignorePracticas}
                    onChange={(e) => props.setIgnorePracticas(e.target.checked)}
                  />
                  Ignorar Prácticas (Dejar sin plan)
                </label>

            </div>
              
              {/* SUGERENCIA VISUAL */}
              <div style={{ marginBottom: 15, padding: '8px 12px', background: '#eff6ff', borderRadius: 6, borderLeft: '4px solid #3b82f6', color: '#1e40af', fontSize: 13 }}>
                  💡 <strong>Tip:</strong> Configura <strong>35 créditos en todos</strong> para generar el plan <em>Minimizado</em>. Configura <strong>12 créditos en todos</strong> para el plan <em>Maximizado</em>.
                  {props.onSetAllLimits && (
                      <div style={{ marginTop: 8, display: 'flex', gap: 10 }}>
                          <button onClick={() => props.onSetAllLimits && props.onSetAllLimits(35)} style={{ fontSize: 11, padding: '2px 8px', cursor: 'pointer', borderRadius: 4, border: '1px solid #93c5fd', background: '#fff', color: '#2563eb' }}>
                              Usar 35 en todos 
                          </button>
                          <button 
                            onClick={() => props.onSetAllLimits && props.onSetAllLimits(35)} style={{ fontSize: 11, padding: '2px 8px', cursor: 'pointer', borderRadius: 4, border: '1px solid #93c5fd', background: '#fff', color: '#2563eb' }}>
                            Usar 32 en todos (Default)
                          </button>
                          <button onClick={() => props.onSetAllLimits && props.onSetAllLimits(12)} style={{ fontSize: 11, padding: '2px 8px', cursor: 'pointer', borderRadius: 4, border: '1px solid #93c5fd', background: '#fff', color: '#2563eb' }}>
                              Usar 12 en todos 
                          </button>
                      </div>
                  )}
              </div>

              <div style={{ marginTop: 15 }}>
                      
                      <style>{`
                        .semester-grid {
                          display: grid;
                          gap: 10px;
                          /* POR DEFECTO: El navegador decide (mínimo 60px por cuadro) */
                          grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
                        }

                        @media (min-width: 1000px) {
                          .semester-grid {
                            grid-template-columns: repeat(12, 1fr) !important;
                          }
                        }
                      `}</style>

                      <h4 style={{ fontSize: 13, color: '#4b5563', marginBottom: 8 }}>Límites por Semestre:</h4>
                      
                      <div className="semester-grid">
                        {props.semesterLimits.map((limit, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <label style={{ fontSize: 10, color: '#9ca3af', textAlign: 'center' }}>S{idx + 1}</label>
                            <input 
                              type="number" 
                              min="12" max="40"
                              value={limit}
                              onChange={(e) => props.onLimitChange(idx, Number(e.target.value))}
                              style={{ 
                                padding: '4px 2px', 
                                borderRadius: 4, 
                                border: '1px solid #d1d5db', 
                                textAlign: 'center', 
                                width: '100%', 
                                fontSize: 13,
                                fontWeight: 600,
                                color: limit !== 32 ? '#0284c7' : '#374151',
                                backgroundColor: limit !== 32 ? '#f0f9ff' : '#fff'
                              }} 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
              {/* BOTÓN GENERAR */}
              <div style={{ marginTop: 15, display: 'flex', justifyContent: 'center' }}>
                  <button
                    onClick={props.onGenerate}
                    style={{ padding: '10px 40px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, boxShadow: '0 4px 6px rgba(37,99,235,0.2)', fontSize: 14 }}
                  >
                     GENERAR PLAN OPTIMIZADO
                  </button>
              </div>
          </div>
      )}

      {/* FOOTER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #eee', flexWrap: 'wrap', gap: 10 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
             <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Modo Visual:</span>
             <select value={props.simulationMode} onChange={e => props.onSimulationModeChange(e.target.value as SimulationMode)} style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', fontSize: 13 }}>
                <option value="nextSemester">Próximo Semestre</option>
                <option value="freePlay">Simulación Libre</option>
             </select>
          </div>

          {props.savedPlans && props.savedPlans.length > 0 && (
             <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                 <select value={selectedLoadId} onChange={(e) => setSelectedLoadId(e.target.value)} style={{ padding: '5px', borderRadius: 4, border: '1px solid #ccc', maxWidth: 160, fontSize: 13 }}>
                     <option value="">-- Mis Planes --</option>
                     {props.savedPlans.map(p => <option key={p._id} value={p._id}>{p.nombre}</option>)}
                 </select>
                 <button onClick={handleLoadClick} disabled={!selectedLoadId} style={{cursor:'pointer', padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc', background: '#f3f4f6'}}>📂</button>
                 <button onClick={handleDeleteClick} disabled={!selectedLoadId} style={{cursor:'pointer', padding: '4px 8px', borderRadius: 4, border: '1px solid #fca5a5', background: '#fee2e2', color: '#991b1b'}}>🗑️</button>
             </div>
          )}
      </div>

      {/* EXPORTACIÓN */}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f3f4f6', display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Exportar INSCRITOS:</span>
        <button onClick={() => exportSimulated('json')} style={{ padding: '4px 10px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: '#374151' }}>JSON</button>
        <button onClick={() => exportSimulated('csv')} style={{ padding: '4px 10px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: '#374151' }}>CSV</button>
      </div>

      {/* RESUMEN */}
      {props.totalOptimizedSemesters > 0 && (
        <div style={{ marginTop: 15, padding: '10px', background: '#ecfdf5', borderRadius: 6, border: '1px solid #a7f3d0' }}>
          <h4 style={{ margin: 0, fontSize: 14, color: '#047857' }}>
            Resumen Plan: <span style={{ fontWeight: 700, marginLeft: 8, fontSize: 16 }}>{props.totalOptimizedSemesters} Semestres</span>
          </h4>
        </div>
      )}
    </div>
  );
};