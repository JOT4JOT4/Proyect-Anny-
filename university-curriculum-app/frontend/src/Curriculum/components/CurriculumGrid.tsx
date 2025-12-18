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

  const getSemesterNumber = (key: string) => {
    if (key.includes("Inicial") || key.includes("Ahora")) return 0;
    const match = key.match(/(\d+)/); 
    return match ? parseInt(match[0], 10) : 999;
  };

  const groupedByLevel = Array.from(
    new Map(
      decorated.map((item: any) => [item.displayLevel, item])
    ).entries()
  )
  .sort(([keyA], [keyB]) => {
    const a = String(keyA);
    const b = String(keyB);

    if (a.includes("Inicial") || a.includes("Ahora")) return -1;
    if (b.includes("Inicial") || b.includes("Ahora")) return 1;

    const numA = getSemesterNumber(a);
    const numB = getSemesterNumber(b);

    if (numA !== numB) {
        return numA - numB;
    }

    const isSpecialA = a.includes("Periodo") || a.includes("Especial");
    const isSpecialB = b.includes("Periodo") || b.includes("Especial");

    if (!isSpecialA && isSpecialB) return -1; 
    if (isSpecialA && !isSpecialB) return 1;  

    return 0;
  });
  // ----------------------------------------

  return (
    <div className="curriculum-main" style={{ display: 'flex', gap: 8, overflow: 'auto', paddingBottom: 10 }}>
      {groupedByLevel.map(([nivel]) => {
        const nivelCourses = decorated.filter((item: any) => item.displayLevel === String(nivel));
        
        let semesterTitle = String(nivel);
        
        // Formateo de títulos
        if (!isNaN(Number(semesterTitle)) && Number(semesterTitle) < 900) {
             semesterTitle = `Sem ${semesterTitle}`;
        }
        
        if (String(nivel) === '9999' || String(nivel) === 'Pending') {
          semesterTitle = 'Pendientes (Sin Plan)';
        } else if (isOptimizedView && !semesterTitle.includes("Plan:")) {
             if(!semesterTitle.includes("Periodo")) {
                 semesterTitle = `Plan: ${semesterTitle}`; 
             }
        }
        
        // Ocultar columnas vacías aprobadas
        if (isOptimizedView && nivelCourses.every(c => c.isAprob)) return null;

        // Colores
        const isSpecial = String(nivel).includes("Periodo") || String(nivel).includes("Inicial");
        const headerColor = isSpecial ? '#e91e63' : (isOptimizedView ? '#ff9800' : '#2563eb');

        return (
          <section className="curriculum-semester" key={String(nivel)} style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: '60px', minWidth: '80px', flex: '0 0 auto' }}>
            <h2 className="curriculum-semester-title" style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, padding: '4px', background: headerColor, borderRadius: 4, textAlign: 'center' }}>
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