alumnos = JSON.parse(localStorage.getItem('alumnos'));
grupos=JSON.parse(localStorage.getItem('grupos'));
function generarTabla() {
    let tablaContainer = document.getElementById('tabla-container');
    let tablaHTML = '<table border="1"><tr><th>ID</th><th>Nombre</th><th>Apellido Paterno</th><th>Apellido Materno</th><th>Edad</th><th>Materias</th><th>Asignar Materias</th><th>Eliminar Alumno</th></tr>';

    alumnos.forEach((alumno, index) => {
        tablaHTML += `<tr>
                        <td>${alumno.id}</td>
                        <td>${alumno.nombre}</td>
                        <td>${alumno.primerApellido}</td>
                        <td>${alumno.segundoApellido}</td>
                        <td>${alumno.edad}</td>
                        <td>`;
        
        materias.forEach(materia => {
            tablaHTML += `<input type="checkbox" id="materia-${index}-${materia}" value="${materia}">${materia}<br>`;
        });

        tablaHTML += `</td>
                      <td><button onclick="asignarMaterias(${index})">Asignar Materias</button></td>
                      <td><button onclick="eliminarAlumno(${alumno.id})">Eliminar Alumno</button></td></tr>`;
    });

    tablaHTML += '</table>';
    tablaContainer.innerHTML = tablaHTML;
}
function eliminarAlumno(idAlumno) {
    let indice = alumnos.findIndex(alumno => alumno.id === idAlumno);
    if (indice !== -1) {
        alumnos.splice(indice, 1);
        generarTabla();
        console.log(`Alumno con ID ${idAlumno} eliminado.`);
    }
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
}

// Función para generar la tabla de alumnos
function generarTablaAlumnos(grupos) {
    
    let tablaBody = document.querySelector('#tabla-alumnos tbody');
    tablaBody.innerHTML = ''; // Limpiar el contenido anterior de la tabla

    // Iterar sobre cada alumno y agregar una fila a la tabla para cada uno
    alumnos.forEach((alumno, index) => {
        let row = tablaBody.insertRow();
        row.innerHTML = `
            <td>${alumno.id}</td>
            <td>${alumno.nombre}</td>
            <td>${alumno.primerApellido}</td>
            <td>${alumno.segundoApellido}</td>
            <td>${alumno.edad}</td>
            <td>${alumno.materiasInscritas.map(materia => materia.nombreMateria).join(', ')}</td>
            <td>${alumno.materiasInscritas.map(materia => materia.calificacion).join(', ')}</td>
            <td>
                <select id="grupo-${index}"> 
                    ${grupos.map(grupo => `<option value="${grupo.grupo}">${grupo.grupo}</option>`).join('')}
                </select>
            </td>
            <td><button onclick="agregarAlGrupo(${index})">Agregar al Grupo</button></td>
        `;
    });
}

// Llama a las funciones para generar ambas tablas cuando se cargue la página
window.onload = function() {
    grupos=JSON.parse(localStorage.getItem('grupos'));
    generarTabla();
    generarTablaAlumnos(grupos);
};

// Función para generar la tabla de alumnos filtrados por grupo
function generarTablaAlumnosFiltrados(alumnosFiltrados) {
    let tablaBody = document.querySelector('#tabla-alumnos-container');
    tablaBody.innerHTML = ''; // Limpiar el contenido anterior de la tabla

    // Iterar sobre cada alumno y agregar una fila a la tabla para cada uno
    alumnosFiltrados.forEach((alumno, index) => {
        let row = tablaBody.insertRow();
        row.innerHTML = `
            <td>${alumno.id}</td>
            <td>${alumno.nombre}</td>
            <td>${alumno.primerApellido}</td>
            <td>${alumno.segundoApellido}</td>
            <td>${alumno.edad}</td>
            <td>${alumno.materiasInscritas.map(materia => materia.nombreMateria).join(', ')}</td>
            <td>${alumno.materiasInscritas.map(materia => materia.calificacion).join(', ')}</td>
            <td>
                <select id="grupo-${index}">
                    <!-- Aquí se generará automáticamente las opciones de grupo -->
                </select>
            </td>
            <td><button onclick="agregarAlGrupo(${index})">Agregar al Grupo</button></td>
        `;
    });
    
    // Llamar a la función para generar las opciones del select con los grupos disponibles
    generarOpcionesGrupos();
}