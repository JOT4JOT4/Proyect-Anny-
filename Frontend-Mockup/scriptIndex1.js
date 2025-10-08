// Datos de la malla curricular
const curriculum = {
    1: [
        { id: 'mat1', name: 'Matemáticas I', credits: 6, status: 'approved' },
        { id: 'fis1', name: 'Física I', credits: 5, status: 'approved' },
        { id: 'prog1', name: 'Programación I', credits: 6, status: 'approved' },
        { id: 'ing1', name: 'Inglés I', credits: 3, status: 'approved' },
        { id: 'com1', name: 'Comunicación', credits: 4, status: 'pending' }
    ],
    2: [
        { id: 'mat2', name: 'Matemáticas II', credits: 6, status: 'approved' },
        { id: 'fis2', name: 'Física II', credits: 5, status: 'failed' },
        { id: 'prog2', name: 'Programación II', credits: 6, status: 'approved' },
        { id: 'ing2', name: 'Inglés II', credits: 3, status: 'pending' },
        { id: 'est1', name: 'Estadística I', credits: 4, status: 'pending' }
    ],
    3: [
        { id: 'mat3', name: 'Matemáticas III', credits: 6, status: 'pending' },
        { id: 'estr1', name: 'Estructuras de Datos', credits: 6, status: 'pending' },
        { id: 'bd1', name: 'Base de Datos I', credits: 5, status: 'pending' },
        { id: 'ing3', name: 'Inglés III', credits: 3, status: 'pending' },
        { id: 'eco1', name: 'Economía', credits: 4, status: 'pending' }
    ],
    4: [
        { id: 'alg1', name: 'Algoritmos', credits: 6, status: 'pending' },
        { id: 'bd2', name: 'Base de Datos II', credits: 5, status: 'pending' },
        { id: 'so1', name: 'Sistemas Operativos', credits: 6, status: 'pending' },
        { id: 'ing4', name: 'Inglés IV', credits: 3, status: 'pending' },
        { id: 'cont1', name: 'Contabilidad', credits: 4, status: 'pending' }
    ],
    5: [
        { id: 'red1', name: 'Redes I', credits: 5, status: 'pending' },
        { id: 'web1', name: 'Desarrollo Web', credits: 6, status: 'pending' },
        { id: 'ia1', name: 'Inteligencia Artificial', credits: 6, status: 'pending' },
        { id: 'eti1', name: 'Ética Profesional', credits: 3, status: 'pending' },
        { id: 'ges1', name: 'Gestión de Proyectos', credits: 4, status: 'pending' }
    ],
    6: [
        { id: 'red2', name: 'Redes II', credits: 5, status: 'pending' },
        { id: 'seg1', name: 'Seguridad Informática', credits: 6, status: 'pending' },
        { id: 'mov1', name: 'Desarrollo Móvil', credits: 6, status: 'pending' },
        { id: 'inv1', name: 'Investigación', credits: 3, status: 'pending' },
        { id: 'emp1', name: 'Emprendimiento', credits: 4, status: 'pending' }
    ],
    7: [
        { id: 'arq1', name: 'Arquitectura de Software', credits: 6, status: 'pending' },
        { id: 'cloud1', name: 'Computación en la Nube', credits: 5, status: 'pending' },
        { id: 'elect1', name: 'Electivo I', credits: 4, status: 'pending' },
        { id: 'sem1', name: 'Seminario de Título I', credits: 6, status: 'pending' },
        { id: 'prac1', name: 'Práctica Profesional', credits: 3, status: 'pending' }
    ],
    8: [
        { id: 'elect2', name: 'Electivo II', credits: 4, status: 'pending' },
        { id: 'elect3', name: 'Electivo III', credits: 4, status: 'pending' },
        { id: 'sem2', name: 'Seminario de Título II', credits: 8, status: 'pending' },
        { id: 'tesis1', name: 'Trabajo de Título', credits: 8, status: 'pending' }
    ]
};

let filteredCurriculum = { ...curriculum };

function renderCurriculum() {
    const grid = document.getElementById('curriculumGrid');
    grid.innerHTML = '';

    for (let semester = 1; semester <= 8; semester++) {
        const semesterDiv = document.createElement('div');
        semesterDiv.className = 'semester-column bg-gray-50 rounded-lg p-4';
        semesterDiv.innerHTML = `
            <h3 class="text-lg font-bold text-center mb-4 text-blue-700 border-b-2 border-blue-200 pb-2">
                Semestre ${semester}
            </h3>
        `;

        const subjects = filteredCurriculum[semester] || [];
        subjects.forEach(subject => {
            const subjectDiv = document.createElement('div');
            subjectDiv.className = `subject-card p-3 rounded-lg mb-3 cursor-pointer border-2 border-transparent ${getStatusClass(subject.status)}`;
            subjectDiv.innerHTML = `
                <div class="font-semibold text-sm mb-1">${subject.name}</div>
                <div class="text-xs opacity-80">${subject.credits} créditos</div>
                <div class="text-xs mt-2 font-medium">${getStatusText(subject.status)}</div>
            `;
            
            subjectDiv.addEventListener('click', () => toggleSubjectStatus(subject.id, semester));
            semesterDiv.appendChild(subjectDiv);
        });

        grid.appendChild(semesterDiv);
    }

    updateStatistics();
}

function getStatusClass(status) {
    switch (status) {
        case 'approved': return 'approved';
        case 'failed': return 'failed';
        default: return 'pending';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'approved': return '✅ Aprobada';
        case 'failed': return '❌ Reprobada';
        default: return '⏳ Pendiente';
    }
}

function toggleSubjectStatus(subjectId, semester) {
    const subject = curriculum[semester].find(s => s.id === subjectId);
    if (subject) {
        if (subject.status === 'pending') {
            subject.status = 'approved';
        } else if (subject.status === 'approved') {
            subject.status = 'failed';
        } else {
            subject.status = 'pending';
        }
        applyFilters();
    }
}

function updateStatistics() {
    let approved = 0, failed = 0, pending = 0, total = 0;

    Object.values(curriculum).forEach(semester => {
        semester.forEach(subject => {
            total++;
            switch (subject.status) {
                case 'approved': approved++; break;
                case 'failed': failed++; break;
                default: pending++; break;
            }
        });
    });

    document.getElementById('approvedCount').textContent = approved;
    document.getElementById('failedCount').textContent = failed;
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('progressPercent').textContent = Math.round((approved / total) * 100) + '%';
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const semesterFilter = document.getElementById('semesterFilter').value;

    filteredCurriculum = {};

    Object.keys(curriculum).forEach(semester => {
        if (semesterFilter === 'all' || semesterFilter === semester) {
            filteredCurriculum[semester] = curriculum[semester].filter(subject => {
                const matchesSearch = subject.name.toLowerCase().includes(searchTerm);
                const matchesStatus = statusFilter === 'all' || subject.status === statusFilter;
                return matchesSearch && matchesStatus;
            });
        }
    });

    renderCurriculum();
}

// Event listeners
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('statusFilter').addEventListener('change', applyFilters);
document.getElementById('semesterFilter').addEventListener('change', applyFilters);

// Inicializar
renderCurriculum();