import React from 'react';
import type { TooltipData } from '../types';

type Props = TooltipData;

export const PrerequisiteTooltip: React.FC<Props> = ({ pos, prereqs }) => {
  if (!pos || prereqs.length === 0) return null;

  return (
    <div style={{ position: 'fixed', left: pos.left, top: pos.top, background: '#fff', border: '1px solid #d1d5db', borderRadius: 4, padding: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', zIndex: 9999, minWidth: 160, fontSize: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6, color: '#374151' }}>Req:</div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {prereqs.slice(0, 6).map((p, ii) => (
          <li key={ii} style={{ padding: '2px 0', color: '#374151' }}>{p.code}{p.name ? ` — ${p.name}` : ''}</li>
        ))}
        {prereqs.length > 6 && <li style={{ padding: '2px 0', color: '#9ca3af' }}>+{prereqs.length - 6}</li>}
      </ul>
    </div>
  );
};