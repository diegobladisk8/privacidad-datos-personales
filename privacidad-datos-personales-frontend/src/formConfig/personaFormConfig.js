const personaFormConfig = [

    { name: "nombre", label: "Nombre", type: "text", required: false, },
    { name: "apellido", label: "Apellido", type: "text", required: true, },
    { name: "rut_persona", label: "RUT", type: "text", required: true, },
    { name: "dv_persona", label: "DV Persona", type: "text", required: true, },
    { name: "rut_tercero", label: "RUT Tercero", type: "text", required: true, },
    { name: "dv_tercero", label: "DV Tercero", type: "text", required: true, },

    {
        name: "es_ftu",
        label: "¿Es FTU?",
        type: "checkbox",
    },


    {
        name: "fecha_registro",
        label: "Fecha de Registro",
        type: "date",
        required: true,
    },
    {
        name: "fecha_actualizacion_registro",
        label: "Fecha de Actualización",
        type: "date",
        required: true,
    },

];

export default personaFormConfig;
