import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllRevocaciones = async (req, res) => {
    try {
        const revocaciones = await prisma.revocacion.findMany({
            include: {
                consentimiento: true,
                flujo: true,
            },
        });
        res.json(revocaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRevocacionById = async (req, res) => {
    const { id } = req.params;
    try {
        const revocacion = await prisma.revocacion.findUnique({
            where: { id_revocacion: BigInt(id) },
            include: {
                consentimiento: true,
                flujo: true,
            },
        });

        if (!revocacion) {
            return res.status(404).json({ message: "Revocación no encontrada" });
        }

        res.json(revocacion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createRevocacion = async (req, res) => {
    const {
        id_consentimiento,
        id_flujo,
        usuario,
        descripcion,
        fecha_revocacion,
    } = req.body;

    try {
        const newRevocacion = await prisma.revocacion.create({
            data: {
                id_consentimiento: BigInt(id_consentimiento),
                id_flujo: BigInt(id_flujo),
                usuario,
                descripcion,
                fecha_revocacion: fecha_revocacion ? new Date(fecha_revocacion) : undefined,
            },
        });

        res.status(201).json(newRevocacion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateRevocacion = async (req, res) => {
    const { id } = req.params;
    const {
        id_consentimiento,
        id_flujo,
        usuario,
        descripcion,
        fecha_revocacion,
    } = req.body;

    try {
        const updatedRevocacion = await prisma.revocacion.update({
            where: { id_revocacion: BigInt(id) },
            data: {
                id_consentimiento: BigInt(id_consentimiento),
                id_flujo: BigInt(id_flujo),
                usuario,
                descripcion,
                fecha_revocacion: fecha_revocacion ? new Date(fecha_revocacion) : undefined,
            },
        });

        res.json(updatedRevocacion);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteRevocacion = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.revocacion.delete({
            where: { id_revocacion: BigInt(id) },
        });
        res.json({ message: "Revocación eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
