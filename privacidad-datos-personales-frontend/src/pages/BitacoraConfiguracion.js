import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import bitacoraConfiguracionTableConfig from "../tableConfig/bitacoraConfiguracionTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import bitacoraConfiguracionFormConfig from "../formConfig/bitacoraConfiguracionFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const BitacoraConfiguracion = () => {
    const [bitacoras, setBitacoras] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedBitacora, setSelectedBitacora] = useState(null);
    const [configuracion, setConfiguracion] = useState([])
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const fetchConfiguracion = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/configuraciones");
            setConfiguracion(response.data);
        } catch (error) {
            console.error("Error al cargar las configuraciones:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar las configuraciones',
            });
        }
    };
    useEffect(() => {
        fetchConfiguracion();
    }, []);


    useEffect(() => {
        setCargando(true)
        const fetchBitacora = async () => {

            try {
                const response = await axios.get("http://localhost:5000/api/bitacoras-configuracion");
                setBitacoras(response.data);
            } catch (error) {
                console.error("Error al cargar las bitacoras configuracion:", error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Hubo un error al cargar las bitacoras configuracion',
                });
            } finally {
                setCargando(false)
            }
        };

        fetchBitacora();
    }, []);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedBitacora) {
                await axios.put(`http://localhost:5000/api/bitacoras-configuracion/${selectedBitacora.id_bitacora_configuracion}`, formData);
                const updateBitacora = bitacoras.map((bitacora) =>
                    bitacora.id_flujo === selectedBitacora.id_bitacora_configuracion ? { ...bitacora, ...formData } : bitacora
                );
                setBitacoras(updateBitacora);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Bitacora Configuración actualizada correctamente',
                });
            } else {

                const response = await axios.post('http://localhost:5000/api/bitacoras-configuracion', formData);


                setBitacoras([...bitacoras, { ...formData, id_bitacora_configuracion: response.data.id_bitacora_configuracion }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Bitacora Configuración creada correctamente',
                });
            }


            setSelectedBitacora(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar la Bitacora Configuración:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar la Bitacora Configuración',
            });

        }
        finally {
            setCargando(false)
        }
    };

    const handleEditar = (bitacora) => {
        setSelectedBitacora(bitacora);
        setShowForm(true);
    };

    const handleDelete = async () => {
        setCargando(true)
        try {
            const response = await fetch(`http://localhost:5000/api/bitacoras-configuracion/${selectedBitacora.id_bitacora_configuracion}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updateBitacora = bitacoras.filter(bitacora => bitacora.id_bitacora_configuracion !== selectedBitacora.id_bitacora_configuracion);
                setBitacoras(updateBitacora);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Bitacora Configuración eliminada con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar la Bitacora Configuración',
                });
            }
            setSelectedBitacora(null);
        } catch (error) {
            console.error("Error al eliminar Bitacora Configuración:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar la Bitacora Configuración',
            });
        }
        finally {
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
                    fields={bitacoraConfiguracionFormConfig(configuracion)}
                    selectedItem={selectedBitacora}
                    initialValues={selectedBitacora || {}}
                    onSubmit={handleCreate}
                    title={"Bitacora Configuracion"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedBitacora(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Bitacoras Configuracion"
                    columns={bitacoraConfiguracionTableConfig}
                    data={bitacoras}
                    onNew={() => {
                        setSelectedBitacora(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default BitacoraConfiguracion;
