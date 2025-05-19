// ejemplo de json para mostrar en tabla
const users = Array.from({ length: 53 }).map((_, i) => ({
    id: i + 1,
    name: `Usuario ${i + 1}`,
    email: `usuario${i + 1}@ejemplo.com`,
}));

export default users;
