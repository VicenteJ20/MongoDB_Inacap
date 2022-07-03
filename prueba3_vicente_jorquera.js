// Ejercicio 1: Por cada tabla crear la colección respectiva tomando en cuenta las relaciones proporcionadas.

db.createCollection('Alumno', {
    validator:
    {
        $jsonSchema:
        {
            bsonType: 'object',
            required: ['codigo', 'nombre', 'sexo'],
            properties: {
                codigo: {
                    bsonType: 'number',
                    description: 'Código respectivo al curso'
                },
                nombre: {
                    bsonType: 'string',
                    description: 'Nombre respectivo al curso'
                },
                sexo: {
                    bsonType: 'string',
                    description: 'Indicar sexo del Alumno/Alumna'
                }
            }
        }
    }
})

db.createCollection('Cursa', {
    validator:
    {
        $jsonSchema:
        {
            bsonType: 'object',
            required: ['codigoAsignatura', 'codigoAlumno'],
            properties: {
                codigoAsignatura: {
                    bsonType: 'number',
                    description: 'Acá va el código de la asignatura!'
                },
                codigoAlumno: {
                    bsonType: 'number',
                    description: 'Acá va el código del ID correspondiente al alumno'
                }
            }
        }
    }
})

db.createCollection('Docente', {
    validator:
    {
        $jsonSchema:
        {
            bsonType: 'object',
            required: ['codigo', 'nombre', 'fechaNacimiento', 'sueldo'],
            properties: {
                codigo: {
                    bsonType: 'number',
                    description: 'Código ID del Docente'
                },
                nombre: {
                    bsonType: 'string',
                    description: 'Nombre del docente'
                },
                fechaNacimiento: {
                    bsonType: 'date',
                    description: 'fecha de nacimiento en formato año - mes - día'
                },
                sueldo: {
                    bsonType: 'number',
                    description: 'sueldo del docente'
                }
            }
        }
    }
})

db.createCollection('Asignatura', {
    validator:
    {
        $jsonSchema:
        {
            bsonType: 'object',
            required: ['codigo', 'nombre', 'totalHoras', 'tipo', 'codigoDocente'],
            properties: {
                codigo: {
                    bsonType: 'number',
                    description: 'Código ID de la Asignatura'
                },
                nombre: {
                    bsonType: 'string',
                    description: 'Código de la asignatura'
                },
                totalHoras: {
                    bsonType: 'number',
                    description: 'Total de horas de la asignatura'
                },
                tipo: {
                    bsonType: 'string',
                    description: 'Indicar tipo de asignatura'
                },
                codigoDocente: {
                    bsonType: 'number',
                    description: 'Indicar código del docente'
                }
            }
        }
    }
})

// Ejercicio 2: Por cada colección agregar tres documentos cualesquiera respetando las relaciones señaladas.

// Alumno
db.Alumno.insertOne({codigo: 1, nombre: 'Rodrigo Rodriguez', sexo:'M'});
db.Alumno.insertOne({codigo: 2, nombre: 'Elisa Prettier', sexo: 'F'});
db.Alumno.insertOne({codigo: 3, nombre: 'Juan Delgado', sexo: 'M'});

// Docente
db.Docente.insertOne({codigo: 1, nombre: 'Pablo Cerda', fechaNacimiento: ISODate('1972-02-19'), sueldo: 929990});
db.Docente.insertOne({codigo: 2, nombre: 'Patricio Carozzi', fechaNacimiento: ISODate('1950-01-01'), sueldo: 1989769});
db.Docente.insertOne({codigo: 3, nombre: 'Yasna Spaces', fechaNacimiento: ISODate('1987-08-29'), sueldo: 899789});
db.Docente.insertOne({codigo: 4, nombre: 'Sleeping Wolf', fechaNacimiento: ISODate('1955-12-01'), sueldo: 949769}); // este lo agregué para verificar si funcionaba la condición del ejercicio 3

// Asignatura
db.Asignatura.insertOne({codigo: 1, nombre: 'Programación Back End', totalHoras: 90,tipo: 'Práctica', codigoDocente: 2});
db.Asignatura.insertOne({codigo: 2, nombre: 'Inglés', totalHoras: 57, tipo: 'Lectiva', codigoDocente: 3});
db.Asignatura.insertOne({codigo: 3, nombre: 'Base de datos No Estructuradas', totalHoras: 54, tipo: 'Práctica', codigoDocente: 1});

// Cursa
db.Cursa.insertOne({codigoAsignatura: 1, codigoAlumno: 2});
db.Cursa.insertOne({codigoAsignatura: 2, codigoAlumno: 3});
db.Cursa.insertOne({codigoAsignatura: 3, codigoAlumno: 1});

// Ejercicio 3: Por cada docente mostrar Verdadero o Falso cuando nació en el último trimestre del año.

db.Docente.aggregate([
    {
        $project:
        {
            _id: 0,
            codigo: 1,
            nombre: 1,
            fechaNacimiento: {$dateToString: {format: '%d-%m-%Y', date: '$fechaNacimiento'}},
            'Resultado condicion': {
                $cond:
                {
                    if: {$and: [{$gte: [{$month: '$fechaNacimiento'}, 10]}, {$lte: [{$month: '$fechaNacimiento'}, 12]}]},
                    then: 'Verdadero',
                    else: 'Falso'
                }
            }
        }
    }
])

// Ejercicio 4: Para la colección asignatura crear un índice compuesto UNIQUE y BACKGROUND denominado 'miIndiceCompuesto' conformado por las propiedades Nombre, Tipo y totalHoras.

db.Asignatura.createIndex(
    {nombre: 1, tipo: 1, totalHoras: 1},
    {unique: true, background: true, name: 'miIndiceCompuesto'}
);

// Ejercicio 5: Para la colección docente crear un Índice parcial sobre la propiedad sueldo que considere los valores mayores 800000 y menores a 1500000.

db.Docente.createIndex(
    {sueldo: 1},
    {
        partialFilterExpression: {
            sueldo: [{$gt: ['$sueldo', 800000]}, {$lt: ['$sueldo', 1500000]}]
        }
    }
);

// Ejercicio 6: Por cada docente mostrar el nombre, fecha de nacimiento y edad actual.
db.Docente.aggregate([
    {
        $project:
        {
            _id: 0,
            codigo: 1,
            nombre: 1,
            fechaNacimiento: {$dateToString: {format: '%d-%m-%Y', date: '$fechaNacimiento'}},
            'Edad Actual': {
                $subtract: [{$year: new Date()}, {$year: '$fechaNacimiento'}]
            }
        }
    }
])

// Ejercicio 7: Contar los docentes que nacieron un fin de semana.

// Ejercicio 8: Por cada Docente mostrar V o F si nació en un año bisiesto
db.Docente.aggregate([
    {
        $project:
        {
            _id: 0,
            codigo: 1,
            nombre: 1,
            fechaNacimiento: {$dateToString: {format: '%d-%m-%Y', date: '$fechaNacimiento'}},
            'Nacido/a en año bisiesto': {
                $cond:
                {
                    if: {$or: 
                        [
                            {$eq: 
                                [
                                    {$mod: [{$year: '$fechaNacimiento'}, 400]}, 0]}, 
                                    {$and: 
                                        [
                                            {$eq: [{$mod: [{$year: '$fechaNacimiento'}, 4]}, 0]},
                                            {$ne: [{$mod: [{$year: '$fechaNacimiento'}, 100]}, 0]}
                                        ]
                                    }
                                
                        ]},
                    then: 'Verdadero',
                    else: 'Falso'
                }
            }
        }
    }
])

//Ejercicio 9: Mediante la utilización de variables en Shell de Mongo DB, se solicita mostrar el nombre de las asignaturas cursadas por un alumno cuando se conoce su nombre.

// Se le asigna el nombre del alumno/a que se quiere buscar
var nombreABuscar = 'Elisa Prettier';

// Obtiene el código del alumno/a
var codigoDelAlumno = db.Alumno.find(
    {nombre: nombreABuscar},
    {codigo: 1}
).map(x => x.codigo)

var codigoDeLaAsignatura = db.Cursa.find(
    {codigoAlumno: codigoDelAlumno[0]},
    {codigoAsignatura: 1}
).map(x => x.codigoAsignatura)

var asignaturaCursadaPorElAlumno = db.Asignatura.find(
    {codigo: codigoDeLaAsignatura[0]}, // Creo que acá este 0 debería variar como si lo recorriera con un ciclo para que me devolviera todas las asignaturas que coinciden, pero no se me ocurrió como hacerlo :).
    {nombre: 1}
).map(x => x.nombre)

//Ejercicio 10: Dado el nombre de un docente mostrar los nombres de cada una de sus alumnas, la respuesta debe utilizar variables en el Shell de Mongo DB.

var nombreDocente = 'Patricio Carozzi';

var codigoDelDocente1 = db.Docente.find(
    {nombre: nombreDocente},
    {codigo: 1}
).map(y => y.codigo)

var codigoDeLaAsignatura1 = db.Asignatura.find(
    {codigoDocente: codigoDelDocente1[0]},
    {codigo: 1}
).map(y => y.codigo)

var codigoDelAlumno1 = db.Cursa.find(
    {codigoAsignatura: codigoDeLaAsignatura1[0]},
    {codigoAlumno: 1}
).map(y => y.codigoAlumno)


// En esta variable me da el error "Cannot compare to undefined", el cual no tengo idea por qué da, y que cuando imprimo codigoDelAlumno1 por consola me retorna esto: [ 2 ], así que no sé que pasa :/
var nombreDeLasAlumnas = db.Alumno.find(
    {
        sexo: 'F',
        $or:[
            {codigo: codigoDelAlumno1[0]},
            {codigo: codigoDelAlumno1[1]},
            {codigo: codigoDelAlumno1[2]}
        ]
    }
).map(y => y.nombre)