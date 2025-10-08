let curriculum = {};
        let filteredCurriculum = {};

        // ---  DATOS DEL BACKEND ---
        async function fetchAndRenderCurriculum() {
            const grid = document.getElementById('curriculumGrid');
            grid.innerHTML = '<p class="text-center col-span-full text-blue-600">Cargando datos desde el servidor...</p>';
            
            try {
                // petición POST al backend 
                //(el backend gestiona la peticion en primera instancia)
                const response = await fetch('http://localhost:3000/curriculum', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    //  datos de prueba 
                    body: JSON.stringify({
                        email: "ximena@example.com",
                        password: "qwerty"
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error en el servidor');
                }

                const dataFromApi = await response.json();

                const curriculumDataFormatted = dataFromApi.reduce((acc, subject) => {
                    const semester = subject.nivel;
                    if (!acc[semester]) {
                        acc[semester] = [];
                    }
                
                    acc[semester].push({
                        id: subject.codigo,
                        name: subject.asignatura,
                        credits: subject.creditos,
                        status: subject.estado === 'APROBADO' ? 'approved' : 'pending' 
                    });
                    return acc;
                }, {});

                curriculum = curriculumDataFormatted;
                applyFilters(); 

            } catch (error) {
                console.error('Error al obtener la malla:', error);
                grid.innerHTML = `<p class="text-center col-span-full text-red-600"><b>Error:</b> ${error.message}.<br>Asegúrate de que el backend esté funcionando.</p>`;
            }
        }


        // ---RENDERIZADO Y FILTROS  ---

        function renderCurriculum() {
            const grid = document.getElementById('curriculumGrid');
            grid.innerHTML = '';

            const maxSemesters = Math.max(...Object.keys(curriculum).map(Number), 8);

            for (let semester = 1; semester <= maxSemesters; semester++) {
                const semesterDiv = document.createElement('div');
                semesterDiv.className = 'semester-column bg-gray-50 rounded-lg p-4';
                semesterDiv.innerHTML = `
                    <h3 class="text-lg font-bold text-center mb-4 text-blue-700 border-b-2 border-blue-200 pb-2">
                        Semestre ${semester}
                    </h3>
                `;
                
                const subjects = filteredCurriculum[semester] || [];
                if (subjects.length === 0 && semester > 8) continue; 
                
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
                if (subject.status === 'pending') subject.status = 'approved';
                else if (subject.status === 'approved') subject.status = 'failed';
                else subject.status = 'pending';
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
            document.getElementById('progressPercent').textContent = total > 0 ? Math.round((approved / total) * 100) + '%' : '0%';
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

        document.getElementById('searchInput').addEventListener('input', applyFilters);
        document.getElementById('statusFilter').addEventListener('change', applyFilters);
        document.getElementById('semesterFilter').addEventListener('change', applyFilters);

        fetchAndRenderCurriculum();