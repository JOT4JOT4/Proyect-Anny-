import React from 'react';
import type { DecoratedCourse, Prerequisite } from '../types';
import { parsePrereqs } from '../utils/curriculumUtils';

interface Props {
  item: DecoratedCourse;
  isSimulating: boolean;
  isSimSelected: boolean;
  hoveredKey: string | null;
  normalizedCourseMap: Record<string, any>;
  onToggleSimulate: (key: string) => void;
  getCourseCubeHandlers: (cubeKey: string, prereqs: Prerequisite[]) => {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave: () => void;
  };
}

export const CourseCube: React.FC<Props> = ({
  item,
  isSimulating,
  isSimSelected,
  hoveredKey,
  normalizedCourseMap,
  onToggleSimulate,
  getCourseCubeHandlers,
}) => {
  const { curso, avance, shouldFade, cursoCodigo, nivel } = item;
  
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

  const prereqs = parsePrereqs(curso, normalizedCourseMap);

  const isFaded = Boolean(shouldFade);
  const transformValue = hoveredKey === cubeKey ? 'translateY(-3px) scale(1.02)' : 'translateY(0)';
  const boxShadowValue = hoveredKey === cubeKey ? '0 6px 18px rgba(0,0,0,0.18)' : '0 1px 2px rgba(0,0,0,0.08)';

  const finalBg = isSimSelected ? '#e6f0ff' : bgColor;
  const finalBorder = isSimSelected ? '2px solid #3b82f6' : `2px solid ${borderColor}`;

  return (
    <div
      className="curriculum-cube"
      key={cubeKey}
      onClick={(e) => {
        if (isSimulating) {
          e.stopPropagation();
          onToggleSimulate(cubeKey);
        }
      }}
      {...getCourseCubeHandlers(cubeKey, prereqs)}
      style={{
        position: 'relative',
        width: '85%',
        minHeight: '80px',
        borderRadius: 4,
        background: finalBg,
        border: finalBorder,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 160ms ease, box-shadow 160ms ease, opacity 200ms ease, filter 200ms ease',
        boxShadow: boxShadowValue,
        transform: transformValue,
        opacity: isFaded ? 0.38 : 1,
        filter: isFaded ? 'grayscale(80%) blur(1px)' : 'none',
        color: isSimSelected ? '#0f172a' : undefined,
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 10, color: '#374151', wordBreak: 'break-word' }}>
          {curso.asignatura || curso.nombre || 'Sin nombre'}
        </div>
        <div style={{ fontSize: 9, color: '#6b7280', marginTop: 2, lineHeight: 1.2, wordBreak: 'break-word' }}>
          {cursoCodigo}
        </div>
      </div>
      <div style={{ fontSize: 8, padding: '2px 4px', borderRadius: 3, background: statusBgColor, color: statusTextColor, textAlign: 'center', fontWeight: 600, marginTop: 6 }}>
        {statusStr.includes('aprob') ? '✓ APROB' : statusStr.includes('reprob') || statusStr.includes('repr') ? '✗ REPROB' : '—'}
      </div>
    </div>
  );
};