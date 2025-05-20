import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const serializarBigIntYFechas = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(serializarBigIntYFechas);
    } else if (obj && typeof obj === 'object') {
        if (obj instanceof Date) {
            return obj.toISOString();
        }
        const newObj = {};
        for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'bigint') {
                newObj[key] = value.toString();
            } else if (value instanceof Date) {
                newObj[key] = value.toISOString();
            } else if (typeof value === 'object') {
                newObj[key] = serializarBigIntYFechas(value);
            } else {
                newObj[key] = value;
            }
        }
        return newObj;
    }
    return obj;
};

export const getConfiguraciones = async (req, res) => {
    try {
        const configuraciones = await prisma.configuracion.findMany({
            include: {
                finalidad: true,
                flujo: true,
                producto: true,
            },
        });

        const resultado = serializarBigIntYFechas(configuraciones);

        res.json(resultado);
    } catch (error) {
        console.error("Error al obtener configuraciones:", error);
        res.status(500).json({ error: 'Error al obtener configuraciones' });
    }
};


// POST - Crear una configuración
export const createConfiguracion = async (req, res) => {
    console.log("Datos recibidos:", req.body);

    try {
        const {
            id_flujo,
            id_finalidad,
            id_producto,
            activo,
            fecha_desactivacion,
            fecha_ultimo_cambio,
            dias_duracion_finalidad,
        } = req.body;

        const nuevaConfiguracion = await prisma.configuracion.create({
            data: {
                id_flujo: id_flujo ? BigInt(id_flujo) : null,
                id_finalidad: BigInt(id_finalidad),
                id_producto: id_producto ? BigInt(id_producto) : null,
                activo: activo ? 1 : 0,
                fecha_desactivacion: fecha_desactivacion ? new Date(fecha_desactivacion) : null,
                fecha_ultimo_cambio: fecha_ultimo_cambio ? new Date(fecha_ultimo_cambio) : null,
                dias_duracion_finalidad: parseInt(dias_duracion_finalidad),
            },
        });

        res.status(201).json({
            ...nuevaConfiguracion,
            id_configuracion: nuevaConfiguracion.id_configuracion.toString(),
            id_flujo: nuevaConfiguracion.id_flujo?.toString() || null,
            id_finalidad: nuevaConfiguracion.id_finalidad.toString(),
            id_producto: nuevaConfiguracion.id_producto?.toString() || null,
        });
    } catch (error) {
        console.error("Error al crear configuración:", error);
        res.status(500).json({ error: 'Error al crear configuración' });
    }
};

// PUT - Actualizar una configuración
export const updateConfiguracion = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            id_flujo,
            id_finalidad,
            id_producto,
            activo,
            fecha_desactivacion,
            fecha_ultimo_cambio,
            dias_duracion_finalidad,
        } = req.body;

        const configuracionActualizada = await prisma.configuracion.update({
            where: {
                id_configuracion: BigInt(id),
            },
            data: {
                id_flujo: id_flujo ? BigInt(id_flujo) : null,
                id_finalidad: BigInt(id_finalidad),
                id_producto: id_producto ? BigInt(id_producto) : null,
                activo,
                fecha_desactivacion: fecha_desactivacion ? new Date(fecha_desactivacion) : null,
                fecha_ultimo_cambio: fecha_ultimo_cambio ? new Date(fecha_ultimo_cambio) : null,
                dias_duracion_finalidad,
            },
        });

        res.json({
            ...configuracionActualizada,
            id_configuracion: configuracionActualizada.id_configuracion.toString(),
            id_flujo: configuracionActualizada.id_flujo?.toString() || null,
            id_finalidad: configuracionActualizada.id_finalidad.toString(),
            id_producto: configuracionActualizada.id_producto?.toString() || null,
        });
    } catch (error) {
        console.error("Error al actualizar configuración:", error);
        res.status(500).json({ error: 'Error al actualizar configuración' });
    }
};

// DELETE - Eliminar configuración
export const deleteConfiguracion = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.configuracion.delete({
            where: {
                id_configuracion: BigInt(id),
            },
        });

        res.json({ message: 'Configuración eliminada correctamente' });
    } catch (error) {
        console.error("Error al eliminar configuración:", error);
        res.status(500).json({ error: 'Error al eliminar configuración' });
    }
};


export const obtenerDescripcionesConfiguracion = async (req, res) => {
    try {
        const resultados = await prisma.$queryRaw`
            SELECT 
                c.id_configuracion,  
                p.descripcion || ' - ' || fi.cabecera || ' - ' || f.descripcion AS descripcion_completa
            FROM configuracion c 
            INNER JOIN flujo f ON f.id_flujo = c.id_flujo
            INNER JOIN finalidad fi ON fi.id_finalidad = c.id_finalidad
            INNER JOIN producto p ON p.id_producto = c.id_producto
        `;


        const resultadosString = resultados.map(row => ({
            ...row,
            id_configuracion: row.id_configuracion.toString(),
        }));

        res.json(resultadosString);
    } catch (error) {
        console.error('Error al obtener descripciones:', error);
        res.status(500).json({ error: 'Error al obtener configuraciones' });
    }
};

