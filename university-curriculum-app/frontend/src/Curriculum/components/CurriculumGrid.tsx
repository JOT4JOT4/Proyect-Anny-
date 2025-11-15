import React from 'react';
import type { DecoratedCourse, Prereq, SimulationStatus, Course } from '../types';
import { CourseCube } from './CourseCube';

interface Props {
  decorated: DecoratedCourse[];
  isOptimizedView: boolean;
  hoveredKey: string | null;
  simulationMode: 'nextSemester' | 'freePlay';
  parsePrereqs: (curso: Course) => Prereq[];
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>, key: string, prereqs: Prereq[]) => void;
  onMouseLeave: () => void;
  onSimulateStatus: (codigo: string, newStatus: SimulationStatus) => void;
}

export const CurriculumGrid: React.FC<Props> = ({
  decorated, isOptimizedView, hoveredKey, simulationMode,
  parsePrereqs, onMouseEnter, onMouseLeave, onSimulateStatus
}) => {
  if (decorated.length === 0) {
    return (
      <div style={{ padding: 24, background: '#fff', borderRadius: 8, textAlign: 'center', color: '#6b7280' }}>
        No hay ramos para los filtros seleccionados
      </div>
    );
  }

  const groupedByLevel = Array.from(
    new Map(
      decorated.map((item: any) => [item.displayLevel, item])
    ).entries()
  )
  .sort(([a], [b]) => (parseInt(String(a).replace(/\D/g, '')) || 999) - (parseInt(String(b).replace(/\D/g, '')) || 999));

  return (
    <div className="curriculum-main" style={{ display: 'flex', gap: 8, overflow: 'auto', paddingBottom: 10 }}>
      {groupedByLevel.map(([nivel]) => {
        const nivelCourses = decorated.filter((item: any) => item.displayLevel === String(nivel));
        
        let semesterTitle = `Sem ${String(nivel)}`;
        if (String(nivel) === '9999') {
          semesterTitle = 'Pendientes (Sin Plan)';
        } else if (isOptimizedView) {
          semesterTitle = `Plan: Sem ${String(nivel)}`;
        }
        
        if (isOptimizedView && nivelCourses.every(c => c.isAprob)) return null;

        return (
          <section className="curriculum-semester" key={String(nivel)} style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: '60px', minWidth: '80px', flex: '0 0 auto' }}>
            <h2 className="curriculum-semester-title" style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, padding: '2px', background: isOptimizedView ? '#ff9800' : '#2563eb', borderRadius: 4, textAlign: 'center' }}>
              {semesterTitle}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {nivelCourses.map((item, idx) => {
                const cubeKey = `${item.cursoCodigo}-${nivel}`;
                const prereqs = parsePrereqs(item.curso);
                return (
                  <CourseCube
                    key={item.cursoCodigo + idx}
                    item={item}
                    cubeKey={cubeKey}
                    isHovered={hoveredKey === cubeKey}
                    prereqs={prereqs}
                    simulationMode={simulationMode}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onSimulateStatus={onSimulateStatus}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};