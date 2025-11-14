import React from 'react';
import type { DecoratedCourse, Prerequisite } from '../types';
import { CourseCube } from './CourseCube';

interface Props {
  nivel: string;
  courses: DecoratedCourse[];
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

export const SemesterColumn: React.FC<Props> = ({
  nivel,
  courses,
  simulatedThisCareer,
  ...rest 
}) => {
  return (
    <section className="curriculum-semester" key={nivel} style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: '60px', minWidth: '80px', flex: '0 0 auto' }}>
      <h2 className="curriculum-semester-title" style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0, padding: '2px', background: '#2563eb', borderRadius: 4, textAlign: 'center' }}>
        Sem {nivel}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {courses.map((item, idx) => (
          <CourseCube
            key={`${item.cursoCodigo}-${idx}`}
            item={item}
            isSimSelected={simulatedThisCareer.has(`${item.cursoCodigo}-${item.nivel}`)}
            {...rest}
          />
        ))}
      </div>
    </section>
  );
};