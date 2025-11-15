import React from 'react';
import type { SimulationMode, ToastState, DecoratedCourse, Carrera } from '../types';
import { getCreditsFromCourse } from '../utils/curriculumHelper';

interface Props {
  isOptimizedView: boolean;
  totalOptimizedSemesters: number;
  creditLimit: number;
  onCreditLimitChange: (limit: number) => void;
  simulationMode: SimulationMode;
  onSimulationModeChange: (mode: SimulationMode) => void;
  onToggleOptimize: () => void;
  
  // Props para exportación
  simulatedStatus: Record<string, any>;
  decoratedMap: Map<string, DecoratedCourse>;
  selectedCareer: Carrera | null;
  setToast: (toast: ToastState) => void;
}

export const SimulationControls: React.FC<Props> = (props) => {

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
      <h3 style={{ margin: '0 0 10px', fontSize: 16, color: props.isOptimizedView ? '#006064' : '#e65100', fontWeight: 700 }}>
        {props.isOptimizedView ? '✅ Plan Óptimo Activo' : 'Planifica tu plan de Estudios:'}
      </h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>Límite de Crédito ({props.creditLimit} cr.):</label>
            <input 
              type="number" 
              value={props.creditLimit}
              onChange={e => props.onCreditLimitChange(Math.min(35, Math.max(12, Number(e.target.value))))}
              min="12" max="35" style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db', width: 70, marginLeft: 8 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>Modo Simulación:</label>
            <select 
              value={props.simulationMode} 
              onChange={e => props.onSimulationModeChange(e.target.value as SimulationMode)}
              style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db', marginLeft: 8 }}
            >
              <option value="nextSemester">Planificacion Próximo Semestre (Solo INSCRITO)</option>
              <option value="freePlay">Planificación Libre (Aprob./Reprob. VIRTUAL)</option>
            </select>
          </div>
        </div>  

        <button
          onClick={props.onToggleOptimize}
          style={{ 
            padding: '10px 20px', 
            background: props.isOptimizedView ? '#ef4444' : '#2563eb', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 6, 
            cursor: 'pointer', 
            fontWeight: 600,
            transition: 'background-color 0.2s'
          }}
        >
          {props.isOptimizedView ? 'Volver a Malla Original' : 'Optimizar Plan de Estudios'}
        </button>
      </div>
      
      {/* Botones de Exportación */}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #e0e0e0', display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Exportar Simulación:</span>
        <button
          onClick={() => exportSimulated('json')}
          style={{ padding: '6px 10px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
        >
          Exportar INSCRITOS (JSON)
        </button>
        <button
          onClick={() => exportSimulated('csv')}
          style={{ padding: '6px 10px', background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}
        >
          Exportar INSCRITOS (CSV)
        </button>
      </div>

      {props.totalOptimizedSemesters > 0 && (
        <div style={{ marginTop: 15, padding: '10px', background: '#c8e6c9', borderRadius: 4, border: '1px solid #81c784' }}>
          <h4 style={{ margin: 0, fontSize: 14, color: '#2e7d32' }}>
            Plan Optimizado:
            <span style={{ fontWeight: 700, marginLeft: 8 }}>
              {props.totalOptimizedSemesters} Semestres restantes.
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