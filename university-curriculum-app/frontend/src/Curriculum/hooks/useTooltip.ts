import { useState, useCallback } from 'react';
import type { Prerequisite, TooltipData } from '../types';

export const useTooltip = () => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipData>({ pos: null, prereqs: [] });

  const getCourseCubeHandlers = useCallback((cubeKey: string, prereqs: Prerequisite[]) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      setTooltip({
        pos: { left: Math.min(rect.right + 8, window.innerWidth - 180), top: rect.top },
        prereqs,
      });
      setHoveredKey(cubeKey);
    },
    onMouseLeave: () => {
      setHoveredKey(null);
      setTooltip({ pos: null, prereqs: [] });
    },
  }), []);

  return {
    hoveredKey,
    tooltip,
    getCourseCubeHandlers,
  };
};