import type { DecoratedCourse } from '../types';
import { getCreditsFromCourse } from './curriculumUtils';

// Genera y descarga un archivo JSON
export const exportSimulatedJSON = (simulatedKeys: string[], decoratedMap: Map<string, DecoratedCourse>, careerKey: string) => {
  const items = simulatedKeys.map(k => {
    const it = decoratedMap.get(k);
    if (!it) return { key: k };
    const curso = it.curso || {};
    return {
      key: k,
      codigo: String(curso.codigo || curso.code || curso.id || ''),
      nombre: curso.asignatura || curso.nombre || curso.title || '',
      nivel: it.nivel,
      creditos: getCreditsFromCourse(curso),
      raw: curso,
    };
  });
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `simulacion-${careerKey}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Genera y descarga un archivo CSV
export const exportSimulatedCSV = (simulatedKeys: string[], decoratedMap: Map<string, DecoratedCourse>, careerKey: string) => {
  const rows = [['codigo', 'nombre', 'nivel', 'creditos']];
  for (const k of simulatedKeys) {
    const it = decoratedMap.get(k);
    if (!it) { rows.push([k, '', '', '']); continue; }
    const curso = it.curso || {};
    rows.push([String(curso.codigo || curso.code || curso.id || ''), (curso.asignatura || curso.nombre || ''), String(it.nivel), String(getCreditsFromCourse(curso))]);
  }
  const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `simulacion-${careerKey}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};