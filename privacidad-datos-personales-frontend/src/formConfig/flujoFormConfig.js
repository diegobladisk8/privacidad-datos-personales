const flujoFormConfig = (canales) => [
    {
        name: "descripcion",
        label: "Descripcion",
        type: "textarea",
        required: true,
        rows: 4,
        multiline: true,
    },
    {
        name: "id_canal",
        label: "Canal",
        required: true,
        type: "autocomplete",
        options: canales,
        getOptionLabel: (option) => `${option.descripcion}`,
        getOptionValue: (option) => option.id_canal,
    },
];


export default flujoFormConfig;
