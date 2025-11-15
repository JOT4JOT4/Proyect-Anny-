import { useMemo, useCallback } from 'react';
import type { Carrera, Course, Avance, MergedCourse, Prereq } from '../types';
import{ mergeMallaAndAvance, parsePrereqs as parsePrereqsUtil } from '../utils/curriculumHelper';

export const useCourseData = (
  selectedCareer: Carrera | null,
  mallas: Record<string, Course[]>,
  avances: Record<string, Avance[]>
) => {
  // 1. Carrera seleccionada y su clave
  const selectedCareerKey = useMemo(() => {
    return selectedCareer ? `${selectedCareer.codigo}-${selectedCareer.catalogo}` : null;
  }, [selectedCareer]);

  // 2. Datos crudos de malla y avance cruzados
  const merged = useMemo<MergedCourse[]>(() => {
    if (!selectedCareer || !selectedCareerKey) return [];
    const malla = mallas[selectedCareerKey] || [];
    const avance = avances[selectedCareer.codigo] || [];
    return mergeMallaAndAvance(malla, avance); // Usando el helper
  }, [selectedCareer, selectedCareerKey, mallas, avances]);

  // 3. Mapa de cursos para buscar prerrequisitos por código
  const courseMap = useMemo<Record<string, Course>>(() => {
    if (!selectedCareerKey) return {};
    const selectedMalla = mallas[selectedCareerKey] || [];
    const map: Record<string, Course> = {};
    for (const c of selectedMalla) {
      const code = String(c.codigo || c.code || c.id || '').trim();
      if (code) map[code] = c;
    }
    return map;
  }, [selectedCareerKey, mallas]);

  // 4. Función para parsear prerrequisitos (usa el mapa)
  const parsePrereqs = useCallback((curso: Course): Prereq[] => {
    return parsePrereqsUtil(curso, courseMap); 
  }, [courseMap]);

  // 5. Set de códigos aprobados (solo los reales)
  const realApprovedCodes = useMemo(() => {
    const codes = new Set<string>();
    merged.forEach(({ avance, curso }) => {
      const s = String((avance && (avance.status || avance.result)) || '').toLowerCase();
      if (s.includes('aprob')) {
        const code = String(curso.codigo || curso.code || curso.id || '').trim();
        if (code) codes.add(code);
      }
    });
    return codes;
  }, [merged]);
  
  // 6. Lista de niveles disponibles para el filtro
  const niveles = useMemo(() => {
    return Array.from(new Set(merged.map((m: any) => String(m.curso.nivel || m.curso.level || m.curso.semestre || 'N/A').trim())))
      .sort((a: string, b: string) => (parseInt(a) || 999) - (parseInt(b) || 999));
  }, [merged]);

  return { merged, courseMap, parsePrereqs, realApprovedCodes, niveles, selectedCareerKey };
};