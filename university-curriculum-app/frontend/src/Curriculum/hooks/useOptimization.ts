import { useState, useMemo, useEffect } from 'react';
import { calculateOptimizedPlan, type OptimizedPlan } from '../utils/Optimizador';
import type { MergedCourse, Prereq, Course } from '../types';

export const useOptimization = (
  merged: MergedCourse[],
  currentApprovedCodes: Set<string>,
  parsePrereqs: (curso: Course) => Prereq[],
  creditLimit: number,
  manuallyInscribedCodes: Set<string>,
  selectedCareerKey: string | null 
) => {
  const [isOptimizedView, setIsOptimizedView] = useState<boolean>(false);

  // Resetear vista optimizada si cambia la carrera
  useEffect(() => {
    setIsOptimizedView(false);
  }, [selectedCareerKey]);

  const optimizedPlan = useMemo<OptimizedPlan>(() => {
    if (merged.length > 0) {
        return calculateOptimizedPlan(
            merged, 
            currentApprovedCodes, 
            parsePrereqs, 
            creditLimit,
            manuallyInscribedCodes
        );
    }
    return {};
  }, [merged, currentApprovedCodes, parsePrereqs, creditLimit, manuallyInscribedCodes]);

  const optimizedCourseMap = useMemo(() => {
    const map = new Map<string, string>(); // [courseCode, semester]
    if (!isOptimizedView || !optimizedPlan) return map;
    
    Object.entries(optimizedPlan).forEach(([semester, courses]) => {
      if (Array.isArray(courses)) {
        courses.forEach((courseItem: any) => {
          const code = String(courseItem.codigo || '').trim();
          if (code) map.set(code, semester);
        });
      }
    });
    return map;
  }, [optimizedPlan, isOptimizedView]);
  
  const totalOptimizedSemesters = Object.keys(optimizedPlan).length;

  return {
    isOptimizedView,
    setIsOptimizedView,
    optimizedPlan,
    optimizedCourseMap,
    totalOptimizedSemesters
  };
};