import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import configuracionTableConfig from "../tableConfig/configuracionTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import configuracionFormConfig from "../formConfig/configuracionFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const apiUrl = process.env.REACT_APP_API_URL;


const Configuracion = () => {
    const [configuraciones, setConfiguraciones] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedConfiguracion, setSelectedConfiguracion] = useState(null);
    const [flujos, setFlujos] = useState([])
    const [finalidades, setFinalidades] = useState([])
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const fetchFlujos = async () => {
        try {

            const response = await axios.get(`${apiUrl}/api/flujos`);
            setFlujos(response.data);
        } catch (error) {
            console.error("Error al cargar los flijos:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar los flujos',
            });
        }
    };
    const fetchFinalidades = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/finalidades`);
            setFinalidades(response.data);
        } catch (error) {
            console.error("Error al cargar las finalidades:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar las finalidades',
            });
        }
    };
    const fetchProductos = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/productos`);
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
        fetchFlujos();
        fetchFinalidades();
        fetchProductos();
    }, []);


    useEffect(() => {
        const fetchConfiguraciones = async () => {
            setCargando(true)
            try {
                const response = await axios.get(`${apiUrl}/api/configuraciones`);
                setConfiguraciones(response.data);
            } catch (error) {
                console.error("Error al cargar las configuraciones:", error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Hubo un error al cargar las configuraciones',
                });
            }
            finally {
                setCargando(false)
            }
        };

        fetchConfiguraciones();
    }, [showForm]);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedConfiguracion) {
                await axios.put(`${apiUrl}/api/configuraciones/${selectedConfiguracion.id_configuracion}`, formData);
                const updateConfiguraciones = configuraciones.map((confi) =>
                    confi.id_configuracion === selectedConfiguracion.id_configuracion ? { ...confi, ...formData } : confi
                );
                setConfiguraciones(updateConfiguraciones);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Configuracion actualizada correctamente',
                });
            } else {

                const response = await axios.post(`${apiUrl}/api/configuraciones`, formData);


                setConfiguraciones([...configuraciones, { ...formData, id_configuracion: response.data.id_configuracion }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Configuracion creada correctamente',
                });
            }


            setSelectedConfiguracion(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar la configuración:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar la configuración',
            });

        } finally {
            setCargando(false)
        }
    };

    const handleEditar = (confi) => {
        setSelectedConfiguracion(confi);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`${apiUrl}/api/configuraciones/${selectedConfiguracion.id_configuracion}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updateConfiguracion = configuraciones.filter(confi => confi.id_configuracion !== selectedConfiguracion.id_configuracion);
                setConfiguraciones(updateConfiguracion);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Configuración eliminada con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar la configuración',
                });
            }
            setSelectedConfiguracion(null);
        } catch (error) {
            console.error("Error al eliminar la configuración:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar la configuración',
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
                    fields={configuracionFormConfig(flujos, finalidades, productos)}
                    selectedItem={selectedConfiguracion}
                    initialValues={selectedConfiguracion || {}}
                    onSubmit={handleCreate}
                    title={"Configuracion"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedConfiguracion(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Configuraciones"
                    columns={configuracionTableConfig}
                    data={configuraciones}
                    onNew={() => {
                        setSelectedConfiguracion(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Configuracion;
