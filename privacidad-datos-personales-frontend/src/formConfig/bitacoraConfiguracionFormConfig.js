const bitacoraConfiguracionFormConfig = (configuraciones, isLoadingConfiguraciones) => [

    {
        name: "id_configuracion",
        label: "id Configuracion",
        required: true,
        type: "autocomplete",
        options: configuraciones,
        getOptionLabel: (option) => `${option.id_configuracion}`,
        getOptionValue: (option) => option.id_configuracion,
        loading: isLoadingConfiguraciones
    },
    { name: "flujo", label: "Flujo", type: "textarea", required: true, rows: 4, multiline: true, },
    { name: "finalidad", label: "Finalidad", type: "textarea", required: true, rows: 4, multiline: true },
    { name: "descripcion", label: "Descripcion", type: "textarea", required: true, rows: 4, multiline: true },

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

];

export default bitacoraConfiguracionFormConfig;
