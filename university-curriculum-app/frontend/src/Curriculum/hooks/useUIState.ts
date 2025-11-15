import { useState } from 'react';
import type { Prereq } from '../types';

export const useUIState = () => {
  // Tooltip
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number } | null>(null);
  const [tooltipPrereqs, setTooltipPrereqs] = useState<Prereq[]>([]);

  // Filtros
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [showAprob, setShowAprob] = useState<boolean>(true);
  const [showReprob, setShowReprob] = useState<boolean>(true);
  const [showInscrito, setShowInscrito] = useState<boolean>(true);

  const handleMouseLeave = () => {
    setHoveredKey(null);
    setTooltipPos(null);
    setTooltipPrereqs([]);
  };
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, cubeKey: string, prereqs: Prereq[]) => {
    setHoveredKey(cubeKey);
    if (prereqs.length > 0) {
      setTooltipPrereqs(prereqs);
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      setTooltipPos({
        left: rect.left + rect.width / 2,
        top: rect.top - 10
      });
    }
  };

  return {
    hoveredKey,
    tooltipPos,
    tooltipPrereqs,
    filterLevel,
    setFilterLevel,
    showAprob,
    setShowAprob,
    showReprob,
    setShowReprob,
    showInscrito,
    setShowInscrito,
    handleMouseEnter,
    handleMouseLeave
  };
};