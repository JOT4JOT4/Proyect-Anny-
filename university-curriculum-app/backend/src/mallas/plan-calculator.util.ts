// backend/src/mallas/plan-calculator.util.ts

export type OptimizedPlan = Record<string, any[]>;

export function calculateOptimizedPlan(
    mergedCourses: any[],
    approvedCodes: Set<string>,
    parsePrereqs: (curso: any) => any[],
    creditLimits: number[], 
    manuallyInscribedCodes: Set<string>,
    failedCodes: Set<string>,
    allowSpecialPeriods: boolean,
    includePracticeInNormal: boolean
): OptimizedPlan {
    
    const universeCodes = new Set<string>(
        mergedCourses.map(m => String(m.curso.codigo || '').trim())
    );

    const plan: OptimizedPlan = {};
    const takenCourses = new Set(approvedCodes);
    
    const pendingCourses = mergedCourses
        .filter(m => {
            const code = String(m.curso.codigo || '').trim();
            return !takenCourses.has(code);
        })
        .map(m => m.curso);

    const canTake = (c: any) => {
        const rawReqs = parsePrereqs(c);
        const validReqs = rawReqs.filter(req => {
            const cleanCode = String(req.code).trim();
            return universeCodes.has(cleanCode);
        });
        return validReqs.every(req => {
             const cleanCode = String(req.code).trim();
             return takenCourses.has(cleanCode);
        });
    };

    const runSpecialPhase = (semesterLabel: string) => {
        const specialCourses: any[] = [];

        if (allowSpecialPeriods) {
            const retakeCandidates = pendingCourses.filter(c => {
                const code = String(c.codigo || '').trim();
                const prereqsMet = canTake(c); 
                return prereqsMet && failedCodes.has(code) && c.permiteRecuperacion;
            });

            if (retakeCandidates.length > 0) {
                retakeCandidates.sort((a,b) => (a.nivel || 999) - (b.nivel || 999));
                specialCourses.push({ ...retakeCandidates[0], esRecuperacion: true });
            }
        }

        if (!includePracticeInNormal) {
            const practiceCandidates = pendingCourses.filter(c => {
                 return canTake(c) && c.esPracticaVerano;
            });
            practiceCandidates.forEach(p => specialCourses.push({ ...p, esPractica: true }));
        }

        if (specialCourses.length > 0) {
            plan[semesterLabel] = [];
            for (const course of specialCourses) {
                const code = String(course.codigo || '').trim();
                if (takenCourses.has(code)) continue;

                plan[semesterLabel].push({
                    codigo: code,
                    nombre: course.nombre || course.asignatura,
                    creditos: parseInt(course.creditos || 0, 10),
                    nivel: String(course.nivel || ''),
                    esRecuperacion: course.esRecuperacion,
                    esPractica: course.esPractica
                });
                takenCourses.add(code);
                
                const idx = pendingCourses.findIndex(c => String(c.codigo || '').trim() === code);
                if (idx > -1) pendingCourses.splice(idx, 1);
            }
        }
    };


    runSpecialPhase("Periodo Especial Inicial (Ahora)");
    let currentSemester = 1;

    while (pendingCourses.length > 0) {
        
        const semesterKey = `Semestre ${currentSemester}`;
        plan[semesterKey] = [];
        
        const rawLimit = creditLimits[currentSemester - 1] || creditLimits[creditLimits.length - 1] || 30;
        const currentMaxCredits = Math.min(40, Math.max(12, rawLimit));
        
        let candidates = pendingCourses.filter(c => canTake(c));
        
        candidates.sort((a, b) => {
             const manualA = manuallyInscribedCodes.has(a.codigo);
             const manualB = manuallyInscribedCodes.has(b.codigo);
             if (manualA && !manualB) return -1;
             if (!manualA && manualB) return 1;
             return (parseInt(a.nivel)||999) - (parseInt(b.nivel)||999);
        });

        let currentCredits = 0;
        const skippedForSpecial: any[] = [];

        for (const course of candidates) {
            if (!!course.esPracticaVerano && !includePracticeInNormal) continue;

            const codeTrim = String(course.codigo || '').trim();
            const esCandidatoRecuperacion = allowSpecialPeriods && course.permiteRecuperacion && failedCodes.has(codeTrim);
            
            if (esCandidatoRecuperacion) {
                skippedForSpecial.push(course);
                continue; 
            }
            
            const credits = parseInt(course.creditos || 0, 10);
            if (currentCredits + credits <= currentMaxCredits) {
                plan[semesterKey].push({
                    codigo: codeTrim,
                    nombre: course.nombre || course.asignatura,
                    creditos: credits,
                    nivel: String(course.nivel || ''),
                });
                currentCredits += credits;
                takenCourses.add(codeTrim);
            }
        }

        if (currentCredits < 12 && skippedForSpecial.length > 0) {
            
             // console.log(`RELLENO SEMESTRE ${currentSemester}: Créditos actuales ${currentCredits}. Recuperando ${skippedForSpecial.length} cursos.`);
             for (const course of skippedForSpecial) {
                const credits = parseInt(course.creditos || 0, 10);
                const codeTrim = String(course.codigo || '').trim();
                
                if (currentCredits + credits <= currentMaxCredits) {
                    plan[semesterKey].push({
                        codigo: codeTrim,
                        nombre: course.nombre || course.asignatura,
                        creditos: credits,
                        nivel: String(course.nivel || ''),
                    });
                    currentCredits += credits;
                    takenCourses.add(codeTrim);
                }
             }
        }

        if (plan[semesterKey]) {
            plan[semesterKey].forEach(p => {
                const idx = pendingCourses.findIndex(c => String(c.codigo || '').trim() === p.codigo);
                if (idx > -1) pendingCourses.splice(idx, 1);
            });
        }

        runSpecialPhase(`Periodo Especial ${currentSemester} (Verano/Invierno)`);

        const specialKey = `Periodo Especial ${currentSemester} (Verano/Invierno)`;
        const semEmpty = !plan[semesterKey] || plan[semesterKey].length === 0;
        const specialEmpty = !plan[specialKey] || plan[specialKey].length === 0;

        if (semEmpty && specialEmpty && pendingCourses.length > 0) {
             break; 
        }

        currentSemester++;
        if (currentSemester > 30) break;
    }

    return plan;
}