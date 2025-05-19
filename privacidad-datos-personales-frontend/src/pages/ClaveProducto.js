import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import claveProductoTableConfig from "../tableConfig/claveProductoTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import claveProductoFormConfig from "../formConfig/claveProductoFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const ClaveProducto = () => {
    const [claveProducto, setClaveProducto] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedCP, setSelectedCP] = useState(null);
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(false);

    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const fetchProductos = async () => {
        try {
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
    };
    useEffect(() => {
        fetchProductos();
    }, []);


    useEffect(() => {
        const fetchCP = async () => {
            try {
                setCargando(true)
                const response = await axios.get("http://localhost:5000/api/claves-producto");
                setClaveProducto(response.data);
            } catch (error) {
                console.error("Error al cargar las claves producto:", error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Hubo un error al cargar las Claves Producto',
                });
            } finally {
                setCargando(false)
            }
        };

        fetchCP();
    }, []);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedCP) {

                await axios.put(`http://localhost:5000/api/claves-producto/${selectedCP.id_clave_producto}`, formData);

                const updateCP = claveProducto.map((claveP) =>
                    claveP.id_clave_producto === selectedCP.id_clave_producto ? { ...claveP, ...formData } : claveP
                );
                setClaveProducto(updateCP);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Clave Producto actualizado correctamente',
                });
            } else {

                const response = await axios.post('http://localhost:5000/api/claves-producto', formData);


                setClaveProducto([...claveProducto, { ...formData, id_clave_producto: response.data.id_clave_producto }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Clave Producto creada correctamente',
                });
            }


            setSelectedCP(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar la Clave Producto:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar la Clave Producto',
            });

        } finally {
            setCargando(false)
        }
    };

    const handleEditar = (cp) => {
        setSelectedCP(cp);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`http://localhost:5000/api/claves-producto/${selectedCP.id_clave_producto}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updateCP = claveProducto.filter(cp => cp.id_clave_producto !== selectedCP.id_clave_producto);
                setClaveProducto(updateCP);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Clave Producto eliminada con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar la Clave Producto',
                });
            }
            setSelectedCP(null);
        } catch (error) {
            console.error("Error al eliminar Clave Producto:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar la Clave Producto',
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
                    fields={claveProductoFormConfig(productos)}
                    selectedItem={selectedCP}
                    initialValues={selectedCP || {}}
                    onSubmit={handleCreate}
                    title={"Clave Producto"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedCP(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Claves Producto"
                    columns={claveProductoTableConfig}
                    data={claveProducto}
                    onNew={() => {
                        setSelectedCP(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default ClaveProducto;
