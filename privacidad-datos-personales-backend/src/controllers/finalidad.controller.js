import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET - Obtener todas las finalidades
export const getFinalidades = async (req, res) => {
    try {
        const finalidades = await prisma.finalidad.findMany();
        const resultado = finalidades.map(f => ({
            ...f,
            id_finalidad: f.id_finalidad.toString(),
            fecha_registro: f.fecha_registro.toISOString()
        }));
        res.json(resultado);
    } catch (error) {
        console.error("Error al obtener finalidades:", error);
        res.status(500).json({ error: 'Error al obtener finalidades' });
    }
};

// POST - Crear una finalidad
export const createFinalidad = async (req, res) => {
    try {
        const { cabecera, texto_corto, texto_largo, es_obligatorio } = req.body;

        const nuevaFinalidad = await prisma.finalidad.create({
            data: {
                cabecera,
                texto_corto,
                texto_largo,
                es_obligatorio: parseInt(es_obligatorio), // por si viene como string
            },
        });

        res.status(201).json({
            ...nuevaFinalidad,
            id_finalidad: nuevaFinalidad.id_finalidad.toString(),
            fecha_registro: nuevaFinalidad.fecha_registro.toISOString()
        });
    } catch (error) {
        console.error("Error al crear finalidad:", error);
        res.status(500).json({ error: 'Error al crear finalidad' });
    }
};

// PUT - Actualizar una finalidad
export const updateFinalidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { cabecera, texto_corto, texto_largo, es_obligatorio } = req.body;

        const finalidadActualizada = await prisma.finalidad.update({
            where: {
                id_finalidad: BigInt(id),
            },
            data: {
                cabecera,
                texto_corto,
                texto_largo,
                es_obligatorio: parseInt(es_obligatorio),
            },
        });

        res.json({
            ...finalidadActualizada,
            id_finalidad: finalidadActualizada.id_finalidad.toString(),
            fecha_registro: finalidadActualizada.fecha_registro.toISOString()
        });
    } catch (error) {
        console.error("Error al actualizar finalidad:", error);
        res.status(500).json({ error: 'Error al actualizar finalidad' });
    }
};

// DELETE - Eliminar una finalidad
export const deleteFinalidad = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.finalidad.delete({
            where: {
                id_finalidad: BigInt(id),
            },
        });

        res.json({ message: 'Finalidad eliminada correctamente' });
    } catch (error) {
        console.error("Error al eliminar finalidad:", error);
        res.status(500).json({ error: 'Error al eliminar finalidad' });
    }
};
