import { useState, useEffect, useMemo } from 'react';
import type { Course, Avance, DecoratedCourse, ToastData } from '../types';
import { normalizeCode, parsePrereqs, getCreditsFromCourse } from '../utils/curriculumUtils';

const loadFromStorage = (): Record<string, string[]> => {
  try {
    const raw = localStorage.getItem('simulatedSelections');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const checkPrerequisites = (
  curso: Course,
  normalizedCourseMap: Record<string, Course>,
  selectedAvance: Avance[],
): { met: boolean; missingNames: string[] } => {
  const prereqs = parsePrereqs(curso, normalizedCourseMap);
  if (prereqs.length === 0) return { met: true, missingNames: [] };

  const missingNames: string[] = [];
  for (const prereq of prereqs) {
    const rawCode = String(prereq.code || '').trim();
    if (!rawCode) continue;
    
    const norm = normalizeCode(rawCode);
    if (!norm || !normalizedCourseMap[norm]) continue; 

    const prereqInAvance = selectedAvance.find((a: Avance) => {
      const candidates = [a.codigo, a.course, a.courseCode, a['course_code'], a['courseCodigo'], a.asignatura];
      return candidates.some((f: any) => normalizeCode(f) === norm);
    });


    const isApproved = prereqInAvance && String((
      prereqInAvance.status || 
      prereqInAvance.inscriptionType || 
      prereqInAvance.result || 
      ''
    ) || '').toLowerCase().includes('aprob');

    if (!isApproved) {
      missingNames.push(prereq.name || rawCode);
    }
  }
  return { met: missingNames.length === 0, missingNames };
};


export const useSimulation = (
  careerKey: string,
  decoratedCourses: DecoratedCourse[],
  normalizedCourseMap: Record<string, Course>,
  selectedAvance: Avance[],
) => {
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulatedMap, setSimulatedMap] = useState<Record<string, string[]>>(loadFromStorage);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    try {
      localStorage.setItem('simulatedSelections', JSON.stringify(simulatedMap));
    } catch (e) {
      console.error('Failed to save simulation to localStorage', e);
    }
  }, [simulatedMap]);

  const simulatedKeys = useMemo(() => simulatedMap[careerKey] || [], [simulatedMap, careerKey]);
  const simulatedThisCareer = useMemo(() => new Set(simulatedKeys), [simulatedKeys]);

  const decoratedMap = useMemo(() =>
    new Map<string, DecoratedCourse>(decoratedCourses.map(it => [`${it.cursoCodigo}-${it.nivel}`, it])),
  [decoratedCourses]);

  const simulatedCredits = useMemo(() =>
    simulatedKeys.reduce((sum: number, k: string) => {
      const it = decoratedMap.get(k);
      return sum + (it ? getCreditsFromCourse(it.curso) : 0);
    }, 0),
  [simulatedKeys, decoratedMap]);


  const toggleSimulated = (key: string) => {
    const next = { ...simulatedMap };
    const arr = new Set(next[careerKey] || []);
    const isAdding = !arr.has(key);

    const candidate = decoratedMap.get(key);
    if (!candidate) return;

    if (isAdding) {
      const { met, missingNames } = checkPrerequisites(
        candidate.curso,
        normalizedCourseMap,
        selectedAvance
      );
      
      if (!met) {
        setToast({ message: `Prerequisitos faltantes: ${missingNames.join(', ')}.`, type: 'error' });
        return;
      }
      
      const currentCredits = Array.from(arr).reduce((sum, k) => {
        const it = decoratedMap.get(k);
        return sum + (it ? getCreditsFromCourse(it.curso) : 0);
      }, 0);
      const candidateCredits = getCreditsFromCourse(candidate.curso);

      if (currentCredits + candidateCredits > 30) {
        setToast({ message: 'No puedes seleccionar más de 30 créditos.', type: 'error' });
        return;
      }
    }

    if (arr.has(key)) arr.delete(key); else arr.add(key);
    next[careerKey] = Array.from(arr);
    setSimulatedMap(next);
  };

  const clearSimulatedForCareer = () => {
    const next = { ...simulatedMap };
    delete next[careerKey];
    setSimulatedMap(next);
  };

  return {
    isSimulating,
    setIsSimulating,
    toast,
    setToast,
    simulatedKeys,
    simulatedThisCareer,
    simulatedCredits,
    decoratedMap,
    toggleSimulated,
    clearSimulatedForCareer,
  };
};