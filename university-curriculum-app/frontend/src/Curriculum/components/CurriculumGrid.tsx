import React, { useMemo } from 'react';
import type { DecoratedCourse, Prerequisite } from '../types'; 
import { SemesterColumn } from './SemestreColumn';


interface Props {
  decoratedCourses: DecoratedCourse[];
  isSimulating: boolean;
  simulatedThisCareer: Set<string>;
  hoveredKey: string | null;
  normalizedCourseMap: Record<string, any>;
  onToggleSimulate: (key: string) => void;
  getCourseCubeHandlers: (cubeKey: string, prereqs: Prerequisite[]) => {
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave: () => void;
  };
}

export const CurriculumGrid: React.FC<Props> = ({ 
  decoratedCourses, 
  ...rest
}) => {

  const coursesByNivel = useMemo(() => {
    const grouped = new Map<string, DecoratedCourse[]>();
    for (const item of decoratedCourses) {
      const nivel = item.nivel;
      if (!grouped.has(nivel)) {
        grouped.set(nivel, []);
      }
      grouped.get(nivel)!.push(item);
    }

    return Array.from(grouped.entries()).sort(([a], [b]) => {
      const aNum = parseInt(String(a)) || 999;
      const bNum = parseInt(String(b)) || 999;
      return aNum - bNum;
    });
  }, [decoratedCourses]);

  if (decoratedCourses.length === 0) {
    return (
      <div style={{ padding: 24, background: '#fff', borderRadius: 8, textAlign: 'center', color: '#6b7280' }}>
        No hay ramos para los filtros seleccionados
      </div>
    );
  }

  return (
    <div className="curriculum-main" style={{ display: 'flex', gap: 8, overflow: 'auto', paddingBottom: 10 }}>
      {coursesByNivel.map(([nivel, courses]) => (
        <SemesterColumn
          key={nivel}
          nivel={nivel}
          courses={courses}
          {...rest} 
        />
      ))}
    </div>
  );
};