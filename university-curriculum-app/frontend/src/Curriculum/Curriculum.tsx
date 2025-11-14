import React, { useEffect, useState, useMemo } from 'react';
import type { UserData, DecoratedCourse } from './types';
import { responsiveStyle } from './curriculum.styles';

// Importar Hooks
import { useFilters } from './hooks/useFilters';
import { useCurriculumData } from './hooks/useCurriculumData';
import { useSimulation } from './hooks/useSimulation';
import { useTooltip } from './hooks/useTooltip';

// Importar Componentes de UI
import { CurriculumHeader } from './components/CurriculumHeader';
import { ControlFilter } from './components/ControlFilter';
import { CurriculumGrid } from './components/CurriculumGrid';
import { PrerequisiteTooltip } from './components/PrerequisitosTooltip';
import { NotificationToast } from './components/Notification';

// Importar Utils
import { exportSimulatedJSON, exportSimulatedCSV } from './utils/exportUtil';

const Curriculum: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedCareerIndex, setSelectedCareerIndex] = useState<number>(0);

  useEffect(() => {
    const raw = localStorage.getItem('userData');
    if (!raw) return;
    try {
      setUserData(JSON.parse(raw) as UserData);
    } catch (err) {
      console.error('Invalid userData in localStorage', err);
    }
  }, []);

  const selectedCareer = userData?.carreras[selectedCareerIndex] || userData?.carreras[0];
  const careerKey = selectedCareer ? `${selectedCareer.codigo}-${selectedCareer.catalogo}` : '';
  const {
    filterLevel,
    setFilterLevel,
    showAprob,
    setShowAprob,
    showReprob,
    setShowReprob,
    showInscrito,
    setShowInscrito,
  } = useFilters();

  const {
    loading,
    error,
    mergedCourses,
    selectedAvance,
    normalizedCourseMap,
    niveles,
  } = useCurriculumData(userData, selectedCareer);


  const decorated: DecoratedCourse[] = useMemo(() => {
    return mergedCourses.map((item: any) => {
      const curso = item.curso;
      const cursoCodigo = String(curso.codigo || curso.code || curso.id || '').trim();
      const nivel = String(curso.nivel || curso.level || curso.semestre || 'N/A').trim();

      const avance = item.avance || {};
      const rawStatus = String((avance.status || avance.inscriptionType || avance.result || '') || '').toLowerCase();
      const isAprob = rawStatus.includes('aprob');
      const isReprob = rawStatus.includes('reprob') || rawStatus.includes('repr') || rawStatus.includes('failed');
      const isInscrito = rawStatus.includes('inscr') || rawStatus.includes('registered') || rawStatus.includes('enrolled') || (!isAprob && !isReprob && rawStatus.length > 0);

      const statusMatch = (isAprob && showAprob) || (isReprob && showReprob) || (isInscrito && showInscrito) || (!isAprob && !isReprob && !isInscrito);
      const levelMatch = filterLevel === 'ALL' || filterLevel === nivel;
      const shouldFade = !(statusMatch && levelMatch);

      return { ...item, cursoCodigo, nivel, isAprob, isReprob, isInscrito, shouldFade };
    });
  }, [mergedCourses, filterLevel, showAprob, showReprob, showInscrito]);

  const {
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
  } = useSimulation(careerKey, decorated, normalizedCourseMap, selectedAvance);

  const {
    hoveredKey,
    tooltip,
    getCourseCubeHandlers,
  } = useTooltip();

  const handleExportJSON = () => exportSimulatedJSON(simulatedKeys, decoratedMap, careerKey);
  const handleExportCSV = () => exportSimulatedCSV(simulatedKeys, decoratedMap, careerKey);


  if (!userData) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>No has iniciado sesión</h2>
        <p>Por favor, inicia sesión para ver tu malla curricular.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6' }}>
      <style>{responsiveStyle}</style>

      <CurriculumHeader
        userData={userData}
        selectedCareerIndex={selectedCareerIndex}
        setSelectedCareerIndex={setSelectedCareerIndex}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        clearSimulatedForCareer={clearSimulatedForCareer}
        simulatedKeys={simulatedKeys}
        simulatedCredits={simulatedCredits}
        onExportJSON={handleExportJSON}
        onExportCSV={handleExportCSV}
      />

      <main style={{ flex: 1, overflow: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
        {loading && (
          <div style={{ padding: 8, background: '#fff', borderRadius: 4, textAlign: 'center', color: '#374151' }}>
            Cargando mallas y avances...
          </div>
        )}
        
        <ControlFilter
          filterLevel={filterLevel}
          setFilterLevel={setFilterLevel}
          showAprob={showAprob}
          setShowAprob={setShowAprob}
          showReprob={showReprob}
          setShowReprob={setShowReprob}
          showInscrito={showInscrito}
          setShowInscrito={setShowInscrito}
          niveles={niveles}
        />

        <PrerequisiteTooltip pos={tooltip.pos} prereqs={tooltip.prereqs} />
        <NotificationToast toast={toast} onClose={() => setToast(null)} />
        {error && <div style={{ padding: 8, background: '#fee2e2', borderRadius: 4, color: '#991b1b' }}>Error: {error}</div>}

        {!loading && !error && (
          <CurriculumGrid
            decoratedCourses={decorated}
            isSimulating={isSimulating}
            simulatedThisCareer={simulatedThisCareer}
            hoveredKey={hoveredKey}
            normalizedCourseMap={normalizedCourseMap}
            onToggleSimulate={toggleSimulated}
            getCourseCubeHandlers={getCourseCubeHandlers}
          />
        )}
      </main>
    </div>
  );
};

export default Curriculum;