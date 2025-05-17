import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Obtener todos los canales
export const getCanales = async (req, res) => {
    try {
        const canales = await prisma.canal.findMany();
        const canalesConBigIntComoString = canales.map(canal => {
            return {
                ...canal,
                id_canal: canal.id_canal.toString(),
            };
        });
        res.status(200).json(canalesConBigIntComoString);
    } catch (error) {
        console.error("Error al obtener los canales:", error);
        res.status(500).json({ error: 'Error al obtener los canales' });
    }
};

// Crear un nuevo canal
export const createCanal = async (req, res) => {
    try {
        const { descripcion } = req.body;
        console.log(descripcion)
        const nuevoCanal = await prisma.canal.create({
            data: {
                descripcion,
            },
        });
        const canalConvertido = {
            ...nuevoCanal,
            id_canal: nuevoCanal.id_canal.toString(),
        };
        res.status(201).json(canalConvertido);
    } catch (error) {
        console.error("Error al crear canal:", error);
        res.status(500).json({ error: 'Error al crear canal' });
    }
};

// Obtener un canal por ID
export const getCanalById = async (req, res) => {
    try {
        const { id } = req.params;
        const canal = await prisma.canal.findUnique({
            where: {
                id_canal: BigInt(id),
            },
        });

        if (!canal) {
            return res.status(404).json({ error: 'Canal no encontrado' });
        }

        res.json(canal);
    } catch (error) {
        console.error("Error al obtener canal:", error);
        res.status(500).json({ error: 'Error al obtener canal' });
    }
};

// Actualizar canal
export const updateCanal = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;

        const canalActualizado = await prisma.canal.update({
            where: {
                id_canal: BigInt(id),
            },
            data: {
                descripcion,
            },
        });

        res.json(canalActualizado);
    } catch (error) {
        console.error("Error al actualizar canal:", error);
        res.status(500).json({ error: 'Error al actualizar canal' });
    }
};

// Eliminar canal
export const deleteCanal = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.canal.delete({
            where: {
                id_canal: BigInt(id),
            },
        });

        res.json({ message: 'Canal eliminado con éxito' });
    } catch (error) {
        console.error("Error al eliminar canal:", error);
        res.status(500).json({ error: 'Error al eliminar canal' });
    }
};
