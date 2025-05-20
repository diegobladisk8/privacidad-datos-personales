const configuracionFromConfig = (flujos, finalidades, productos) => [
    {
        name: "id_flujo",
        label: "id Flujo",
        required: true,
        type: "autocomplete",
        options: flujos,
        getOptionLabel: (option) => `${option.descripcion}`,
        getOptionValue: (option) => option.id_flujo,
    },
    {
        name: "id_finalidad",
        label: "id Finalidad",
        required: true,
        type: "autocomplete",
        options: finalidades,
        getOptionLabel: (option) => `${option.cabecera}`,
        getOptionValue: (option) => option.id_finalidad,
    },
    {
        name: "id_producto",
        label: "Producto",
        required: true,
        type: "autocomplete",
        options: productos,
        getOptionLabel: (option) => `${option.descripcion}`,
        getOptionValue: (option) => option.id_producto,
    },
    {
        name: "activo",
        label: "¿Activo?",
        type: "checkbox",
    },
    {
        name: "fecha_registro",
        label: "Fecha de Registro",
        type: "date",
        required: true,
    },
    {
        name: "fecha_desactivacion",
        label: "Fecha de Desactivacion",
        type: "date",
        required: true,
    },
    {
        name: "fecha_ultimo_cambio",
        label: "Fecha Ultimo Cambio",
        type: "date",
        required: true,
    },
    { name: "dias_duracion_finalidad", label: "Dias duracion Finalidad", type: "number", required: true, },

];


export default configuracionFromConfig;
