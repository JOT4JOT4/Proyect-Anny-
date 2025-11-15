import React from 'react';
import type { DecoratedCourse, Prereq, SimulationStatus } from '../types';

interface Props {
  item: DecoratedCourse;
  cubeKey: string;
  isHovered: boolean;
  prereqs: Prereq[];
  simulationMode: 'nextSemester' | 'freePlay';
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>, key: string, prereqs: Prereq[]) => void;
  onMouseLeave: () => void;
  onSimulateStatus: (codigo: string, newStatus: SimulationStatus) => void;
}

export const CourseCube: React.FC<Props> = ({
  item, cubeKey, isHovered, prereqs, simulationMode,
  onMouseEnter, onMouseLeave, onSimulateStatus
}) => {
  const {
    curso, shouldFade, isRealApproved,
    currentSimulatedStatus, isAprob, isReprob, isInscrito, cursoCodigo
  } = item;

  let bgColor = '#f3f4f6';
  let borderColor = '#d1d5db';
  let statusBgColor = '#9ca3af';
  let statusTextColor = '#fff';

  if (isAprob) {
    bgColor = isRealApproved ? '#d1fae5' : '#bbffc8';
    borderColor = '#10b981';
    statusBgColor = '#10b981';
  } else if (isReprob) {
    bgColor = isRealApproved ? '#fee2e2' : '#ffc4b9';
    borderColor = '#ef4444';
    statusBgColor = '#ef4444';
  } else if (isInscrito) {
    bgColor = '#fffbe5';
    borderColor = '#facc15';
    statusBgColor = '#facc15';
    statusTextColor = '#000';
  }

  const isFaded = Boolean(shouldFade);
  const transformValue = isHovered ? 'translateY(-3px) scale(1.02)' : 'translateY(0)';
  const boxShadowValue = isHovered ? '0 6px 18px rgba(0,0,0,0.18)' : '0 1px 2px rgba(0,0,0,0.08)';

  return (
    <div
      className="curriculum-cube"
      onMouseEnter={(e) => onMouseEnter(e, cubeKey, prereqs)}
      onMouseLeave={onMouseLeave}
      style={{
        transition: 'transform 160ms ease, box-shadow 160ms ease, opacity 200ms ease, filter 200ms ease',
        boxShadow: boxShadowValue,
        transform: transformValue,
        opacity: isFaded ? 0.38 : 1,
        filter: isFaded ? 'grayscale(80%) blur(1px)' : 'none',
        background: bgColor, border: `2px solid ${borderColor}`,
        position: 'relative', width: '85%', minHeight: '80px', borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer',
      }}
    >

      <div style={{ padding: '8px' }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: '#1f2937', margin: 0, lineHeight: 1.3, maxHeight: '2.6em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {curso.asignatura || curso.nombre || curso.name || 'Sin Nombre'}
        </p>
        <code style={{ fontSize: 9, color: '#6b7280', display: 'block', marginTop: 4, padding: '2px 4px', background: 'rgba(0,0,0,0.05)', borderRadius: 3 }}>
          {cursoCodigo}
        </code>
      </div>

      <div style={{ fontSize: 8, padding: '2px 4px', borderRadius: 3, background: statusBgColor, color: statusTextColor, textAlign: 'center', fontWeight: 600, marginTop: 6 }}>
        {isAprob ? `✅ ${isRealApproved ? 'APROBADO REAL' : 'APROBADO SIM'}` :
          isReprob ? `❌ ${isRealApproved ? 'REPROBADO REAL' : 'REPROBADO SIM'}` :
          isInscrito ? `📖 INSCRITO ${isRealApproved ? 'REAL' : 'SIM'}` :
          '— PENDIENTE'}
      </div>

      {!isRealApproved && (
        <div style={{ display: 'flex', gap: 4, marginTop: 6, justifyContent: 'center' }}>
          <button
            onClick={() => onSimulateStatus(cursoCodigo, 'INSCRITO')}
            disabled={currentSimulatedStatus === 'INSCRITO'}
            style={{ padding: '2px 5px', fontSize: 9, borderRadius: 3, cursor: 'pointer', border: 'none', background: currentSimulatedStatus === 'INSCRITO' ? '#00bcd4' : '#e0f7fa', color: currentSimulatedStatus === 'INSCRITO' ? '#fff' : '#000', fontWeight: 600 }}
          >
            Inscribir
          </button>

          {simulationMode === 'freePlay' && (
            <>
              <button onClick={() => onSimulateStatus(cursoCodigo, 'APROBADO')} disabled={currentSimulatedStatus === 'APROBADO'} style={{ padding: '2px 5px', fontSize: 9, borderRadius: 3, cursor: 'pointer', border: 'none', background: currentSimulatedStatus === 'APROBADO' ? '#10b981' : '#d1fae5', color: currentSimulatedStatus === 'APROBADO' ? '#fff' : '#000', fontWeight: 600 }}>
                Aprob
              </button>
              <button onClick={() => onSimulateStatus(cursoCodigo, 'REPROBADO')} disabled={currentSimulatedStatus === 'REPROBADO'} style={{ padding: '2px 5px', fontSize: 9, borderRadius: 3, cursor: 'pointer', border: 'none', background: currentSimulatedStatus === 'REPROBADO' ? '#ef4444' : '#fee2e2', color: currentSimulatedStatus === 'REPROBADO' ? '#fff' : '#000', fontWeight: 600 }}>
                Reprob
              </button>
            </>
          )}

          {currentSimulatedStatus && (
            <button onClick={() => onSimulateStatus(cursoCodigo, null)} style={{ padding: '2px 5px', fontSize: 9, borderRadius: 3, cursor: 'pointer', border: 'none', background: '#9ca3af', color: '#fff', fontWeight: 600 }}>
              Reset
            </button>
          )}
        </div>
      )}
    </div>
  );
};