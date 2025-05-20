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
// GET - Obtener todas las claves de productos
export const getClavesProducto = async (req, res) => {
    try {
        const claves = await prisma.clave_producto.findMany({
            include: {
                producto: true,
            },
        });

        const resultado = serializarBigIntYFechas(claves)

        res.json(resultado);
    } catch (error) {
        console.error("Error al obtener claves de producto:", error);
        res.status(500).json({ error: 'Error al obtener claves de producto' });
    }
};

// POST - Crear una clave de producto
export const createClaveProducto = async (req, res) => {
    try {
        const { clave, id_producto } = req.body;

        const nuevaClave = await prisma.clave_producto.create({
            data: {
                clave,
                id_producto: BigInt(id_producto),
            },
        });

        res.status(201).json({
            ...nuevaClave,
            id_clave_producto: nuevaClave.id_clave_producto.toString(),
            id_producto: nuevaClave.id_producto.toString(),
        });
    } catch (error) {
        console.error("Error al crear clave de producto:", error);
        res.status(500).json({ error: 'Error al crear clave de producto' });
    }
};

// PUT - Actualizar una clave de producto
export const updateClaveProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { clave, id_producto } = req.body;

        const claveActualizada = await prisma.clave_producto.update({
            where: {
                id_clave_producto: BigInt(id),
            },
            data: {
                clave,
                id_producto: BigInt(id_producto),
            },
        });

        res.json({
            ...claveActualizada,
            id_clave_producto: claveActualizada.id_clave_producto.toString(),
            id_producto: claveActualizada.id_producto.toString(),
        });
    } catch (error) {
        console.error("Error al actualizar clave de producto:", error);
        res.status(500).json({ error: 'Error al actualizar clave de producto' });
    }
};

// DELETE - Eliminar una clave de producto
export const deleteClaveProducto = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.clave_producto.delete({
            where: {
                id_clave_producto: BigInt(id),
            },
        });

        res.json({ message: 'Clave de producto eliminada correctamente' });
    } catch (error) {
        console.error("Error al eliminar clave de producto:", error);
        res.status(500).json({ error: 'Error al eliminar clave de producto' });
    }
};
