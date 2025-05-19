import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import productoTableConfig from "../tableConfig/productoTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import productoFormConfig from "../formConfig/productoFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const Producto = () => {
    const [productos, setProductos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedProducto, setSelectedProdcuto] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });


    useEffect(() => {
        const fetchProductos = async () => {
            try {
                setCargando(true)
                const response = await axios.get("http://localhost:5000/api/productos");
                setProductos(response.data);
            } catch (error) {
                console.error("Error al cargar los productos:", error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Hubo un error al cargar los productos',
                });
            }
            finally {
                setCargando(false)
            }
        };

        fetchProductos();
    }, []);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedProducto) {
                // Si estamos editando, hacemos una solicitud PUT
                await axios.put(`http://localhost:5000/api/productos/${selectedProducto.id_producto}`, formData);

                const updateProductos = productos.map((producto) =>
                    producto.id_producto === selectedProducto.id_producto ? { ...producto, ...formData } : producto
                );
                setProductos(updateProductos);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Producto actualizado correctamente',
                });
            } else {

                const response = await axios.post('http://localhost:5000/api/productos', formData);


                setProductos([...productos, { ...formData, id_producto: response.data.id_producto }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Producto creado correctamente',
                });
            }


            setSelectedProdcuto(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar el producto:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar el producto',
            });

        } finally {
            setCargando(false)
        }
    };

    const handleEditar = (usuario) => {
        setSelectedProdcuto(usuario);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`http://localhost:5000/api/productos/${selectedProducto.id_producto}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updateProductos = productos.filter(producto => producto.id_producto !== selectedProducto.id_producto);
                setProductos(updateProductos);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Producto eliminado con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar el producto',
                });
            }
            setSelectedProdcuto(null);
        } catch (error) {
            console.error("Error al eliminar el producto:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar el producto',
            });
        } finally {
            setCargando(false)
        }
    };

    return (
        <div className="p-4 relative">
            {cargando && <Loader />}
            <AlertMessage
                open={alert.open}
                severity={alert.severity}
                message={alert.message}
                onClose={() => setAlert({ ...alert, open: false })}
            />
            {showForm ? (
                <DynamicForm
                    fields={productoFormConfig}
                    selectedItem={selectedProducto}
                    initialValues={selectedProducto || {}}
                    onSubmit={handleCreate}
                    title={"Producto"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedProdcuto(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Productos"
                    columns={productoTableConfig}
                    data={productos}
                    onNew={() => {
                        setSelectedProdcuto(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Producto;
