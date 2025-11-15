import React from 'react';
import type { UserData } from '../types';

interface Props {
  userData: UserData;
  selectedCareerIndex: number;
  onCareerChange: (index: number) => void;
}

export const CurriculumHeader: React.FC<Props> = ({ userData, selectedCareerIndex, onCareerChange }) => {
  
  const handleLogout = () => {
    localStorage.removeItem('userData');
    window.location.reload();
  };

  return (
    <header style={{ background: '#fff', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderBottom: '1px solid #e5e7eb', zIndex: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937', margin: 0 }}>
          Mi Malla Curricular
          <span style={{ fontSize: 14, fontWeight: 400, color: '#4b5563', marginLeft: 12 }}>({userData.rut})</span>
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {userData.carreras.length > 0 && (
            <div>
              <label htmlFor="career-select" style={{ fontSize: 13, color: '#374151', marginRight: 8, fontWeight: 600 }}>Carrera:</label>
              <select
                id="career-select"
                value={selectedCareerIndex}
                onChange={(e) => onCareerChange(Number(e.target.value))}
                style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff' }}
              >
                {userData.carreras.map((c, idx) => (
                  <option key={c.codigo + c.catalogo} value={idx}>
                    {c.nombre} (cód: {c.codigo})
                  </option>
                ))}
              </select>
            </div>
          )}
          <button 
            onClick={handleLogout} 
            style={{ 
              padding: '8px 12px', 
              background: '#fee2e2', 
              color: '#991b1b', 
              border: '1px solid #fca5a5', 
              borderRadius: 6, 
              cursor: 'pointer', 
              fontWeight: 600 
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};