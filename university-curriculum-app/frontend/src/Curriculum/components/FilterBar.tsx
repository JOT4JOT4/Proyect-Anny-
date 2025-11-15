import React from 'react';

interface Props {
  niveles: string[];
  filterLevel: string;
  onFilterLevelChange: (level: string) => void;
  showAprob: boolean;
  onShowAprobChange: (show: boolean) => void;
  showReprob: boolean;
  onShowReprobChange: (show: boolean) => void;
  showInscrito: boolean;
  onShowInscritoChange: (show: boolean) => void;
}

export const FilterBar: React.FC<Props> = (props) => {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '8px 0 12px' }}>
      <div>
        <label style={{ fontSize: 13, color: '#374151', marginRight: 4, fontWeight: 600 }}>Filtrar Nivel:</label>
        <select
          value={props.filterLevel}
          onChange={e => props.onFilterLevelChange(e.target.value)}
          style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db' }}
        >
          <option value="ALL">Todos</option>
          {props.niveles.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#374151', fontWeight: 600 }}>Mostrar:</span>
        <label style={{ fontSize: 13, color: '#10b981', cursor: 'pointer' }}>
          <input type="checkbox" checked={props.showAprob} onChange={e => props.onShowAprobChange(e.target.checked)} /> Aprobados
        </label>
        <label style={{ fontSize: 13, color: '#ef4444', cursor: 'pointer' }}>
          <input type="checkbox" checked={props.showReprob} onChange={e => props.onShowReprobChange(e.target.checked)} /> Reprobados
        </label>
        <label style={{ fontSize: 13, color: '#eab308', cursor: 'pointer' }}>
          <input type="checkbox" checked={props.showInscrito} onChange={e => props.onShowInscritoChange(e.target.checked)} /> Inscritos
        </label>
      </div>
    </div>
  );
};