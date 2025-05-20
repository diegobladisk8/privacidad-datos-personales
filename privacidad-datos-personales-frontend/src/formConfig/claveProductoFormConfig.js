const claveProductoFormConfig = (productos) => [

    {
        name: "clave",
        label: "Clave",
        type: "textarea",
        required: true,
        rows: 4,
        multiline: true,
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
];


export default claveProductoFormConfig;
