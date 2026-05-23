document.addEventListener('DOMContentLoaded', () => {
    cargarSolucionarios();
});

async function cargarSolucionarios() {
    const contenedor = document.getElementById('contenedor-cursos');
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('No se pudo cargar data.json');
        const data = await response.json();
        if (!data.cursos || data.cursos.length === 0) {
            contenedor.innerHTML = '<div class="cargando">No hay cursos cargados aún.</div>';
            return;
        }
        let html = '';
        for (let i = 0; i < data.cursos.length; i++) {
            const curso = data.cursos[i];
            html += `
                <div class="curso">
                    <div class="curso-header" data-curso-index="${i}">
                        <h2>📖 ${curso.nombre}</h2>
                        <span class="icono">▼</span>
                    </div>
                    <div class="curso-body" id="curso-body-${i}">
                        ${generarPracticasHTML(curso.practicas)}
                    </div>
                </div>
            `;
        }
        contenedor.innerHTML = html;
        // Eventos acordeón
        const headers = document.querySelectorAll('.curso-header');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const index = header.getAttribute('data-curso-index');
                const body = document.getElementById(`curso-body-${index}`);
                body.classList.toggle('open');
                const icono = header.querySelector('.icono');
                if (body.classList.contains('open')) {
                    icono.style.transform = 'rotate(180deg)';
                } else {
                    icono.style.transform = 'rotate(0deg)';
                }
            });
        });
        if (data.cursos.length > 0) {
            document.getElementById('curso-body-0')?.classList.add('open');
        }
    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<div class="cargando">Error al cargar los datos. Verifica data.json.</div>';
    }
}

function generarPracticasHTML(practicas) {
    if (!practicas || practicas.length === 0) return '<p>No hay prácticas registradas aún.</p>';
    let practicasHTML = '';
    for (const practica of practicas) {
        practicasHTML += `
            <div class="practica">
                <h3>📌 ${practica.titulo}</h3>
                <div class="ejercicios-grid">
                    ${generarEjerciciosHTML(practica.ejercicios)}
                </div>
            </div>
        `;
    }
    return practicasHTML;
}

function generarEjerciciosHTML(ejercicios) {
    if (!ejercicios || ejercicios.length === 0) return '<span class="sin-ejercicios">Aún sin ejercicios subidos.</span>';
    let botones = '';
    for (const ej of ejercicios) {
        // Escapa la ruta para evitar errores con comillas
        const rutaEscapada = ej.ruta_pdf.replace(/'/g, "\\'");
        botones += `
            <button class="btn-ejercicio" onclick="mostrarPDF('${rutaEscapada}')">
                📄 ${ej.nombre}
            </button>
        `;
    }
    return botones;
}

// Función global para mostrar PDF en el iframe
window.mostrarPDF = function(ruta) {
    const visor = document.getElementById('visor-pdf');
    const iframe = document.getElementById('pdf-iframe');
    iframe.src = ruta;
    visor.style.display = 'block';
    visor.scrollIntoView({ behavior: 'smooth', block: 'start' });
};