interface PlannedCourse {
    codigo: string;
    nombre: string;
    creditos: number;
    nivel: string;
}
export type OptimizedPlan = Record<string, PlannedCourse[]>;
export declare function calculateOptimizedPlan(mergedCourses: any[], approvedCodes: Set<string>, parsePrereqs: (curso: any) => Array<{
    code: string;
    name?: string;
}>, creditLimits: number[], manuallyInscribedCodes: Set<string>): OptimizedPlan;
export {};
