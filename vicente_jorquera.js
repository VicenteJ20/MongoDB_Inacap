// (1) Contar los vehículos de acuerdo al tipo
db.vehiculo.aggregate([
    {
        $group:
        {
            _id: '$tipo',
            cantidad: {$sum: 1}
        }
    }
])

// (2) Calcular el precio promedio de los vehículos con transmisión mecánica

db.vehiculo.aggregate([
    {
        $match:
        {
            'opciones.transmision': 'mecanica'
        }
    },
    {
        $group:
        {
            _id: '$opciones.transmision',
            'Precio promedio': {$avg: '$precio'}
        }
    }
])


// (3) Mostrar el tipo, precio, kilómetros recorridos, color y opciones cuando el mercado de los vehículos considera la ciudad de Talca

db.vehiculo.aggregate([
    {
        $match:
        {
            mercado: /Talca/
        }
    },
    {
        $project:
        {
            _id: 0,
            tipo: 1,
            precio: 1,
            kmRecorridos: 1,
            color: 1,
            opciones: 1
        }
    }
])

// (4) Mostrar el precio máximo y mínimo de vehículos tipo automóvil con color distinto a blanco
db.vehiculo.aggregate([
    {
        $match:
        {
            color: {$not: /blanco/},
            tipo: 'automovil'
        }
    },
    {
        $group:
        {
            _id: '$tipo',
            'Precio máximo': {$max: '$precio'},
            'Precio mínimo': {$min: '$precio'}
        }
    }
])

// (5) Calcular la recaudación en el caso que se vendieran todos los vehículos a gasolina que registran un precio menor a los 10 millones.
db.vehiculo.aggregate([
    {
        $match:
        {
            'opciones.combustible': 'gasolina',
            precio: {$lt: 10000000}
        }
    },
    {
        $group:
        {
            _id: 'gasolina',
            'Recaudación total': {$sum: '$precio'}
        }
    }
])

// (6) Para el mercado de Santiago mostrar por tipo de vehículo el kilometraje recorrido de mayor a menor
db.vehiculo.aggregate([
    {
        $sort:
        {
            'kmRecorridos': -1
        }
    },
    {
        $match:
        {
            'mercado': 'Santiago',
        }
    },
    {
        $group:
        {
            _id: '$tipo',
            kilometraje: 1,
            kilometraje: {$sum: '$kmRecorridos'}
        }
    }
])

// (7) Por cada vehículo mostrar el precio rebajado en un 10% cuando se paga con efectivo y en un 5% cuandos se utiliza transferencia electrónica.
db.vehiculo.aggregate([
    {
        $project:
        {
            _id: 1,
            tipo: 1,
            precio: 1,
            'Precio pago en efectivo:':
            {
                $subtract: ['$precio', {$multiply: ['$precio', 0.1]}]
            },
            'Precio pago por transferencia:':
            {
                $subtract: ['$precio', {$multiply: ['$precio', 0.05]}]
            }
        }
    }
])


// (8) Mostrar Verdadero o Falso cuando el precio de los vehículos a excepción de las camionetas se encuentran entre los 9 millones y 12 millones ambos inclusive.
db.vehiculo.aggregate([
    {
        $match:
        {
            tipo: {$not: /camioneta/}
        }
    },
    {
        $project:
        {
            _id: 0,
            tipo: 1,
            precio: 1,
            'Resultado condición precio: ': {
                $cond:
                {
                    if: {$and: [{$gte: ['$precio', 9000000]}, {$lte: ['$precio', 12000000]}]},
                    then: 'Verdadero',
                    else: 'Falso'
                }
            }

        }
    }
])

// (9) Para los mercados de Santiago y Concepción mostrar los datos los vehículos ordenados por precio (de menor a mayor) cuando la transmisión es mecánica.
db.vehiculo.aggregate([
    {
        $sort:
        {
            'precio': 1
        }
    },
    {
        $match:
        {
            $or:[{'mercado':'Santiago'},{'mercado':'Concepcion'}],
            'opciones.transmision': 'mecanica'
        }
    },
    {
        $project:
        {
            _id: 1,
            tipo: 1,
            kmRecorridos: 1,
            color: 1,
            mercado: 1,
            opciones: 1,
            precio: 1
        }
    }
]).pretty()

// (10) Para cada uno de los vehículos mostrar Verdadero o Falso cuando el combustible es diésel, la transmisión es mecánica y el color es blanco o amarillo.
db.vehiculo.aggregate([
    {
        $project:
        {
            _id: 1,
            tipo: 1,
            precio: 1,
            opciones: 1,
            color: 1,
            'Resultado condición':
            {
                $cond:
                {
                    if: {$and:[
                            {$eq: ['$opciones.combustible', 'diesel']},
                            {$eq: ['$opciones.transmision', 'mecanica']},
                            {$or: [
                                {$eq: ['$color', 'blanco']},
                                {$eq: ['$color', 'amarillo']}
                            ]}
                        ]},
                    then: 'Verdadero',
                    else: 'Falso'
                }
            }
        }
    }
])