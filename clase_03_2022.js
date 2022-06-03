// Simulación de modelo relacional
db.createCollection('carrera', {
    validator:
    {
        $jsonSchema:
        {
            bsonType: 'object', //formato dominante en mongodb
            required: ['nombre', 'totalSemestres'], //Atributos obligatorios de completar
            properties:{
                nombre:{
                    bsonType: 'string',
                    description: 'aquí va el nombre',
                },
                totalSemestres:{
                    bsonType: 'number',
                    description: 'aquí va el total de semestres'
                }
                /*
                creditos:{
                    bsonType: 'number',
                    description: 'aquí van los créditos'
                }
                */
            }
        }
    } //define en que rango se puede validar un dato
})

// inserción de un valor
db.carrera.insertOne({nombre: 'informática',totalSemestres: 8 });
db.carrera.insertOne({nombre: 'mecánica',totalSemestres: 8 });
db.carrera.insertOne({nombre: 'logistica',totalSemestres: 6 });


db.createCollection('alumno', {
    validator:
    {
        $jsonSchema:
        {
            bsonType: 'object', 
            required: ['nombre', 'edad', 'idCarrera'],
            properties: {
                nombre: {
                    bsonType: 'string',
                    description: 'es el nombre del alumno'
                },
                edad: {
                    bsonType: 'number',
                    description: 'es la edad del alumno'
                },
                sexo: {
                    bsonType: 'string',
                    description: 'es el sexo del alumno (opcional)'
                },
                idCarrera: {
                    bsonType: 'objectId',
                    description: 'es el ID único de la carrera del alumno'
                }
            }
        }
    }
})

db.alumno.insertOne({nombre: 'Claudio Farias', edad: 23, sexo: 'masculino', idCarrera: ObjectId("629a527cb4a680e24d593727")})
db.alumno.insertOne({nombre: 'Jorge Diaz', edad: 23, idCarrera: ObjectId("629a527cb4a680e24d593727")})
db.alumno.insertOne({nombre: 'Marcela Flores', edad: 23, sexo: 'femenino', idCarrera: ObjectId("629a52a2b4a680e24d593729")})


db.createCollection('asignatura', {
    validator:
    {
        $jsonSchema:
        {
            bsonType: 'object',
            required: ['nombre', 'totalHoras'],
            properties:{
                nombre: {
                    bsonType: 'string',
                    description: 'aquí va el nombre'
                },
                totalHoras:{
                    bsonType: 'number',
                    description: 'aquí va total de horas'
                }
            }
        }
    }
})

db.asignatura.insertOne({nombre: 'Base de datos', totalHoras: 54});
db.asignatura.insertOne({nombre: 'Programación', totalHoras: 70});


db.createCollection('notasFinales', {
    validator:
    {
        $jsonSchema:
        {
            bsonType: 'object',
            required: ['idAlumno', 'idAsignatura', 'nota'],
            properties: {
                idAlumno: {
                    bsonType: 'objectId',
                    description: 'aquí va el id del alumno'
                },
                idAsignatura: {
                    bsonType: 'objectId',
                    description: 'aquí va el id de la asignatura'
                },
                nota: {
                    bsonType: 'number',
                    description: 'aquí van las notas'
                }
            }
        }
    }
})

db.notasFinales.insertOne({idAlumno: ObjectId("629a5541b4a680e24d59372a"), idAsignatura: ObjectId("629a5820b4a680e24d593730"), nota: 67})


// Consultar compisición de un esquema (SCHEMA)

db.getCollectionInfos({name: 'alumno'});


// Conocer la nota de base de datos del alumno Claudio farías

var resultado = db.carrera.find({nombre: 'informática'});

var codAsignatura = db.asignatura.find({nombre: 'Base de datos'}).map(x => x._id);