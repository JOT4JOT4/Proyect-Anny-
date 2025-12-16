import { useState, useMemo, useEffect } from 'react';
import type { MergedCourse, ToastState } from '../types';

interface SavedPlanSummary {
  _id: string;
  nombre: string;
  updatedAt: string;
}

export const useOptimization = (
  merged: MergedCourse[],
  currentApprovedCodes: Set<string>,
  creditLimit: number,
  manuallyInscribedCodes: Set<string>,
  selectedCareerKey: string | null,
  userRut: string,
  selectedCareerCode: string,
  setToast: (toast: ToastState) => void
) => {
  const [isOptimizedView, setIsOptimizedView] = useState<boolean>(false);
  const [optimizedPlan, setOptimizedPlan] = useState<any>({}); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [currentPlanName, setCurrentPlanName] = useState<string>('');
  const [savedPlans, setSavedPlans] = useState<SavedPlanSummary[]>([]);

  useEffect(() => {
    setIsOptimizedView(false);
    setOptimizedPlan({});
    setCurrentPlanId(null);
    setCurrentPlanName('');
    setSavedPlans([]); 
  }, [selectedCareerKey]);

  useEffect(() => {
    if (!userRut || !selectedCareerCode) return;
    fetchSavedPlansList();
  }, [userRut, selectedCareerCode]);

  const fetchSavedPlansList = async () => {
    try {
      const res = await fetch(`http://localhost:3000/mallas/mis-proyecciones?rut=${userRut}&codCarrera=${selectedCareerCode}&sort=date`);
      if (res.ok) {
        const data = await res.json();
        setSavedPlans(data);
      }
    } catch (e) {
      console.error("Error al listar planes", e);
    }
  };

  // OPTIMIZAR
  const generateOptimization = async () => {
    if (merged.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/mallas/optimize-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mergedCourses: merged,
          creditLimit: creditLimit,
          approvedCodes: Array.from(currentApprovedCodes),
          manuallyInscribedCodes: Array.from(manuallyInscribedCodes)
        }),
      });

      if (!response.ok) throw new Error('Error al calcular el plan');
      const data = await response.json();
      
      setOptimizedPlan(data || {});
      setIsOptimizedView(true);
      setCurrentPlanId(null); 
    } catch (err) {
      console.error(err);
      setError('No se pudo optimizar el plan.');
      setToast({ message: 'Error al generar la optimización.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // GUARDAR PLAN
  const savePlan = async () => {
    // Protección: Si optimizedPlan es nulo o vacío, no guardamos
    if (!optimizedPlan || Object.keys(optimizedPlan).length === 0) {
      setToast({ message: 'No hay un plan optimizado válido para guardar.', type: 'error' });
      return;
    }

    let nombreFinal = currentPlanName;

    if (!currentPlanId || !nombreFinal) {
      const input = prompt("Ingresa un nombre para guardar este plan:", currentPlanName || "Mi Plan");
      if (!input) return; 
      nombreFinal = input;
    }

    try {
      const payload = {
        rut: userRut,
        codCarrera: selectedCareerCode,
        nombre: nombreFinal,
        plan: optimizedPlan,
        id: currentPlanId 
      };

      const response = await fetch('http://localhost:3000/mallas/save-proyeccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Error al guardar");

      const planGuardado = await response.json();
      
      setCurrentPlanId(planGuardado._id);
      setCurrentPlanName(planGuardado.nombre);
      setToast({ message: `Plan "${planGuardado.nombre}" guardado.`, type: 'success' });
      
      fetchSavedPlansList();

    } catch (err) {
      console.error(err);
      setToast({ message: 'Error al guardar el plan.', type: 'error' });
    }
  };

  // CARGAR PLAN POR ID
  const loadPlan = async (planId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/mallas/proyeccion/${planId}`);
      if (!res.ok) throw new Error("No encontrado");
      
      const doc = await res.json();

      console.log("DOCUMENTO RECIBIDO DE BD:", doc);
      
      const planData = doc.matrizResultante || {}; 
      
      setOptimizedPlan(planData);
      setIsOptimizedView(true);
      setCurrentPlanId(doc._id);
      setCurrentPlanName(doc.nombre);
      
      setToast({ message: `Plan "${doc.nombre}" cargado.`, type: 'success' });
    } catch (e) {
      console.error(e);
      setToast({ message: 'Error al cargar el plan.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // LIMPIAR
  const clearPlan = () => {
    setOptimizedPlan({});
    setIsOptimizedView(false);
    setCurrentPlanId(null);
    setCurrentPlanName('');
  };

  const optimizedCourseMap = useMemo(() => {
    const map = new Map<string, string>(); 
    if (!isOptimizedView || !optimizedPlan) return map;
    
    Object.entries(optimizedPlan).forEach(([semesterKey, courses]) => {
      const semesterNumber = semesterKey.replace('Semestre ', '').trim();
      if (Array.isArray(courses)) {
        courses.forEach((courseItem: any) => {
          const code = String(courseItem.codigo || '').trim();
          if (code) map.set(code, semesterNumber);
        });
      }
    });
    return map;
  }, [optimizedPlan, isOptimizedView]);

  // ELIMINAR PLAN 
  const deletePlan = async (planId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este plan permanentemente?')) return;

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/mallas/proyeccion/${planId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setToast({ message: 'Plan eliminado correctamente.', type: 'success' });

      if (currentPlanId === planId) {
        clearPlan();
      }

      fetchSavedPlansList();

    } catch (e) {
      console.error(e);
      setToast({ message: 'Error al eliminar el plan.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  
  const totalOptimizedSemesters = optimizedPlan ? Object.keys(optimizedPlan).length : 0;

  return {
    isOptimizedView,
    setIsOptimizedView,
    optimizedPlan,
    optimizedCourseMap,
    totalOptimizedSemesters,
    isLoading,
    error,
    generateOptimization,
    savePlan,
    loadPlan,
    clearPlan,
    deletePlan,
    savedPlans,
    currentPlanName,
    currentPlanId
  };
};