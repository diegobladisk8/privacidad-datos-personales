const claveProductoFormConfig = (productos) => [
    {
        name: "descripcion",
        label: "Descripcion",
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
        getOptionLabel: (option) => `${option.id_producto}`,
        getOptionValue: (option) => option.id_producto,
    },
];


export default claveProductoFormConfig;
