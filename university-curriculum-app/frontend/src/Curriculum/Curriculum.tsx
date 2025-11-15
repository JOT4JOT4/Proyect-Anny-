import React, { useMemo, useState } from 'react';
import './styles/Curriculum.css'; 

// Hooks
import { useToast } from './hooks/useToast';
import { useCurriculumData } from './hooks/useCurriculumData';
import { useCourseData } from './hooks/useCourseData';
import { useSimulation } from './hooks/useSimulation';
import { useOptimization } from './hooks/useOptimization';
import { useDecoratedCourses } from './hooks/useDecorationCourses';
import { useUIState } from './hooks/useUIState';

// Components
import { ToastNotification } from './components/ToastNotification';
import { CurriculumHeader } from './components/CurriculumHeader';
import { SimulationControls } from './components/SimulationControls';
import { FilterBar } from './components/FilterBar';
import { CurriculumGrid } from './components/CurriculumGrid';
import { PrerequisiteTooltip } from './components/PrerequisiteToolTip';

const Curriculum: React.FC = () => {

  const { toast, setToast } = useToast();
  
  // Estado de data fetching
  const { userData, mallas, avances, loading, error } = useCurriculumData();
  
  // Estado de carrera seleccionada
  const [selectedCareerIndex, setSelectedCareerIndex] = useState<number>(0);
  const selectedCareer = useMemo(() => {
      return userData?.carreras[selectedCareerIndex] || userData?.carreras[0] || null;
  }, [userData, selectedCareerIndex]);

  // Estado de datos procesados 
  const { merged, courseMap, parsePrereqs, realApprovedCodes, niveles, selectedCareerKey } = useCourseData(selectedCareer, mallas, avances);
  
  // Estado de simulación
  const {
    simulatedStatus, simulationMode, setSimulationMode,
    creditLimit, setCreditLimit, currentApprovedCodes,
    manuallyInscribedCodes, handleSimulateStatus, resetSimulation
  } = useSimulation(realApprovedCodes, merged, parsePrereqs, setToast, selectedCareerKey);

  // Estado de optimización
  const {
    isOptimizedView, setIsOptimizedView,
    optimizedCourseMap, totalOptimizedSemesters
  } = useOptimization(merged, currentApprovedCodes, parsePrereqs, creditLimit, manuallyInscribedCodes, selectedCareerKey);
  
  // Estado UI 
  const {
    filterLevel, setFilterLevel, showAprob, setShowAprob,
    showReprob, setShowReprob, showInscrito, setShowInscrito,
    hoveredKey, tooltipPos, tooltipPrereqs, 
    handleMouseEnter, handleMouseLeave
  } = useUIState();

  // Lista final de cursos "decorados" para el renderizado
  const decorated = useDecoratedCourses(
    merged, isOptimizedView, optimizedCourseMap,
    filterLevel, showAprob, showReprob, showInscrito,
    realApprovedCodes, simulatedStatus
  );
  
  // Mapa de decorados 
  const decoratedMap = useMemo(() => {
    return new Map(decorated.map((it: any) => [it.cursoCodigo, it]));
  }, [decorated]);
  
  
  const handleToggleOptimize = () => {
    setIsOptimizedView(prev => !prev);
    resetSimulation(); 
  };


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
      
      <ToastNotification toast={toast} />
      
      <CurriculumHeader 
        userData={userData}
        selectedCareerIndex={selectedCareerIndex}
        onCareerChange={setSelectedCareerIndex}
      />
      
      <main style={{ flex: 1, overflow: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
        {loading && (
          <div style={{ padding: 8, background: '#fff', borderRadius: 4, textAlign: 'center', color: '#374151' }}>
            Cargando mallas y avances...
          </div>
        )}
        
        {error && (
          <div style={{ padding: 8, background: '#fee2e2', borderRadius: 4, color: '#991b1b' }}>
            Error: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <SimulationControls
              isOptimizedView={isOptimizedView}
              totalOptimizedSemesters={totalOptimizedSemesters}
              creditLimit={creditLimit}
              onCreditLimitChange={setCreditLimit}
              simulationMode={simulationMode}
              onSimulationModeChange={setSimulationMode}
              onToggleOptimize={handleToggleOptimize}
              // Export props
              simulatedStatus={simulatedStatus}
              decoratedMap={decoratedMap}
              selectedCareer={selectedCareer}
              setToast={setToast}
            />
          
            <FilterBar
              niveles={niveles}
              filterLevel={filterLevel}
              onFilterLevelChange={setFilterLevel}
              showAprob={showAprob}
              onShowAprobChange={setShowAprob}
              showReprob={showReprob}
              onShowReprobChange={setShowReprob}
              showInscrito={showInscrito}
              onShowInscritoChange={setShowInscrito}
            />
            
            <PrerequisiteTooltip
              tooltipPos={tooltipPos}
              tooltipPrereqs={tooltipPrereqs}
            />
            
            <CurriculumGrid
              decorated={decorated}
              isOptimizedView={isOptimizedView}
              hoveredKey={hoveredKey}
              simulationMode={simulationMode}
              parsePrereqs={parsePrereqs}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onSimulateStatus={handleSimulateStatus}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Curriculum;