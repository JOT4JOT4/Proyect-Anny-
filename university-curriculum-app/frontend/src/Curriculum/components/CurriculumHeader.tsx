import React from 'react';
import type { UserData } from '../types';

interface Props {
  userData: UserData;
  selectedCareerIndex: number;
  setSelectedCareerIndex: (idx: number) => void;
  isSimulating: boolean;
  setIsSimulating: React.Dispatch<React.SetStateAction<boolean>>;

  clearSimulatedForCareer: () => void;
  simulatedKeys: string[];
  simulatedCredits: number;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

export const CurriculumHeader: React.FC<Props> = ({
  userData,
  selectedCareerIndex,
  setSelectedCareerIndex,
  isSimulating,
  setIsSimulating, 
  clearSimulatedForCareer,
  simulatedKeys,
  simulatedCredits,
  onExportJSON,
  onExportCSV,
}) => {
  return (
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
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setIsSimulating(s => !s)} style={{ padding: '8px 12px', background: isSimulating ? '#60a5fa' : '#e0f2ff', color: isSimulating ? '#fff' : '#0369a1', border: '1px solid #93c5fd', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
              {isSimulating ? 'Simulando (clic para seleccionar)' : 'Simular malla'}
            </button>
            <button onClick={clearSimulatedForCareer} style={{ padding: '8px 12px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer' }}>Limpiar</button>
            <button onClick={() => { localStorage.removeItem('userData'); window.location.reload(); }} style={{ padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>Logout</button>
          </div>
          <div style={{ marginLeft: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 13, color: '#374151' }}>Seleccionados: <strong style={{ color: '#111' }}>{simulatedKeys.length}</strong></div>
            <div style={{ fontSize: 13, color: '#374151' }}>Créditos: <strong style={{ color: '#111' }}>{simulatedCredits}</strong></div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={onExportJSON} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', color: '#374151' }}>Exportar JSON</button>
              <button onClick={onExportCSV} style={{ padding: '6px 8px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', color: '#374151' }}>Exportar CSV</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};