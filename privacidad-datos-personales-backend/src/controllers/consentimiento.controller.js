import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const getAllConsentimientos = async (req, res) => {
    try {
        const consentimientos = await prisma.consentimiento.findMany({
            include: {
                configuracion: true,
                estado_consentimiento: true,
                persona: true,
                revocacion: true,
            },
        });
        res.json(consentimientos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getConsentimientoById = async (req, res) => {
    const { id } = req.params;
    try {
        const consentimiento = await prisma.consentimiento.findUnique({
            where: { id_consentimiento: BigInt(id) },
            include: {
                configuracion: true,
                estado_consentimiento: true,
                persona: true,
                revocacion: true,
            },
        });
        if (!consentimiento) return res.status(404).json({ message: "Consentimiento no encontrado" });
        res.json(consentimiento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createConsentimiento = async (req, res) => {
    const {
        es_activo,
        id_estado_consentimiento,
        id_configuracion,
        id_persona,
        descripcion,
        fecha_registro_externo,
        fecha_actualizacion_registro,
    } = req.body;

    try {
        const newConsentimiento = await prisma.consentimiento.create({
            data: {
                es_activo,
                id_estado_consentimiento: BigInt(id_estado_consentimiento),
                id_configuracion: id_configuracion ? BigInt(id_configuracion) : null,
                id_persona: BigInt(id_persona),
                descripcion,
                fecha_registro_externo: fecha_registro_externo ? new Date(fecha_registro_externo) : null,
                fecha_actualizacion_registro: fecha_actualizacion_registro ? new Date(fecha_actualizacion_registro) : null,
            },
        });
        res.status(201).json(newConsentimiento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateConsentimiento = async (req, res) => {
    const { id } = req.params;
    const {
        es_activo,
        id_estado_consentimiento,
        id_configuracion,
        id_persona,
        descripcion,
        fecha_registro_externo,
        fecha_actualizacion_registro,
    } = req.body;

    try {
        const updatedConsentimiento = await prisma.consentimiento.update({
            where: { id_consentimiento: BigInt(id) },
            data: {
                es_activo,
                id_estado_consentimiento: BigInt(id_estado_consentimiento),
                id_configuracion: id_configuracion ? BigInt(id_configuracion) : null,
                id_persona: BigInt(id_persona),
                descripcion,
                fecha_registro_externo: fecha_registro_externo ? new Date(fecha_registro_externo) : null,
                fecha_actualizacion_registro: fecha_actualizacion_registro ? new Date(fecha_actualizacion_registro) : null,
            },
        });
        res.json(updatedConsentimiento);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteConsentimiento = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.consentimiento.delete({
            where: { id_consentimiento: BigInt(id) },
        });
        res.json({ message: "Consentimiento eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
