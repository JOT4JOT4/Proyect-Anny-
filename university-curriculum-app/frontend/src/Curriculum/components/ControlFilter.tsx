import React from 'react';

interface Props {
  filterLevel: string;
  setFilterLevel: (val: string) => void;
  showAprob: boolean;
  setShowAprob: (val: boolean) => void;
  showReprob: boolean;
  setShowReprob: (val: boolean) => void;
  showInscrito: boolean;
  setShowInscrito: (val: boolean) => void;
  niveles: string[];
}

export const ControlFilter: React.FC<Props> = ({
  filterLevel,
  setFilterLevel,
  showAprob,
  setShowAprob,
  showReprob,
  setShowReprob,
  showInscrito,
  setShowInscrito,
  niveles,
}) => {
  return (
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
        <label style={{ fontSize: 13 }}><input type="checkbox" checked={showReprob} onChange={e => setShowReprob(e.target.checked)} /> <span style={{ marginLeft: 6, color: '#374151' }}>Reprobados</span></label>
        <label style={{ fontSize: 13 }}><input type="checkbox" checked={showInscrito} onChange={e => setShowInscrito(e.target.checked)} /> <span style={{ marginLeft: 6, color: '#374151' }}>Inscritos</span></label>
      </div>
    </div>
  );
};