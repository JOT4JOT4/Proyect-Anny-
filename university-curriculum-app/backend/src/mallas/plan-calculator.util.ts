interface PlannedCourse {
    codigo: string;
    nombre: string;
    creditos: number;
    nivel: string;
}
export type OptimizedPlan = Record<string, PlannedCourse[]>;

export function calculateOptimizedPlan(
    mergedCourses: any[],
    approvedCodes: Set<string>,
    parsePrereqs: (curso: any) => Array<{ code: string; name?: string }>,
    creditLimits: number[],
    manuallyInscribedCodes: Set<string>,
    ignorePracticas: boolean 
): OptimizedPlan {

    const universeCodes = new Set<string>(
        mergedCourses.map(m => String(m.curso.codigo || m.curso.code || '').trim())
    );

    const plan: OptimizedPlan = {};
    const takenCourses = new Set(approvedCodes);
    
    const esCursoPractica = (nombre: string) => /pr[áa]ctica/i.test(nombre || '');

    const pendingCourses = mergedCourses
        .filter(m => {
            const cursoCodigo = String(m.curso.codigo || m.curso.code || '').trim();
            const nombre = m.curso.nombre || m.curso.asignatura || '';

            if (approvedCodes.has(cursoCodigo)) return false;

            if (ignorePracticas && esCursoPractica(nombre)) return false;

            return true;
        })
        .map(m => m.curso); 

    let currentSemester = 1;
    

    const canTake = (curso: any) => {
        const rawReqs = parsePrereqs(curso);
        const validReqs = rawReqs.filter(req => {
            const cleanCode = String(req.code).trim();
            return universeCodes.has(cleanCode);
        });

        return validReqs.every(req => takenCourses.has(req.code));
    };


    while (pendingCourses.length > 0) {
        const semesterKey = `Semestre ${currentSemester}`;
        plan[semesterKey] = [];
        let currentCredits = 0;
        let assignedInThisSemester = false;

        const rawLimit = creditLimits[currentSemester - 1] 
                       || creditLimits[creditLimits.length - 1] 
                       || 30;

        const currentMaxCredits = Math.min(40, Math.max(12, rawLimit));

        if(currentSemester === 1 && manuallyInscribedCodes.size > 0){
            const fullInscribedCourses: any[] = [];
            manuallyInscribedCodes.forEach(code => {
                const course = pendingCourses.find(p => {
                    const pCode = String(p.codigo || p.code || '').trim();
                    return pCode === code;
                });
                if (course) fullInscribedCourses.push(course);
            });

            for (const course of fullInscribedCourses) {
                const credits = parseInt(course.creditos || 0, 10);
                const courseCode = String(course.codigo || course.code || '').trim();

                if (currentCredits + credits <= currentMaxCredits) {
                    plan[semesterKey].push({
                        codigo: courseCode,
                        nombre: course.asignatura || course.nombre,
                        creditos: credits,
                        nivel: String(course.nivel || course.semestre || ''),
                    });

                    currentCredits += credits;
                    assignedInThisSemester = true;
                    takenCourses.add(courseCode);
                    
                    const index = pendingCourses.indexOf(course);
                    if (index > -1) pendingCourses.splice(index, 1);
                }
            }
        }


        let shouldReevaluateCandidates = true;

        while (shouldReevaluateCandidates) {
            shouldReevaluateCandidates = false;

            let candidates = pendingCourses.filter(c => canTake(c));


            if (candidates.length === 0 && pendingCourses.length > 0 && plan[semesterKey].length === 0) {
                break; 
            }

            candidates.sort((a, b) => {
                const levelA = parseInt(a.nivel || a.semestre || 999, 10);
                const levelB = parseInt(b.nivel || b.semestre || 999, 10);
                return levelA - levelB;
            });

            let courseWasAssignedInThisPass = false;

            for (let i = 0; i < candidates.length; i++) {
                const course = candidates[i];
                const credits = parseInt(course.creditos || 0, 10); 
                const courseCode = String(course.codigo || course.code || '').trim();
                
                if (currentCredits + credits <= currentMaxCredits) {
                    
                    plan[semesterKey].push({
                        codigo: courseCode,
                        nombre: course.asignatura || course.nombre,
                        creditos: credits,
                        nivel: String(course.nivel || course.semestre || ''),
                    });

                    currentCredits += credits;
                    assignedInThisSemester = true;
                    courseWasAssignedInThisPass = true;
                    takenCourses.add(courseCode);
                    
                    const index = pendingCourses.indexOf(course);
                    if (index > -1) pendingCourses.splice(index, 1);
                    
                    shouldReevaluateCandidates = true; 
                    break;
                }
            }
            
            if (shouldReevaluateCandidates && !courseWasAssignedInThisPass) {
                shouldReevaluateCandidates = false;
            }
        }

        if (!assignedInThisSemester && pendingCourses.length > 0) {
            if (currentSemester > 25) break; 
            if (plan[semesterKey].length === 0) delete plan[semesterKey]; 
            break;
        } else if (assignedInThisSemester) {
            currentSemester++;
        }
    }

    return plan;
}