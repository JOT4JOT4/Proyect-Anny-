import { useState, useMemo, useEffect } from 'react';
import type { MergedCourse } from '../types';

export type OptimizedPlan = Record<string, {
    codigo: string;
    nombre: string;
    creditos: number;
    nivel: string;
}[]>;

export const useOptimization = (
  merged: MergedCourse[],
  currentApprovedCodes: Set<string>,
  creditLimit: number,
  manuallyInscribedCodes: Set<string>,
  selectedCareerKey: string | null 
) => {
  const [isOptimizedView, setIsOptimizedView] = useState<boolean>(false);
  
  const [optimizedPlan, setOptimizedPlan] = useState<OptimizedPlan>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsOptimizedView(false);
    setOptimizedPlan({}); 
  }, [selectedCareerKey]);


  useEffect(() => {
    if (merged.length === 0) return;

    const fetchOptimizedPlan = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/mallas/optimize-plan', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mergedCourses: merged,
            creditLimit: creditLimit,
            approvedCodes: Array.from(currentApprovedCodes),
            manuallyInscribedCodes: Array.from(manuallyInscribedCodes)
          }),
        });

        if (!response.ok) {
          throw new Error('Error al calcular el plan');
        }

        const data: OptimizedPlan = await response.json();
        setOptimizedPlan(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo optimizar el plan.');
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
        fetchOptimizedPlan();
    }, 300); 

    return () => clearTimeout(timeoutId);

  }, [merged, currentApprovedCodes, creditLimit, manuallyInscribedCodes]);

  const optimizedCourseMap = useMemo(() => {
    const map = new Map<string, string>(); 
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
    totalOptimizedSemesters,
    isLoading, 
    error    
  };
};