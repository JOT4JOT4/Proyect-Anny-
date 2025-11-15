import { useState, useMemo, useCallback, useEffect } from 'react';
import type { SimulationStatus, SimulationMode, MergedCourse, Prereq, ToastState, Course } from '../types';

export const useSimulation = (
  realApprovedCodes: Set<string>,
  merged: MergedCourse[],
  parsePrereqs: (curso: Course) => Prereq[],
  setToast: (toast: ToastState) => void,
  selectedCareerKey: string | null 
) => {
  const [simulatedStatus, setSimulatedStatus] = useState<Record<string, SimulationStatus>>({});
  const [simulationMode, setSimulationMode] = useState<SimulationMode>('nextSemester');
  const [creditLimit, setCreditLimit] = useState<number>(30);

  // Resetear simulación si cambia la carrera
  useEffect(() => {
    setSimulatedStatus({});
  }, [selectedCareerKey]);

  // Códigos Aprobados Actuales 
  const currentApprovedCodes = useMemo(() => {
    const codes = new Set<string>(realApprovedCodes);
    Object.keys(simulatedStatus).forEach(code => {
      if (simulatedStatus[code] === 'APROBADO') codes.add(code);
      else if (simulatedStatus[code] === 'REPROBADO') codes.delete(code);
    });
    return codes;
  }, [realApprovedCodes, simulatedStatus]);

  const manuallyInscribedCodes = useMemo(() => {
    const codes = new Set<string>();
    Object.entries(simulatedStatus).forEach(([code, status]) => {
        if (status === 'INSCRITO') codes.add(code);
    });
    return codes;
  }, [simulatedStatus]);

  // Función de Simulación
  const handleSimulateStatus = useCallback((
      codigo: string, 
      newStatus: SimulationStatus
  ) => {
      if (realApprovedCodes.has(codigo)) return; 
      
      if (simulationMode === 'nextSemester' && newStatus !== 'INSCRITO' && newStatus !== null) {
          setToast({ message: "En el modo 'Próximo Semestre', solo puedes simular como 'Inscrito'.", type: 'error' });
          return;
      }

      if (newStatus === 'INSCRITO') {
          const courseItem = merged.find(m => String(m.curso.codigo || m.curso.code || m.curso.id || '').trim() === codigo);
          if (courseItem) {
              const prereqs = parsePrereqs(courseItem.curso);
              const missingReqs = prereqs.filter(req => !currentApprovedCodes.has(req.code));
              if (missingReqs.length > 0) {
                  const missingNames = missingReqs.map(r => r.name || r.code).join(', ');
                  setToast({ message: `Requisitos faltantes: ${missingNames}`, type: 'error' });
                  return; 
              }
          }
      }
          
      setSimulatedStatus(prev => {
          const newState = { ...prev };
          if (newStatus === null) delete newState[codigo];
          else newState[codigo] = newStatus;
          return newState;
      });
  }, [realApprovedCodes, simulationMode, merged, parsePrereqs, currentApprovedCodes, setToast]);
  
  const resetSimulation = useCallback(() => {
    setSimulatedStatus({});
  }, []);

  return {
    simulatedStatus,
    simulationMode,
    setSimulationMode,
    creditLimit,
    setCreditLimit,
    currentApprovedCodes,
    manuallyInscribedCodes,
    handleSimulateStatus,
    resetSimulation
  };
};