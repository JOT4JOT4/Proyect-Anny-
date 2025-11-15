import React from 'react';
import type { Prereq } from '../types';

interface Props {
  tooltipPos: { left: number; top: number } | null;
  tooltipPrereqs: Prereq[];
}

export const PrerequisiteTooltip: React.FC<Props> = ({ tooltipPos, tooltipPrereqs }) => {
  if (!tooltipPos || tooltipPrereqs.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      left: tooltipPos.left,
      top: tooltipPos.top,
      transform: 'translateX(-50%) translateY(-100%)', 
      padding: '10px 15px',
      background: 'rgba(20, 20, 20, 0.95)',
      color: '#fff',
      borderRadius: 8,
      boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
      zIndex: 1000,
      maxWidth: 300,
      pointerEvents: 'none',
      border: '1px solid #555',
    }}>
      <h5 style={{ margin: '0 0 8px', fontSize: 14, borderBottom: '1px solid #444', paddingBottom: 5, fontWeight: 700 }}>
        Prerrequisitos
      </h5>
      <ul style={{ margin: 0, padding: '0 0 0 16px', listStyle: 'disc' }}>
        {tooltipPrereqs.map(p => (
          <li key={p.code} style={{ fontSize: 12, marginBottom: 4 }}>
            {p.name ? `${p.name} (${p.code})` : p.code}
          </li>
        ))}
      </ul>
    </div>
  );
};