import type { Avance, Course, MergedCourse, Prereq } from '../types';

/**
 * Helper para obtener los créditos de un curso, probando múltiples campos.
 */
export const getCreditsFromCourse = (curso: Course): number => {
  if (!curso) return 0;
  const candidates = [curso.creditos, curso.credito, curso.credits, curso.carga, curso.uv, curso.horas, curso.weight, curso.cr];
  for (const c of candidates) {
    if (c !== undefined && c !== null && c !== '') {
      const n = Number(String(c).replace(',', '.'));
      if (!Number.isNaN(n)) return n;
    }
  }
  if (curso.descripcion) {
    const m = String(curso.descripcion).match(/(\d+(?:[\.,]\d+)?)[^\d]*cr|creditos|credits/i);
    if (m) return Number(m[1].replace(',', '.'));
  }
  return 0;
};

/**
 * Lógica pura para cruzar la malla con el avance del estudiante.
 */
export const mergeMallaAndAvance = (malla: Course[], avance: Avance[]): MergedCourse[] => {
  const avanceMap: Record<string, any> = {};
  for (const a of avance) {
    const candidates = [a.codigo, a.course, a.courseCode, a['course_code'], a['courseCodigo'], a.asignatura];
    const found = candidates.find((f: any) => f !== undefined && f !== null);
    if (found) avanceMap[String(found).trim()] = a;
  }

  const findAv = (codigo: string) => {
    if (!codigo) return undefined;
    if (avanceMap[codigo]) return avanceMap[codigo];
    const lower = codigo.toLowerCase();
    const exact = Object.keys(avanceMap).find(k => k.toLowerCase() === lower);
    if (exact) return avanceMap[exact];
    // ... (puedes añadir más lógica de fuzzy matching si es necesario)
    return avance.find((a: any) => {
      const fields = [a.codigo, a.course, a.asignatura, a.student, a.nrc];
      return fields.some((f: any) => f && String(f).toLowerCase().includes(lower));
    });
  };

  return malla.map((curso: any) => ({ curso, avance: findAv(String(curso.codigo || curso.code || curso.id || '')) }));
};

/**
 * Lógica pura para parsear los prerrequisitos de un curso.
 */
export const parsePrereqs = (curso: Course, courseMap: Record<string, Course>): Prereq[] => {
  const raw = curso.prereq || curso.prerequisitos || curso.requisitos || curso.reqs || curso.prerequisitos_codes || curso.prereq_codes || curso.requires || curso.corequisites || curso.requisite;
  if (!raw) return [];

  let tokens: string[] = [];
  if (Array.isArray(raw)) {
    tokens = raw.map(r => String(r));
  } else if (typeof raw === 'string') {
    tokens = raw.split(/[;,|\/()\[\]\s]+/).filter(Boolean);
  } else {
    tokens = [String(raw)];
  }

  const out: Prereq[] = [];
  for (const t of tokens) {
    const code = t.trim();
    if (!code) continue;

    const existsInCurrentMalla = !!courseMap[code];
    if (!existsInCurrentMalla) continue;

    const name = courseMap[code] ? (courseMap[code].asignatura || courseMap[code].nombre || courseMap[code].courseName) : undefined;
    out.push({ code, name });
  }
  return out;
};