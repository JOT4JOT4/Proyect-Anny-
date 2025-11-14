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
  creditos?: number;
  [key: string]: any; 
}

export interface Avance {
  codigo: string;
  status: string;
  [key: string]: any; 
}

export interface MergedCourse {
  curso: Course;
  avance: Avance | undefined;
}

export interface DecoratedCourse extends MergedCourse {
  cursoCodigo: string;
  nivel: string;
  isAprob: boolean;
  isReprob: boolean;
  isInscrito: boolean;
  shouldFade: boolean;
}

export interface Prerequisite {
  code: string;
  name?: string;
}

export interface TooltipData {
  pos: { left: number; top: number } | null;
  prereqs: Prerequisite[];
}

export interface ToastData {
  message: string;
  type: 'error' | 'success';
}