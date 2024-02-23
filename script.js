class Alumno {
    static contadorIds = 0;
    constructor(nombreAlumno, primerApellido, segundoApellido, edad) {
        this.id = ++Alumno.contadorIds;
        this.nombre = nombreAlumno;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
        this.edad = edad;
        this.materiasInscritas = [];
        this.grupo = null;
        this.promedio=0;
    }

    inscribirMateria(materia) {
        this.materiasInscritas.push(materia);
    }

    asignarCalificacion(materia, calificacion) {
        let materiaInscrita = this.materiasInscritas.find(mat => mat.nombreMateria === materia);
        if (materiaInscrita) {
            materiaInscrita.calificacion = calificacion;
        } else {
            console.log(`La materia ${materia} no está inscrita.`);
        }
    }
    
}

class Materia{
    constructor(nombreMateria){
        this.nombreMateria=nombreMateria;
        this.calificacion=0;
    }
}

class Grupo{
    constructor(Grupo){
        this.grupo=Grupo;
        this.promedioGrupo=0;
    }
}

