import { useEffect, useState, useMemo } from 'react';
import type { UserData, Carrera, Course, Avance, MergedCourse } from '../types';
import { buildCourseMaps } from '../utils/curriculumUtils';


const mergedCoursesFor = (malla: Course[], avance: Avance[]): MergedCourse[] => {
  const avanceMap: Record<string, Avance> = {};
  for (const a of avance) {
    const candidates = [a.codigo, a.course, a.courseCode, a['course_code'], a['courseCodigo'], a.asignatura];
    const found = candidates.find((f: any) => f !== undefined && f !== null);
    if (found) avanceMap[String(found).trim()] = a;
  }

  const findAv = (codigo: string): Avance | undefined => {
    if (!codigo) return undefined;
    if (avanceMap[codigo]) return avanceMap[codigo];
    const lower = codigo.toLowerCase();
    const exact = Object.keys(avanceMap).find(k => k.toLowerCase() === lower);
    if (exact) return avanceMap[exact];
    return undefined; 
  };

  return malla.map((curso: Course) => ({
    curso,
    avance: findAv(String(curso.codigo || curso.code || curso.id || '')),
  }));
};

export const useCurriculumData = (userData: UserData | null, selectedCareer: Carrera | undefined) => {
  const [mallas, setMallas] = useState<Record<string, Course[]>>({});
  const [avances, setAvances] = useState<Record<string, Avance[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      if (!userData) return;
      setLoading(true);
      setError(null);
      try {
        const newMallas: Record<string, Course[]> = {};
        const newAvances: Record<string, Avance[]> = {};

        for (const carrera of userData.carreras) {
          const key = `${carrera.codigo}-${carrera.catalogo}`;
          // Fetch malla
          try {
            const res = await fetch(`http://localhost:3000/mallas/${carrera.codigo}/${carrera.catalogo}`);
            newMallas[key] = res.ok ? await res.json() : [];
          } catch (err) {
            console.error('Error fetching malla', err);
            newMallas[key] = [];
          }

          // Fetch avance
          try {
            const avRes = await fetch(`http://localhost:3000/mallas/avance?rut=${encodeURIComponent(userData.rut)}&codcarrera=${encodeURIComponent(carrera.codigo)}`);
            newAvances[carrera.codigo] = avRes.ok ? await avRes.json() : [];
          } catch (err) {
            console.error('Error fetching avance', err);
            newAvances[carrera.codigo] = [];
          }
        }
        setMallas(newMallas);
        setAvances(newAvances);
      } catch (err) {
        setError('Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userData]);

  const { selectedMalla, selectedAvance, mergedCourses, courseMap, normalizedCourseMap, niveles } = useMemo(() => {
    if (!selectedCareer) {
      return { selectedMalla: [], selectedAvance: [], mergedCourses: [], courseMap: {}, normalizedCourseMap: {}, niveles: [] };
    }

    const key = `${selectedCareer.codigo}-${selectedCareer.catalogo}`;
    const selectedMalla = mallas[key] || [];
    const selectedAvance = avances[selectedCareer.codigo] || [];
    
    const mergedCourses = mergedCoursesFor(selectedMalla, selectedAvance);
    
    const { courseMap, normalizedCourseMap } = buildCourseMaps(selectedMalla);

    const niveles = Array.from(new Set(mergedCourses.map((m: MergedCourse) => String(m.curso.nivel || m.curso.level || m.curso.semestre || 'N/A').trim())))
      .sort((a: string, b: string) => (parseInt(a) || 999) - (parseInt(b) || 999));

    return { selectedMalla, selectedAvance, mergedCourses, courseMap, normalizedCourseMap, niveles };
  }, [selectedCareer, mallas, avances]);

  return {
    loading,
    error,
    mergedCourses,
    selectedAvance,
    courseMap,
    normalizedCourseMap,
    niveles,
  };
};