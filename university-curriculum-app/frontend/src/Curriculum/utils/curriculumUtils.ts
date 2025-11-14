import type {  Course, Prerequisite } from '../types';


export const normalizeCode = (s: any): string =>
  String(s || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[^A-Z0-9]/g, '');


export const buildCourseMaps = (malla: Course[]): { courseMap: Record<string, Course>; normalizedCourseMap: Record<string, Course> } => {
  const courseMap: Record<string, Course> = {};
  const normalizedCourseMap: Record<string, Course> = {};
  for (const c of malla) {
    const codeRaw = String(c.codigo || c.code || c.id || '').trim();
    if (codeRaw) {
      courseMap[codeRaw] = c;
      const norm = normalizeCode(codeRaw);
      if (norm) normalizedCourseMap[norm] = c;
    }
  }
  return { courseMap, normalizedCourseMap };
};

export const parsePrereqs = (curso: Course, normalizedCourseMap: Record<string, Course>): Prerequisite[] => {
  const raw = curso.prereq || curso.prerequisitos || curso.requisitos || curso.reqs || curso.prerequisitos_codes || curso.prereq_codes || curso.requires || curso.corequisites || curso.requisite;
  if (!raw) return [];
  
  let tokens: string[] = [];
  if (Array.isArray(raw)) {
    tokens = raw.map(r => String(r));
  } else if (typeof raw === 'string') {
    tokens = raw.split(/[;,|\/()\[\]]+/).map(t => String(t).trim()).filter(Boolean);
  } else {
    tokens = [String(raw)];
  }

  const out: Prerequisite[] = [];
  for (const t of tokens) {
    const code = t.trim();
    if (!code) continue;
    const norm = normalizeCode(code);
    const found = normalizedCourseMap[norm];
    const name = found ? (found.asignatura || found.nombre || found.courseName) : undefined;
    out.push({ code, name });
  }
  return out;
};


export const getCreditsFromCourse = (curso: Course | undefined): number => {
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