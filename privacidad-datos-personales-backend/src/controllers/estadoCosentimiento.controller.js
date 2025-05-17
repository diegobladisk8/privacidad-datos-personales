
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Obtener todos
export const getEstadosConsentimiento = async (req, res) => {
    try {
        const estados = await prisma.estado_consentimiento.findMany();

        // Convertir BigInt a string para evitar errores con JSON
        const estadosConvertidos = estados.map((estado) => ({
            ...estado,
            id_estado_consentimiento: estado.id_estado_consentimiento.toString(),
        }));

        res.json(estadosConvertidos);
    } catch (error) {
        console.error('Error al obtener estados:', error);
        res.status(500).json({ error: 'Error al obtener estados' });
    }
};

// Crear nuevo
export const createEstadoConsentimiento = async (req, res) => {
    try {
        const { descripcion } = req.body;

        const nuevoEstado = await prisma.estado_consentimiento.create({
            data: { descripcion },
        });

        res.status(201).json({
            ...nuevoEstado,
            id_estado_consentimiento: nuevoEstado.id_estado_consentimiento.toString(),
        });
    } catch (error) {
        console.error('Error al crear estado:', error);
        res.status(500).json({ error: 'Error al crear estado' });
    }
};

// Actualizar
export const updateEstadoConsentimiento = async (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;

    try {
        const estadoActualizado = await prisma.estado_consentimiento.update({
            where: {
                id_estado_consentimiento: BigInt(id),
            },
            data: { descripcion },
        });

        res.json({
            ...estadoActualizado,
            id_estado_consentimiento: estadoActualizado.id_estado_consentimiento.toString(),
        });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};

// Eliminar
export const deleteEstadoConsentimiento = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.estado_consentimiento.delete({
            where: {
                id_estado_consentimiento: BigInt(id),
            },
        });

        res.json({ message: 'Estado eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar estado:', error);
        res.status(500).json({ error: 'Error al eliminar estado' });
    }
};
