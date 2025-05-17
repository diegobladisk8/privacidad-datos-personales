import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const getAllBitacoras = async (req, res) => {
    try {
        const bitacoras = await prisma.bitacora_configuracion.findMany({
            include: { configuracion: true },
        });

        // Serializador general
        const serializar = (obj) => {
            if (Array.isArray(obj)) {
                return obj.map(serializar);
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
                        newObj[key] = serializar(value);
                    } else {
                        newObj[key] = value;
                    }
                }
                return newObj;
            }
            return obj;
        };

        const resultado = serializar(bitacoras);

        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener bitácoras:', error);
        res.status(500).json({ error: 'Error al obtener bitácoras' });
    }
};


export const getBitacoraById = async (req, res) => {
    const { id } = req.params;
    try {
        const bitacora = await prisma.bitacora_configuracion.findUnique({
            where: { id_bitacora_configuracion: BigInt(id) },
            include: { configuracion: true },
        });
        if (!bitacora) return res.status(404).json({ message: "Bitacora no encontrada" });
        res.json(bitacora);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createBitacora = async (req, res) => {
    const { id_configuracion, flujo, finalidad, descripcion, fecha_desactivacion } = req.body;
    try {
        const newBitacora = await prisma.bitacora_configuracion.create({
            data: {
                id_configuracion: BigInt(id_configuracion),
                flujo,
                finalidad,
                descripcion,
                fecha_desactivacion: fecha_desactivacion ? new Date(fecha_desactivacion) : null,
            },
        });
        res.status(201).json(newBitacora);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateBitacora = async (req, res) => {
    const { id } = req.params;
    const { flujo, finalidad, descripcion, fecha_desactivacion } = req.body;
    try {
        const updatedBitacora = await prisma.bitacora_configuracion.update({
            where: { id_bitacora_configuracion: BigInt(id) },
            data: {
                flujo,
                finalidad,
                descripcion,
                fecha_desactivacion: fecha_desactivacion ? new Date(fecha_desactivacion) : null,
            },
        });
        res.json(updatedBitacora);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteBitacora = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.bitacora_configuracion.delete({
            where: { id_bitacora_configuracion: BigInt(id) },
        });
        res.json({ message: "Bitacora eliminada" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
