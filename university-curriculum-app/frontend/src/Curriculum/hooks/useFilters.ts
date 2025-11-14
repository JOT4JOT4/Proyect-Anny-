import { useState } from 'react';

export const useFilters = () => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [showAprob, setShowAprob] = useState<boolean>(true);
  const [showReprob, setShowReprob] = useState<boolean>(true);
  const [showInscrito, setShowInscrito] = useState<boolean>(true);

  return {
    filterLevel,
    setFilterLevel,
    showAprob,
    setShowAprob,
    showReprob,
    setShowReprob,
    showInscrito,
    setShowInscrito,
  };
};