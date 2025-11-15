export interface Carrera {
  codigo: string;
  nombre: string;
  catalogo: string;
}

export interface UserData {
  rut: string;
  carreras: Carrera[];
}

export interface Course {
  codigo: string;
  nombre: string;
  nivel: string | number;
  creditos: number;
  prereq?: string | string[];
  [key: string]: any;
}

export interface Avance {
  codigo: string;
  status: string;
  [key: string]: any;
}

export interface MergedCourse {
  curso: Course;
  avance?: Avance;
}

export interface Prereq {
  code: string;
  name?: string;
}

export type SimulationStatus = 'APROBADO' | 'REPROBADO' | 'INSCRITO' | null;
export type SimulationMode = 'nextSemester' | 'freePlay';

export type ToastState = { message: string; type: 'error' | 'success' } | null;


export interface DecoratedCourse extends MergedCourse {
  cursoCodigo: string;
  nivel: string;
  displayLevel: string;
  isAprob: boolean;
  isReprob: boolean;
  isInscrito: boolean;
  isPending: boolean;
  finalStatus: string;
  isRealApproved: boolean;
  currentSimulatedStatus: SimulationStatus;
  shouldFade: boolean;
}