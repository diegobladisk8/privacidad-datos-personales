const finalidadFormConfig = [

    { name: "cabecera", label: "Cabecera", type: "text", required: false, },
    { name: "texto_corto", label: "Texto Corto", type: "text", required: true, },
    { name: "texto_largo", label: "Texto largo", type: "textarea", required: true, rows: 4, multiline: true },

    {
        name: "es_obligatorio",
        label: "¿Obligatorio?",
        type: "checkbox",
    },


    {
        name: "fecha_registro",
        label: "Fecha de Registro",
        type: "date",
        required: true,
    },
];

export default finalidadFormConfig;
