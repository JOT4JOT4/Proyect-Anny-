"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOptimizedPlan = void 0;
function calculateOptimizedPlan(mergedCourses, approvedCodes, parsePrereqs, creditLimits, manuallyInscribedCodes, failedCodes, allowSpecialPeriods, includePracticeInNormal) {
    console.log("--- DEBUG ALGORITMO: ¿QUÉ RECIBÍ? ---");
    console.log("Arg 6 (failedCodes):", failedCodes);
    console.log("Arg 7 (allowSpecialPeriods):", allowSpecialPeriods);
    console.log("Arg 8 (includePractice):", includePracticeInNormal);
    console.log("Tipo de Arg 7:", typeof allowSpecialPeriods);
    console.log("-------------------------------------");
    const plan = {};
    const takenCourses = new Set(approvedCodes);
    const pendingCourses = mergedCourses
        .filter(m => {
        const code = String(m.curso.codigo || '').trim();
        return !takenCourses.has(code);
    })
        .map(m => m.curso);
    let currentSemester = 1;
    const canTake = (curso) => {
        const prereqs = parsePrereqs(curso);
        return prereqs.every(req => takenCourses.has(req.code));
    };
    while (pendingCourses.length > 0) {
        const semesterKey = `Semestre ${currentSemester}`;
        plan[semesterKey] = [];
        let currentCredits = 0;
        const rawLimit = creditLimits[currentSemester - 1]
            || creditLimits[creditLimits.length - 1]
            || 30;
        const currentMaxCredits = Math.min(40, Math.max(12, rawLimit));
        let candidates = pendingCourses.filter(c => canTake(c));
        candidates.sort((a, b) => {
            const codeA = String(a.codigo || '').trim();
            const codeB = String(b.codigo || '').trim();
            const manualA = manuallyInscribedCodes.has(codeA);
            const manualB = manuallyInscribedCodes.has(codeB);
            if (manualA && !manualB)
                return -1;
            if (!manualA && manualB)
                return 1;
            const levelA = parseInt(a.nivel || 999, 10);
            const levelB = parseInt(b.nivel || 999, 10);
            return levelA - levelB;
        });
        const assignedNormal = [];
        for (const course of candidates) {
            const isPractice = !!course.esPracticaVerano;
            if (isPractice && !includePracticeInNormal) {
                continue;
            }
            const codeTrim = String(course.codigo || '').trim();
            const esCandidatoRecuperacion = allowSpecialPeriods
                && course.permiteRecuperacion
                && failedCodes.has(codeTrim);
            if (esCandidatoRecuperacion) {
                continue;
            }
            const credits = parseInt(course.creditos || 0, 10);
            if (currentCredits + credits <= currentMaxCredits) {
                const code = String(course.codigo || '').trim();
                plan[semesterKey].push({
                    codigo: code,
                    nombre: course.nombre || course.asignatura,
                    creditos: credits,
                    nivel: String(course.nivel || ''),
                });
                currentCredits += credits;
                assignedNormal.push(code);
                takenCourses.add(code);
            }
        }
        for (const code of assignedNormal) {
            const idx = pendingCourses.findIndex(c => String(c.codigo || '').trim() === code);
            if (idx > -1)
                pendingCourses.splice(idx, 1);
        }
        const specialKey = `Periodo Especial ${currentSemester} (Verano/Invierno)`;
        const specialCourses = [];
        if (allowSpecialPeriods) {
            const retakeCandidates = pendingCourses.filter(c => {
                const code = String(c.codigo || '').trim();
                const cumpleRequisitos = canTake(c);
                const fueReprobado = failedCodes.has(code);
                const esRecuperable = c.permiteRecuperacion;
                if (code === 'CODIGO_DE_TU_RAMO') {
                    console.log(`Debug ${code}: Reqs=${cumpleRequisitos}, Reprobado=${fueReprobado}, FlagBD=${esRecuperable}`);
                }
                return cumpleRequisitos && fueReprobado && esRecuperable;
            });
            if (retakeCandidates.length > 0) {
                console.log(`🎯 ALGORITMO: Asignando recuperación de ${retakeCandidates[0].codigo} en ${specialKey}`);
                retakeCandidates.sort((a, b) => (a.nivel || 999) - (b.nivel || 999));
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
            plan[specialKey] = [];
            for (const course of specialCourses) {
                const code = String(course.codigo || '').trim();
                plan[specialKey].push({
                    codigo: code,
                    nombre: course.nombre || course.asignatura,
                    creditos: parseInt(course.creditos || 0, 10),
                    nivel: String(course.nivel || ''),
                    esRecuperacion: course.esRecuperacion,
                    esPractica: course.esPractica
                });
                takenCourses.add(code);
                const idx = pendingCourses.findIndex(c => String(c.codigo || '').trim() === code);
                if (idx > -1)
                    pendingCourses.splice(idx, 1);
            }
        }
        if (plan[semesterKey].length === 0 && (!plan[specialKey] || plan[specialKey].length === 0)) {
            if (pendingCourses.length > 0) {
                delete plan[semesterKey];
                break;
            }
        }
        currentSemester++;
        if (currentSemester > 25)
            break;
    }
    return plan;
}
exports.calculateOptimizedPlan = calculateOptimizedPlan;
//# sourceMappingURL=plan-calculator.util.js.map