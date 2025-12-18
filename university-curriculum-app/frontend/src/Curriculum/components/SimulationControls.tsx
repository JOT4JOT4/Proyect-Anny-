import React, { useState } from 'react'; // <--- FALTABA useState
import type { SimulationMode, ToastState, DecoratedCourse, Carrera } from '../types';
import { getCreditsFromCourse } from '../utils/curriculumHelper';

interface Props {
  isOptimizedView: boolean;
  totalOptimizedSemesters: number;
  creditLimit: number;
  onCreditLimitChange: (limit: number) => void;
  simulationMode: SimulationMode;
  onSimulationModeChange: (mode: SimulationMode) => void;

  onGenerate: () => void;
  onSave: () => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void
  onClear: () => void;
  savedPlans: any[];
  currentPlanName: string;
  currentPlanId: string | null;
  
  // Props para exportación
  simulatedStatus: Record<string, any>;
  decoratedMap: Map<string, DecoratedCourse>;
  selectedCareer: Carrera | null;
  setToast: (toast: ToastState) => void;
}

export const SimulationControls: React.FC<Props> = (props) => {

  const [selectedLoadId, setSelectedLoadId] = useState<string>('');

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
    <div style={{ background: props.isOptimizedView ? '#e0f7fa' : '#fff3e0', padding: 12, borderRadius: 6, margin: '8px 0 16px', borderLeft: props.isOptimizedView ? '4px solid #00bcd4' : '4px solid #ff9800' }}>
      
      {/* --- HEADER DEL PANEL --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontSize: 16, color: props.isOptimizedView ? '#006064' : '#e65100', fontWeight: 700 }}>
          {props.isOptimizedView 
            ? `✅ Plan Activo: ${props.currentPlanName || 'Sin Guardar'}` 
            : 'Planifica tu plan de Estudios:'}
        </h3>
        
        {/* Botón para Limpiar*/}
        {props.isOptimizedView && (
             <button 
                onClick={props.onClear} 
                style={{ fontSize: 11, padding: '4px 8px', background: 'transparent', border: '1px solid #00838f', borderRadius: 4, color: '#00838f', cursor: 'pointer' }}
                title="Salir del modo optimizado y limpiar"
             >
                 Limpiar / Nuevo
             </button>
        )}
      </div>
      
      {/* --- CONTROLES PRINCIPALES --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
        
        {/* Grupo Izquierdo: Inputs y Selectores */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Límite de Créditos */}
          <div>
            <label style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>Límite Créditos:</label>
            <input 
              type="number" 
              value={props.creditLimit}
              onChange={e => props.onCreditLimitChange(Math.min(35, Math.max(12, Number(e.target.value))))}
              min="12" max="35" 
              style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db', width: 60, marginLeft: 8 }}
            />
          </div>

          {/* Selector de Modo Simulación */}
          <div>
             <label style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>Modo:</label>
             <select 
               value={props.simulationMode} 
               onChange={e => props.onSimulationModeChange(e.target.value as SimulationMode)}
               style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db', marginLeft: 8 }}
             >
               <option value="nextSemester">Próximo Semestre</option>
               <option value="freePlay">Libre (Simular Aprob/Reprob)</option>
             </select>
          </div>

          {/* SECCIÓN CARGAR / BORRAR */}
            {props.savedPlans && props.savedPlans.length > 0 && (
               <div style={{ display: 'flex', alignItems: 'center', gap: 5, borderLeft: '1px solid #ccc', paddingLeft: 15 }}>
                   <select 
                      value={selectedLoadId} 
                      onChange={(e) => setSelectedLoadId(e.target.value)}
                      style={{ padding: '6px', borderRadius: 6, border: '1px solid #d1d5db', maxWidth: 180 }}
                   >
                       <option value="">-- Gestionar Planes --</option>
                       {props.savedPlans.map(p => (
                           <option key={p._id} value={p._id}>
                               {p.nombre} ({new Date(p.updatedAt).toLocaleDateString()})
                           </option>
                       ))}
                   </select>

                   <button 
                      onClick={handleLoadClick} 
                      disabled={!selectedLoadId} 
                      style={{ cursor: 'pointer', padding: '6px 10px', borderRadius: 6, border: '1px solid #9ca3af', background: '#34aa44ff', color: '#ffffff' }}
                      title="Cargar plan seleccionado"
                   >
                      Cargar
                   </button>

                   <button 
                      onClick={handleDeleteClick} 
                      disabled={!selectedLoadId} 
                      style={{ 
                          cursor: 'pointer', 
                          padding: '6px 10px', 
                          borderRadius: 6, 
                          border: '1px solid #fca5a5', 
                          background: '#fee2e2',
                          color: '#991b1b'
                      }}
                      title="Eliminar plan seleccionado"
                   >
                      Eliminar
                   </button>
               </div>
            )}
         </div>

        <div style={{ display: 'flex', gap: 8 }}>
            
            {!props.isOptimizedView && (
                <button
                onClick={props.onGenerate}
                style={{ 
                    padding: '14px 42px', 
                    background: '#2563eb', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    cursor: 'pointer', 
                    fontWeight: 700,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                >
                Optimizar Malla
                </button>
            )}

            {props.isOptimizedView && (
                <button
                onClick={props.onSave}
                style={{ 
                    padding: '8px 16px', 
                    background: '#059669',
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 6, 
                    cursor: 'pointer', 
                    fontWeight: 600,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                >
                💾 {props.currentPlanId ? 'Guardar Cambios' : 'Guardar Como...'}
                </button>
            )}
        </div>
      </div>
      
      {/* --- SECCIÓN DE EXPORTACIÓN --- */}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Exportar Simulación:</span>
        <button
          onClick={() => exportSimulated('json')}
          style={{ padding: '6px 10px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: '#374151' }}
        >
          Exportar INSCRITOS (JSON)
        </button>
        <button
          onClick={() => exportSimulated('csv')}
          style={{ padding: '6px 10px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 12, color: '#374151' }}
        >
          Exportar INSCRITOS (CSV)
        </button>
      </div>

      {/* --- RESUMEN DE SEMESTRES --- */}
      {props.totalOptimizedSemesters > 0 && (
        <div style={{ marginTop: 15, padding: '10px', background: '#c8e6c9', borderRadius: 4, border: '1px solid #81c784' }}>
          <h4 style={{ margin: 0, fontSize: 14, color: '#2e7d32' }}>
            Plan Optimizado:
            <span style={{ fontWeight: 700, marginLeft: 8 }}>
              {props.totalOptimizedSemesters} Semestres totales.
            </span>
          </h4>
          {props.isOptimizedView && (
            <p style={{ margin: '5px 0 0', fontSize: 12, color: '#2e7d32', fontStyle: 'italic' }}>
              La malla se está mostrando ordenada por este plan.
            </p>
          )}
        </div>
      )}
    </div>
  );
};