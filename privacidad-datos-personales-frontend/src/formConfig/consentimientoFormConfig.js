const consentimientoFromConfig = (estadoConsentimientos, configuraciones, personas) => [
    {
        name: "fecha_registro_consentimiento",
        label: "Fecha de Registro Consentimiento",
        type: "date",
        required: true,
    },
    {
        name: "es_activo",
        label: "¿Activo?",
        type: "checkbox",
    },
    {
        name: "id_estado_consentimiento",
        label: "id Estado Consentimiento",
        required: true,
        type: "autocomplete",
        options: estadoConsentimientos,
        getOptionLabel: (option) => `${option.id_estado_consentimiento}`,
        getOptionValue: (option) => option.id_estado_consentimiento,
    },
    {
        name: "id_configuracion",
        label: "id Configuración",
        required: true,
        type: "autocomplete",
        options: configuraciones,
        getOptionLabel: (option) => `${option.id_configuracion}`,
        getOptionValue: (option) => option.id_configuracion,
    },
    {
        name: "id_persona",
        label: "id Persona",
        required: true,
        type: "autocomplete",
        options: personas,
        getOptionLabel: (option) => `${option.id_persona}`,
        getOptionValue: (option) => option.id_persona,
    },
    { name: "descripcion", label: "Descripcion", type: "textarea", required: true, rows: 4, multiline: true },

    {
        name: "fecha_registro_externo",
        label: "Fecha de Registro Externo",
        type: "date",
        required: true,
    },
    {
        name: "fecha_actualizacion_registro",
        label: "Fecha Actualizacion Registro",
        type: "date",
        required: true,
    },


];


export default consentimientoFromConfig;
