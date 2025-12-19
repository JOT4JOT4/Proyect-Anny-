interface PlannedCourse {
    codigo: string;
    nombre: string;
    creditos: number;
    nivel: string;
    esRecuperacion?: boolean;
    esPractica?: boolean;
}
export type OptimizedPlan = Record<string, PlannedCourse[]>;

export function calculateOptimizedPlan(
    mergedCourses: any[],
    approvedCodes: Set<string>,
    parsePrereqs: (curso: any) => Array<{ code: string; name?: string }>,
    creditLimits: number[],
    manuallyInscribedCodes: Set<string>,
    ignorePracticas: boolean,
    failedCodes: Set<string>
): OptimizedPlan {

    const normalize = (c: string) => String(c || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    const universeCodes = new Set<string>(
        mergedCourses.map(m => normalize(m.curso.codigo || m.curso.code))
    );

    const reqMap = new Map<string, string[]>();
    mergedCourses.forEach(m => {
        const cCode = normalize(m.curso.codigo || m.curso.code);
        const reqs = parsePrereqs(m.curso).map(r => normalize(r.code));
        reqMap.set(cCode, reqs);
    });

    const plan: OptimizedPlan = {};
    const takenCourses = new Set<string>();
    approvedCodes.forEach(c => takenCourses.add(normalize(c)));
    
    const esCursoPracticaNombre = (nombre: string) => /pr[áa]ctica/i.test(nombre || '');

    const pendingCourses = mergedCourses
        .filter(m => {
            const rawCode = String(m.curso.codigo || m.curso.code || '');
            const cleanCode = normalize(rawCode);
            const nombre = m.curso.nombre || m.curso.asignatura || '';

            if (takenCourses.has(cleanCode)) return false;
            if (ignorePracticas && esCursoPracticaNombre(nombre)) return false;
            return true;
        })
        .map(m => m.curso); 

    let currentSemester = 1;
    

    const areAncestorsMet = (code: string, visited = new Set<string>()): boolean => {
        if (visited.has(code)) return true; 
        visited.add(code);

        const directReqs = reqMap.get(code) || [];
        
        for (const req of directReqs) {
            if (!universeCodes.has(req)) continue;

            if (!takenCourses.has(req)) return false;

            if (!areAncestorsMet(req, visited)) return false;
        }
        return true;
    };

    const canTake = (curso: any) => {
        const rawReqs = parsePrereqs(curso);
        if (rawReqs.length === 0) return true;

        for (const req of rawReqs) {
            const reqClean = normalize(req.code);

            if (!universeCodes.has(reqClean)) {
                continue; 
            }

            if (!takenCourses.has(reqClean)) {
                return false;
            }

            if (!areAncestorsMet(reqClean)) {
                return false;
            }
        }
        return true;
    };

    const runSummerPhase = (semesterLabel: string) => {
        const summerCourses: any[] = [];
        if (!ignorePracticas) {
            const practiceCandidates = pendingCourses.filter(c => c.esPracticaVerano && canTake(c));
            practiceCandidates.forEach(p => summerCourses.push({ ...p, esPractica: true }));
        }

        if (summerCourses.length > 0) {
            plan[semesterLabel] = [];
            for (const course of summerCourses) {
                const rawCode = String(course.codigo || '');
                const cleanCode = normalize(rawCode);

                if (takenCourses.has(cleanCode)) continue;

                plan[semesterLabel].push({
                    codigo: rawCode,
                    nombre: course.nombre || course.asignatura,
                    creditos: parseInt(course.creditos || 0, 10),
                    nivel: String(course.nivel || ''),
                    esPractica: true
                });
                
                takenCourses.add(cleanCode);
                const idx = pendingCourses.findIndex(c => normalize(c.codigo || '') === cleanCode);
                if (idx > -1) pendingCourses.splice(idx, 1);
            }
        }
    };

    while (pendingCourses.length > 0) {
        const semesterKey = `Semestre ${currentSemester}`;
        plan[semesterKey] = [];
        let currentCredits = 0;
        let assignedInThisSemester = false;
        
        const newlyTakenCodes: string[] = [];
        const rawLimit = creditLimits[currentSemester - 1] || creditLimits[creditLimits.length - 1] || 30;
        const currentMaxCredits = Math.min(40, Math.max(12, rawLimit));

        if(currentSemester === 1 && manuallyInscribedCodes.size > 0){
            const fullInscribedCourses: any[] = [];
            manuallyInscribedCodes.forEach(manualCode => {
                const course = pendingCourses.find(p => normalize(p.codigo || p.code) === normalize(manualCode));
                if (course) fullInscribedCourses.push(course);
            });

            for (const course of fullInscribedCourses) {
                const credits = parseInt(course.creditos || 0, 10);
                const rawCode = String(course.codigo || course.code || '');
                const cleanCode = normalize(rawCode);

                if (currentCredits + credits <= currentMaxCredits) {
                    plan[semesterKey].push({
                        codigo: rawCode,
                        nombre: course.asignatura || course.nombre,
                        creditos: credits,
                        nivel: String(course.nivel || course.semestre || ''),
                    });
                    currentCredits += credits;
                    assignedInThisSemester = true;
                    newlyTakenCodes.push(cleanCode);
                    const idx = pendingCourses.indexOf(course);
                    if (idx > -1) pendingCourses.splice(idx, 1);
                }
            }
        }

        let shouldReevaluateCandidates = true;
        while (shouldReevaluateCandidates) {
            shouldReevaluateCandidates = false;
            let candidates = pendingCourses.filter(c => canTake(c));

            if (candidates.length === 0 && pendingCourses.length > 0 && plan[semesterKey].length === 0) break; 

            candidates.sort((a, b) => {
                const cleanA = normalize(a.codigo || '');
                const cleanB = normalize(b.codigo || '');
                
                const isManualA = Array.from(manuallyInscribedCodes).some(m => normalize(m) === cleanA);
                const isManualB = Array.from(manuallyInscribedCodes).some(m => normalize(m) === cleanB);
                if (isManualA && !isManualB) return -1;
                if (!isManualA && isManualB) return 1;

                const isFailedA = Array.from(failedCodes).some(f => normalize(f) === cleanA);
                const isFailedB = Array.from(failedCodes).some(f => normalize(f) === cleanB);
                if (isFailedA && !isFailedB) return -1;
                if (!isFailedA && isFailedB) return 1;

                const levelA = parseInt(a.nivel || a.semestre || 999, 10);
                const levelB = parseInt(b.nivel || b.semestre || 999, 10);
                return levelA - levelB;
            });

            let courseWasAssignedInThisPass = false;
            for (let i = 0; i < candidates.length; i++) {
                const course = candidates[i];
                if (course.esPracticaVerano && !ignorePracticas) continue; 

                const credits = parseInt(course.creditos || 0, 10); 
                const rawCode = String(course.codigo || course.code || '');
                const cleanCode = normalize(rawCode);
                
                if (currentCredits + credits <= currentMaxCredits) {
                    plan[semesterKey].push({
                        codigo: rawCode,
                        nombre: course.asignatura || course.nombre,
                        creditos: credits,
                        nivel: String(course.nivel || course.semestre || ''),
                    });
                    currentCredits += credits;
                    assignedInThisSemester = true;
                    courseWasAssignedInThisPass = true;
                    newlyTakenCodes.push(cleanCode);
                    const idx = pendingCourses.indexOf(course);
                    if (idx > -1) pendingCourses.splice(idx, 1);
                    shouldReevaluateCandidates = true; 
                    break;
                }
            }
            if (shouldReevaluateCandidates && !courseWasAssignedInThisPass) shouldReevaluateCandidates = false;
        }
        
        newlyTakenCodes.forEach(code => takenCourses.add(code));
        runSummerPhase(`Verano (Post-Sem ${currentSemester})`);

        const summerKey = `Verano (Post-Sem ${currentSemester})`;
        const semEmpty = !plan[semesterKey] || plan[semesterKey].length === 0;
        const summerEmpty = !plan[summerKey] || plan[summerKey].length === 0;

        if (!assignedInThisSemester && pendingCourses.length > 0 && summerEmpty) {
            if (currentSemester > 25) break; 
            if (semEmpty) delete plan[semesterKey];
            break;
        } else if (assignedInThisSemester || !summerEmpty) {
            currentSemester++;
        }
    }
    return plan;
}