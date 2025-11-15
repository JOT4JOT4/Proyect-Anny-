import { useMemo } from 'react';
import type { MergedCourse, SimulationStatus, DecoratedCourse } from '../types';

export const useDecoratedCourses = (
  merged: MergedCourse[],
  isOptimizedView: boolean,
  optimizedCourseMap: Map<string, string>,
  filterLevel: string,
  showAprob: boolean,
  showReprob: boolean,
  showInscrito: boolean,
  realApprovedCodes: Set<string>,
  simulatedStatus: Record<string, SimulationStatus>
) => {
  const decorated = useMemo<DecoratedCourse[]>(() => {
    return merged.map((item: any) => {
      const curso = item.curso;
      const cursoCodigo = String(curso.codigo || curso.code || curso.id || '').trim();
      const originalNivel = String(curso.nivel || curso.level || curso.semestre || 'N/A').trim();

      let displayLevel: string;
      if (isOptimizedView) {
        displayLevel = optimizedCourseMap.get(cursoCodigo) || '9999';
      } else {
        displayLevel = originalNivel;
      }
      
      const avance = item.avance || {};
      const rawStatus = String((avance.status || avance.inscriptionType || avance.result || '') || '').toLowerCase();
      const currentSimulatedStatus = simulatedStatus[cursoCodigo];
      const finalStatus = currentSimulatedStatus ? currentSimulatedStatus.toLowerCase() : rawStatus;

      const isAprob = finalStatus.includes('aprob');
      const isReprob = finalStatus.includes('reprob') || finalStatus.includes('repr') || finalStatus.includes('failed');
      const isInscrito = finalStatus.includes('inscrito') || finalStatus.includes('inscr') || finalStatus.includes('registered') || finalStatus.includes('enrolled');
      const isPending = !isAprob && !isReprob && !isInscrito;

      let statusMatch = false;
      if (isAprob && showAprob) {
        statusMatch = true;
      } else if (isReprob && showReprob) {
        statusMatch = true;
      } else if (isInscrito && showInscrito) {
        statusMatch = true;
      } else if (isPending) {
        // Esta es la lógica original (un poco extraña, pero la respetamos)
        if (showAprob && showReprob && showInscrito) {
          statusMatch = true;
        }
      }

      const levelMatch = filterLevel === 'ALL' || filterLevel === originalNivel;
      const shouldFade = !(statusMatch && levelMatch);

      return {
        ...item,
        cursoCodigo,
        nivel: originalNivel, 
        displayLevel,       
        isAprob,
        isReprob,
        isInscrito,
        isPending,
        finalStatus,
        isRealApproved: realApprovedCodes.has(cursoCodigo),
        currentSimulatedStatus,
        shouldFade
      };
    });
  }, [
    merged, isOptimizedView, optimizedCourseMap, filterLevel,
    showAprob, showReprob, showInscrito, realApprovedCodes, simulatedStatus
  ]);

  return decorated;
};