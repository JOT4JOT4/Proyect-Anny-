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
): OptimizedPlan{

    const MAX_CREDITOS_POR_SEMESTRE = Math.min(35,Math.max(12,creditLimit));
    const plan: OptimizedPlan = {};

    const cursosPendientes = mergedCourses
        .filter(m => {
            const cursoCodigo = String(m.curso.codigo || m.curso.code || m.curso.id || '').trim();
            return !approvedCodes.has(cursoCodigo);
        })
        .map(m => m.curso); 

    const cursosAprobados = new Set(approvedCodes);
    //empezar
    let semestreActual = 1;

    const puedeCursar = (curso: any) => {
        const prereqs = parsePrereqs(curso);
        return prereqs.every(req => cursosAprobados.has(req.code));
    };

    while(cursosPendientes.length > 0){
        const semestreKey = `Semestre ${semestreActual}`;
        plan[semestreKey] = [];
        let creditosActuales = 0;
        let asignadoEnEsteSemestre = false; 

        if(semestreActual === 1 && manuallyInscribedCodes.size > 0){
            const cursosInscritosCompletos: any[] = [];
            manuallyInscribedCodes.forEach(code => {
                const cursoEncontrado = cursosPendientes.find(p => {
                    const pCode = String(p.codigo || p.code || p.id || '').trim();
                    return pCode === code;
                });
                if (cursoEncontrado) {
                    cursosInscritosCompletos.push(cursoEncontrado);
                }
            });

            for(const curso of cursosInscritosCompletos){
                const creditos = parseInt(curso.creditos || 0, 10);
                const codigoCurso = String(curso.codigo || curso.code || curso.id || '').trim();

                if(creditosActuales + creditos <= MAX_CREDITOS_POR_SEMESTRE){
                    plan[semestreKey].push({
                        codigo: codigoCurso,
                        nombre: curso.asignatura || curso.nombre || curso.courseName,
                        creditos: creditos,
                        nivel: String(curso.nivel || curso.level || curso.semestre || ''),
                    });

                    creditosActuales += creditos;
                    asignadoEnEsteSemestre = true;
                    cursosAprobados.add(codigoCurso);
                    const indice = cursosPendientes.indexOf(curso);
                    if (indice > -1) {
                        cursosPendientes.splice(indice, 1);
                    }
                }else{
                    console.warn(`El curso ${codigoCurso} (inscrito manualmente) no se pudo planificar por límite de créditos.`);
                }
            }
        }
        
        let debeReevaluarCandidatos = true;

        while(debeReevaluarCandidatos){
            debeReevaluarCandidatos = false;
            let candidatos = cursosPendientes.filter(c => puedeCursar(c));

            if(candidatos.length === 0 && cursosPendientes.length > 0 && plan[semestreKey].length === 0){
                console.error(`--- Bloqueo Crítico en Semestre ${semestreActual} ---`);
                const cursoBloqueado = cursosPendientes[0]; 
                if(cursoBloqueado){
                    const requisitos = parsePrereqs(cursoBloqueado);
                    const requisitosFaltantes = requisitos.filter(req => !cursosAprobados.has(req.code));
                    console.error("CURSO BLOQUEADO:", cursoBloqueado.asignatura || cursoBloqueado.codigo);
                    console.error("REQUISITOS FALTANTES:", requisitosFaltantes.map(m => m.code));
                }
                console.error("-------------------------------------------------");
                console.error(`Error en Semestre ${semestreActual}: Hay cursos pendientes que nunca serán elegibles. Deteniendo plan.`);
                break; 
            }
            candidatos.sort((a, b) => {
                const nivelA = parseInt(a.nivel || a.semestre || 999, 10);
                const nivelB = parseInt(b.nivel || b.semestre || 999, 10);
                return nivelA - nivelB;
            });

            let cursoFueAsignadoEnEstaPasada = false;

            for(let i = 0; i < candidatos.length; i++){
                const curso = candidatos[i];
                const creditos = parseInt(curso.creditos || 0, 10); 
                const codigoCurso = String(curso.codigo || curso.code || curso.id || '').trim();
                
                if(creditosActuales + creditos <= MAX_CREDITOS_POR_SEMESTRE){
                    plan[semestreKey].push({
                        codigo: codigoCurso,
                        nombre: curso.asignatura || curso.nombre || curso.courseName,
                        creditos: creditos,
                        nivel: String(curso.nivel || curso.level || curso.semestre || ''),
                    });

                    creditosActuales += creditos;
                    asignadoEnEsteSemestre = true;
                    cursoFueAsignadoEnEstaPasada = true;
                    cursosAprobados.add(codigoCurso);
                    const indice = cursosPendientes.indexOf(curso);

                    if (indice > -1) {
                        cursosPendientes.splice(indice, 1);
                    }
                    debeReevaluarCandidatos = true; 
                    break;
                }
            }
            if (debeReevaluarCandidatos && !cursoFueAsignadoEnEstaPasada) {
                debeReevaluarCandidatos = false;
            }
        } 

        if(!asignadoEnEsteSemestre && cursosPendientes.length > 0){
            console.warn(`Planificación detenida: No se pudo asignar ningún curso al Semestre ${semestreActual}.`);
            if (plan[semestreKey].length === 0) {
                delete plan[semestreKey];
            }
            break;
        } else if (asignadoEnEsteSemestre){
            semestreActual++;
        }
    } 

    return plan;
}