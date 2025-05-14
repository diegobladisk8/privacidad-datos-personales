import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPersonas = async (req, res) => {
    try {
        const personas = await prisma.persona.findMany();


        const personasConBigIntComoString = personas.map(persona => {
            return {
                ...persona,
                id_persona: persona.id_persona.toString(),
                rut_persona: persona.rut_persona.toString(),
                rut_tercero: persona.rut_tercero ? persona.rut_tercero.toString() : null,
            };
        });

        res.status(200).json(personasConBigIntComoString);
    } catch (error) {
        console.error('Error al obtener las personas:', error);
        res.status(500).json({ error: 'Error al obtener las personas' });
    }
};


// Crear una nueva persona
export const createPersona = async (req, res) => {
    try {
        const { nombre, apellido, rut_persona, dv_persona, rut_tercero, dv_tercero, es_ftu } = req.body;

        // Convertir los valores a enteros
        const newPersona = await prisma.persona.create({
            data: {
                nombre,
                apellido,
                rut_persona: parseInt(rut_persona),
                dv_persona,
                rut_tercero: rut_tercero ? parseInt(rut_tercero) : null,
                dv_tercero,
                es_ftu: es_ftu ? 1 : 0,
            }
        });

        // Convertir los BigInt a String antes de enviarlos en la respuesta
        const personaResponse = {
            ...newPersona,
            id_persona: newPersona.id_persona.toString(),
            rut_persona: newPersona.rut_persona.toString(),
            rut_tercero: newPersona.rut_tercero ? newPersona.rut_tercero.toString() : null,
        };

        res.status(201).json(personaResponse);
    } catch (error) {
        console.error('Error al crear la persona:', error);
        res.status(500).json({ error: 'Error al crear la persona' });
    }
};


// Actualizar una persona
export const updatePersona = async (req, res) => {

    const id = Number(req.params.id);
    const { nombre, apellido, rut_persona, dv_persona, rut_tercero, dv_tercero, es_ftu } = req.body;

    try {
        const esFtuInt = es_ftu === 'true' || es_ftu === true ? 1 : 0;

        const personaExistente = await prisma.persona.findUnique({
            where: { id_persona: id },
        });

        if (!personaExistente) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }

        const personaActualizada = await prisma.persona.update({
            where: { id_persona: id },
            data: {
                nombre,
                apellido,
                rut_persona: Number(rut_persona),
                dv_persona,
                rut_tercero: Number(rut_tercero),
                dv_tercero,
                es_ftu: esFtuInt,
                fecha_actualizacion_registro: new Date(),
            },
        });

        // Convertir los BigInt a String para la respuesta
        personaActualizada.id_persona = personaActualizada.id_persona.toString();
        personaActualizada.rut_persona = personaActualizada.rut_persona.toString();
        personaActualizada.rut_tercero = personaActualizada.rut_tercero?.toString(); // Asegúrate de que `rut_tercero` no sea `null` o `undefined`

        res.status(200).json(personaActualizada);

    } catch (error) {
        console.error('Error al actualizar la persona:', error);
        res.status(500).json({ error: 'Error al actualizar la persona' });
    }
};


// Eliminar una persona
export const deletePersona = async (req, res) => {
    const { id } = req.params;
    console.log("Intentando ekliniar persona:", req.params.id);
    try {
        const personaExistente = await prisma.persona.findUnique({
            where: { id_persona: id },
        });

        if (!personaExistente) {
            return res.status(404).json({ error: 'Persona no encontrada' });
        }

        await prisma.persona.delete({
            where: { id_persona: BigInt(id) },
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error al eliminar la persona:', error);
        res.status(500).json({ error: 'Error al eliminar la persona' });
    }
};
