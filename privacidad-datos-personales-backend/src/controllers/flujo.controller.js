import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Obtener todos los flujos
export const getFlujos = async (req, res) => {
    try {
        const flujos = await prisma.flujo.findMany({
            include: {
                canal: true, // Incluye los datos del canal
            },
        });

        const flujosConvertidos = flujos.map((f) => ({
            ...f,
            id_flujo: f.id_flujo.toString(),
            id_canal: f.id_canal.toString(),
            canal: {
                ...f.canal,
                id_canal: f.canal.id_canal.toString(), // Aseguramos que el id del canal también sea string
            },
        }));

        res.json(flujosConvertidos);
    } catch (error) {
        console.error('Error al obtener flujos:', error);
        res.status(500).json({ error: 'Error al obtener flujos' });
    }
};

// Crear nuevo flujo
export const createFlujo = async (req, res) => {
    try {
        const { descripcion, id_canal } = req.body;

        const nuevoFlujo = await prisma.flujo.create({
            data: {
                descripcion,
                id_canal: BigInt(id_canal),
            },
        });

        res.status(201).json({
            ...nuevoFlujo,
            id_flujo: nuevoFlujo.id_flujo.toString(),
            id_canal: nuevoFlujo.id_canal.toString(),
        });
    } catch (error) {
        console.error('Error al crear flujo:', error);
        res.status(500).json({ error: 'Error al crear flujo' });
    }
};


export const updateFlujo = async (req, res) => {
    const { id } = req.params;
    const { descripcion, id_canal } = req.body;

    try {
        const flujoActualizado = await prisma.flujo.update({
            where: {
                id_flujo: BigInt(id),
            },
            data: {
                descripcion,
                id_canal: BigInt(id_canal),
            },
        });

        res.json({
            ...flujoActualizado,
            id_flujo: flujoActualizado.id_flujo.toString(),
            id_canal: flujoActualizado.id_canal.toString(),
        });
    } catch (error) {
        console.error('Error al actualizar flujo:', error);
        res.status(500).json({ error: 'Error al actualizar flujo' });
    }
};

// Eliminar flujo
export const deleteFlujo = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.flujo.delete({
            where: {
                id_flujo: BigInt(id),
            },
        });

        res.json({ message: 'Flujo eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar flujo:', error);
        res.status(500).json({ error: 'Error al eliminar flujo' });
    }
};
