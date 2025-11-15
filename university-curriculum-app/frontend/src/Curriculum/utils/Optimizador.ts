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
    creditLimit: number, 
    manuallyInscribedCodes: Set<string>
): OptimizedPlan {
    
    const MAX_CREDITS_PER_SEMESTER = Math.min(35, Math.max(12, creditLimit));
    const plan: OptimizedPlan = {};
    
    const pendingCourses = mergedCourses
        .filter(m => {
            const cursoCodigo = String(m.curso.codigo || m.curso.code || m.curso.id || '').trim();
            return !approvedCodes.has(cursoCodigo);
        })
        .map(m => m.curso); 

    const takenCourses = new Set(approvedCodes);

    let currentSemester = 1;
    
    const canTake = (curso: any) => {
        const prereqs = parsePrereqs(curso);
        return prereqs.every(req => takenCourses.has(req.code));
    };

    //Ciclo de Planificación Semestre a Semestre
    while (pendingCourses.length > 0) {
        const semesterKey = `Semestre ${currentSemester}`;
        plan[semesterKey] = [];
        let currentCredits = 0;
        let assignedInThisSemester = false;

        if(currentSemester === 1 && manuallyInscribedCodes.size > 0){
            const fullInscribedCourses: any[] = [];
            manuallyInscribedCodes.forEach(code => {
                const course = pendingCourses.find(p => {
                    const pCode = String(p.codigo || p.code || p.id || '').trim();
                    return pCode === code;
                });
                if (course) {
                    fullInscribedCourses.push(course);
                }
            });

            for (const course of fullInscribedCourses) {
                const credits = parseInt(course.creditos || 0, 10);
                const courseCode = String(course.codigo || course.code || course.id || '').trim();

                if (currentCredits + credits <= MAX_CREDITS_PER_SEMESTER) {
                    plan[semesterKey].push({
                        codigo: courseCode,
                        nombre: course.asignatura || course.nombre || course.courseName,
                        creditos: credits,
                        nivel: String(course.nivel || course.level || course.semestre || ''),
                    });

                    currentCredits += credits;
                    assignedInThisSemester = true;
                    takenCourses.add(courseCode);
                    
                    const index = pendingCourses.indexOf(course);
                    if (index > -1) {
                        pendingCourses.splice(index, 1);
                    }
                } else {
                    console.warn(`El curso ${courseCode} (inscrito manualmente) no se pudo planificar por límite de créditos.`);
                }
            }
        }
        let shouldReevaluateCandidates = true;

        while (shouldReevaluateCandidates) {
            shouldReevaluateCandidates = false;
            let candidates = pendingCourses.filter(c => canTake(c));

            if (candidates.length === 0 && pendingCourses.length > 0 && plan[semesterKey].length === 0) {
                console.error(`--- Bloqueo Crítico en Semestre ${currentSemester} ---`);
                const blockedCourse = pendingCourses[0];
                if (blockedCourse) {
                    const required = parsePrereqs(blockedCourse);
                    const missingReqs = required.filter(req => !takenCourses.has(req.code));

                    console.error("CURSO BLOQUEADO:", blockedCourse.asignatura || blockedCourse.codigo);
                    console.error("REQUISITOS FALTANTES:", missingReqs.map(m => m.code));
                }
                console.error("-------------------------------------------------");
                console.error(`Error en Semestre ${currentSemester}: Hay cursos pendientes que nunca serán elegibles. Deteniendo plan.`);
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
                const courseCode = String(course.codigo || course.code || course.id || '').trim();
                
                if (currentCredits + credits <= MAX_CREDITS_PER_SEMESTER) {
                    
                    plan[semesterKey].push({
                        codigo: courseCode,
                        nombre: course.asignatura || course.nombre || course.courseName,
                        creditos: credits,
                        nivel: String(course.nivel || course.level || course.semestre || ''),
                    });

                    currentCredits += credits;
                    assignedInThisSemester = true;
                    courseWasAssignedInThisPass = true;
                    takenCourses.add(courseCode);
                    
                    const index = pendingCourses.indexOf(course);
                    if (index > -1) {
                        pendingCourses.splice(index, 1);
                    }
                    
                    shouldReevaluateCandidates = true; 
                    break;
                }
            }
            
            if (shouldReevaluateCandidates && !courseWasAssignedInThisPass) {
                shouldReevaluateCandidates = false;
            }
        }

        if (!assignedInThisSemester && pendingCourses.length > 0) {
            console.warn(`Planificación detenida: No se pudo asignar ningún curso al Semestre ${currentSemester}.`);
            if (plan[semesterKey].length === 0) {
                delete plan[semesterKey]; 
            }
            break;
        } else if (assignedInThisSemester) {
            currentSemester++;
        }
    }

    return plan;
}