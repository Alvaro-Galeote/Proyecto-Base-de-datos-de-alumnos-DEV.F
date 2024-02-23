let alumnos=[];

function recuperarValores(){ 
    let valorNombre=document.getElementById("nombre").value;
    let valorApellido = document.getElementById("primer-Apellido").value;
    let valorSegundoApellido = document.getElementById("segundo-Apellido").value;
    let valorEdad = document.getElementById("edad").value;

    let alumnoNuevo = new Alumno(valorNombre,valorApellido,valorSegundoApellido,valorEdad);
    alumnos.push(alumnoNuevo);
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
    
      document.getElementById('nombre').value = '';
      document.getElementById('primer-Apellido').value = '';
      document.getElementById('segundo-Apellido').value = '';
      document.getElementById('edad').value = '';
    generarTabla();
}

let materias=["Phyton","JS","Java","C++"];

function asignarMaterias(indiceAlumno) {
    let materiasAsignadas = new Set(); // Utilizamos un Set para evitar duplicados

    materias.forEach(materia => {
        let checkbox = document.getElementById(`materia-${indiceAlumno}-${materia}`);
        if (checkbox.checked) {
            materiasAsignadas.add(materia); // Agregamos la materia al Set
        }
    });

    if (materiasAsignadas.size === 0) {
        console.log('No se ha seleccionado ninguna materia.');
        return; // Salimos de la función si no se ha seleccionado ninguna materia
    }
    // Limpiamos el array existente de materiasInscritas del alumno
    alumnos[indiceAlumno].materiasInscritas = [];
    // Agregamos las materias seleccionadas al array de materiasInscritas del alumno
    materiasAsignadas.forEach(materia => {
        alumnos[indiceAlumno].materiasInscritas.push(new Materia(materia));
    });
    console.log(`Materias asignadas al alumno ${alumnos[indiceAlumno].nombre}: ${alumnos[indiceAlumno].materiasInscritas.map(materia => materia.nombreMateria)}`);
}

function buscarAlumno() {
    let alumnoBuscadoId = parseInt(document.getElementById('alumnoBuscado').value);

    // Asegúrate de que los alumnos estén ordenados por ID
    alumnos.sort((a, b) => a.id - b.id);

    let alumnoEncontrado = busquedaBinaria(alumnos, alumnoBuscadoId);

    if (alumnoEncontrado !== -1) {
        let tablaContainer = document.getElementById('tabla-container2');
        if(alumnoEncontrado.materiasInscritas.length==0){
            alert("Aun no cuenta con materias");
        }
    
        tablaContainer.innerHTML = generarTablaMaterias(alumnoEncontrado);
    } else {
        alert('Alumno no encontrado.');
    }
}

function busquedaBinaria(array, objetivo) {
    let izquierda = 0;
    let derecha = array.length - 1;

    while (izquierda <= derecha) {
        let medio = Math.floor((izquierda + derecha) / 2);
        let alumnoActual = array[medio];

        if (alumnoActual.id === objetivo) {
            return alumnoActual;
        } else if (alumnoActual.id < objetivo) {
            izquierda = medio + 1;
        } else {
            derecha = medio - 1;
        }
    }

    return -1; // No se encontró el alumno
}

function generarTablaMaterias(alumno) {
    let tablaHTML = `<table border="1">
                        <tr>
                            <th>Materia</th>
                            <th>Calificación</th>
                        </tr>`;
    
    alumno.materiasInscritas.forEach(materia => {
        tablaHTML += `<tr>
                        <td>${materia.nombreMateria}</td>
                        <td><input type="text" placeholder="Calificación" id="${materia.nombreMateria}-calificacion"></td>
                    </tr>`;
    });

    tablaHTML += `</table>
                  <button onclick="guardarCalificaciones('${alumno.nombre}')">Guardar Calificaciones</button>`;

    return tablaHTML;
}

function guardarCalificaciones(nombreAlumno) {
    let alumno = alumnos.find(alumno => alumno.nombre === nombreAlumno);
    let sumaCalificaciones = 0;

    alumno.materiasInscritas.forEach(materia => {
        let calificacionInput = document.getElementById(`${materia.nombreMateria}-calificacion`);
        let calificacion = calificacionInput.value;
        // Actualizar la calificación de la materia en el array de materias inscritas del alumno
        materia.calificacion = calificacion;
        
        // Sumar las calificaciones para calcular el promedio
        sumaCalificaciones += parseFloat(calificacion);
    });
    
    // Calcular el promedio
    alumno.promedio = sumaCalificaciones / alumno.materiasInscritas.length;
    
    // Guardar los cambios en el almacenamiento local
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
    console.log('Calificaciones guardadas:', alumno);
}

let grupos = [{grupo:"",promedioGrupo:10}];
let gruposSet = new Set();

// Función para crear un nuevo grupo y agregarlo al Set de grupos y al array de grupos
function crearGrupo() {
    let nombreGrupoInput = document.getElementById("nombreGrupo");
    let nombreGrupo = nombreGrupoInput.value;

    // Verificar si el grupo ya existe en el Set de grupos
    if (gruposSet.has(nombreGrupo)) {
        console.log(`El grupo "${nombreGrupo}" ya existe.`);
        return; // Salir de la función si el grupo ya existe
    }
    // Agregar el nombre del grupo al Set de grupos
    gruposSet.add(nombreGrupo);

    // Convertir el Set de grupos de nuevo a un array y asignarlo al array de grupos
    grupos = Array.from(gruposSet).map(grupo => ({ grupo, promedioGrupo: 0 })); // Agregar promedioGrupo: 0 por defecto

    // Limpiar el campo de entrada después de agregar el grupo
    nombreGrupoInput.value = '';

    // Actualizar la tabla de alumnos con los nuevos datos
    generarTablaAlumnos(grupos);
    
    // Puedes mostrar el array actualizado de grupos en la consola para verificarlo
    console.log('Grupos actualizados:', grupos);
    localStorage.setItem('grupos',JSON.stringify(grupos));
    generarOpcionesGrupos(grupos);
}

function agregarAlGrupo(index) {
    // Obtener el elemento select del grupo seleccionado
    let selectGrupo = document.getElementById(`grupo-${index}`);
    if (selectGrupo !== null) {
        // Obtener el valor seleccionado del grupo
        let grupoSeleccionado = selectGrupo.value;
        // Buscar el alumno en el array de alumnos por su índice
        let alumno = alumnos[index];
        
        // Actualizar el grupo del alumno con el valor seleccionado
        alumno.grupo = grupoSeleccionado;

        // Mostrar un mensaje en la consola para verificar que se ha asignado el grupo correctamente
        console.log(`El alumno ${alumno.nombre} ha sido asignado al grupo ${grupoSeleccionado}.`);

        // Guardar el array de alumnos en el almacenamiento local
        localStorage.setItem('alumnos', JSON.stringify(alumnos));

        // Puedes actualizar la tabla de alumnos para reflejar el cambio en la asignación del grupo si es necesario
        generarTablaAlumnos(grupos);
    } else {
        console.log(`El elemento select con el ID "grupo-${index}" no fue encontrado.`);
    }
}


window.onload = function() {
    grupos=JSON.parse(localStorage.getItem('grupos'));
    generarTablaAlumnos(grupos);
    generarOpcionesGrupos();
};



// Función para generar las opciones del select con los grupos disponibles
function generarOpcionesGrupos(grupos) {
    grupos=JSON.parse(localStorage.getItem('grupos'));
    let selectGrupo = document.getElementById('selectGrupo');
    selectGrupo.innerHTML = ''; // Limpiar las opciones anteriores

    // Agregar la opción "Todos" por defecto
    selectGrupo.innerHTML += '<option value="todos">Todos</option>';

    // Iterar sobre el array de grupos y agregar una opción para cada uno
    grupos.forEach(grupo => {
        selectGrupo.innerHTML += `<option value="${grupo.grupo}">${grupo.grupo}</option>`;
    });
}

// Función para filtrar los alumnos por el grupo seleccionado
function filtrarAlumnosPorGrupo() {
    let grupoSeleccionado = document.getElementById('selectGrupo').value;

    // Filtrar los alumnos por el grupo seleccionado
    let alumnosFiltrados = [];
    if (grupoSeleccionado === 'todos') {
        // Mostrar todos los alumnos si se selecciona la opción 'Todos'
        alumnosFiltrados = alumnos;
    } else {
        // Filtrar los alumnos por el grupo seleccionado
        alumnosFiltrados = alumnos.filter(alumno => alumno.grupo === grupoSeleccionado);
    }

    // Generar la tabla de alumnos con los alumnos filtrados
    generarTablaCompletaAlumnos(alumnosFiltrados,grupoSeleccionado);
    console.log(alumnosFiltrados);
}

function generarTablaCompletaAlumnos(listaAlumnos, grupoSeleccionado) {
    // Obtener el contenedor de la tabla
    let tablaContainer = document.getElementById('tabla-alumnos-container');

    // Limpiar cualquier contenido previo en el contenedor
    tablaContainer.innerHTML = '';

    // Crear la tabla y su cabecera
    let tabla = document.createElement('table');
    let thead = document.createElement('thead');
    let trHeader = document.createElement('tr');
    trHeader.innerHTML = `
        <th>Nombre</th>
        <th>Apellido</th>
        <th>Edad</th>
        <th>Grupo</th>
        <th>Promedio</th>
    `;
    thead.appendChild(trHeader);
    tabla.appendChild(thead);

    // Crear el cuerpo de la tabla
    let tbody = document.createElement('tbody');

    // Filtrar los alumnos por el grupo seleccionado
    let alumnosGrupo = listaAlumnos.filter(alumno => alumno.grupo === grupoSeleccionado);

    // Iterar sobre los alumnos del grupo seleccionado y agregar cada uno como una fila en la tabla
    alumnosGrupo.forEach(alumno => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${alumno.nombre}</td>
            <td>${alumno.primerApellido}</td>
            <td>${alumno.edad}</td>
            <td>${alumno.grupo}</td>
            <td>${alumno.promedio}</td>
        `;
        tbody.appendChild(tr);
    });

    // Agregar el cuerpo de la tabla al elemento tabla
    tabla.appendChild(tbody);

    // Agregar la tabla al contenedor
    tablaContainer.appendChild(tabla);
}

// Función para filtrar y ordenar los alumnos por grupo y luego por promedio
function ordenarPorPromedioMayor() {
    // Obtener el grupo seleccionado
    let grupoSeleccionado = document.getElementById('selectGrupo').value;
    
    // Filtrar los alumnos por el grupo seleccionado
    let alumnosGrupo = alumnos.filter(alumno => alumno.grupo === grupoSeleccionado);
    
    // Implementar el algoritmo Bubble Sort para ordenar los alumnos por su promedio de mayor a menor
    for (let i = 0; i < alumnosGrupo.length - 1; i++) {
        for (let j = 0; j < alumnosGrupo.length - i - 1; j++) {
            if (alumnosGrupo[j].promedio < alumnosGrupo[j + 1].promedio) {
                // Intercambiar los elementos si el promedio del elemento actual es menor que el del siguiente
                let temp = alumnosGrupo[j];
                alumnosGrupo[j] = alumnosGrupo[j + 1];
                alumnosGrupo[j + 1] = temp;
            }
        }
    }
    
    // Actualizar la tabla de alumnos con el nuevo orden
    generarTablaCompletaAlumnos(alumnosGrupo, grupoSeleccionado);
}

function ordenarPorPromedioMenor() {
    // Obtener el grupo seleccionado
    let grupoSeleccionado = document.getElementById('selectGrupo').value;
    
    // Filtrar los alumnos por el grupo seleccionado
    let alumnosGrupo = alumnos.filter(alumno => alumno.grupo === grupoSeleccionado);
    
    // Implementar el algoritmo Bubble Sort para ordenar los alumnos por su promedio de mayor a menor
    for (let i = 0; i < alumnosGrupo.length - 1; i++) {
        for (let j = 0; j < alumnosGrupo.length - i - 1; j++) {
            if (alumnosGrupo[j].promedio > alumnosGrupo[j + 1].promedio) {
                // Intercambiar los elementos si el promedio del elemento actual es menor que el del siguiente
                let temp = alumnosGrupo[j];
                alumnosGrupo[j] = alumnosGrupo[j + 1];
                alumnosGrupo[j + 1] = temp;
            }
        }
    }
    // Actualizar la tabla de alumnos con el nuevo orden
    generarTablaCompletaAlumnos(alumnosGrupo, grupoSeleccionado);
}

function ordenarPorEdad() {
    // Obtener el grupo seleccionado
    let grupoSeleccionado = document.getElementById('selectGrupo').value;
    
    // Filtrar los alumnos por el grupo seleccionado
    let alumnosGrupo = alumnos.filter(alumno => alumno.grupo === grupoSeleccionado);
    
    // Ordenar los alumnos filtrados por edad de menor a mayor
    alumnosGrupo.sort((a, b) => a.edad - b.edad);
    
    // Actualizar la tabla de alumnos con el nuevo orden
    generarTablaCompletaAlumnos(alumnosGrupo, grupoSeleccionado);
}

function calcularPromedioGrupoGeneral() {
    // Obtener todos los promedios de los alumnos
    let promediosAlumnos = alumnos.map(alumno => alumno.promedio);
    
    // Calcular el promedio del grupo general
    let promedioGrupoGeneral = promediosAlumnos.reduce((total, promedio) => total + promedio, 0) / promediosAlumnos.length;
    
    // Mostrar el resultado
    console.log('Promedio del Grupo General:', promedioGrupoGeneral);
    alert(`Promedio del Grupo General: ${promedioGrupoGeneral}`);
}

function buscarAlumnoPorNombre() {
    let nombreBuscado = document.getElementById('alumnoBuscadoNombre').value.trim().toLowerCase();

    // Filtrar los alumnos cuyo nombre coincida con el nombre buscado (ignorando mayúsculas/minúsculas)
    let alumnosEncontrados = alumnos.filter(alumno => alumno.nombre.toLowerCase().includes(nombreBuscado));

    // Mostrar los resultados en la tabla
    mostrarResultados(alumnosEncontrados);
}

function mostrarResultados(alumnos) {
    let tablaContainer = document.getElementById('tabla-container2');
    tablaContainer.innerHTML = ''; // Limpiar contenido anterior

    if (alumnos.length === 0) {
        tablaContainer.textContent = 'No se encontraron resultados.';
        return;
    }

    let tablaHTML = '<table border="1"><thead><tr><th>ID</th><th>Nombre</th><th>Apellido Paterno</th><th>Apellido Materno</th><th>Edad</th></tr></thead><tbody>';
    alumnos.forEach(alumno => {
        tablaHTML += `<tr><td>${alumno.id}</td><td>${alumno.nombre}</td><td>${alumno.primerApellido}</td><td>${alumno.segundoApellido}</td><td>${alumno.edad}</td></tr>`;
    });
    tablaHTML += '</tbody></table>';

    tablaContainer.innerHTML = tablaHTML;
}
