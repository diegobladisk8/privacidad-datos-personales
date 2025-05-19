const consentimientoFromConfig = (consentimientos, flujos) => [
    {
        name: "id_consentimiento",
        label: "id Consentimiento",
        required: true,
        type: "autocomplete",
        options: consentimientos,
        getOptionLabel: (option) => `${option.id_consentimiento}`,
        getOptionValue: (option) => option.id_consentimiento,
    },
    {
        name: "id_flujo",
        label: "id Flujo",
        required: true,
        type: "autocomplete",
        options: flujos,
        getOptionLabel: (option) => `${option.id_flujo}`,
        getOptionValue: (option) => option.id_flujo,
    },

    { name: "usuario", label: "Usuario", type: "textarea", required: true, rows: 4, multiline: true },


    {
        name: "fecha_revocacion",
        label: "Fecha de Revocacion",
        type: "date",
        required: true,
    },

    { name: "descripcion", label: "Descripcion", type: "textarea", required: true, rows: 4, multiline: true },




];


export default consentimientoFromConfig;
