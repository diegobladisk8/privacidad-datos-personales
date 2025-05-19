import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import AlertMessage from '../components/AlertMessage';
import estadoConsentimientoTableConfig from '../tableConfig/estadoConsentimientoTableConfig'
import estadoConsentimientoFormConfig from "../formConfig/estadoConsentimientoFormConfig";
import Loader from "../components/Loader";

const EstadoConsentimiento = () => {
    const [estadoConsentimiento, setEstadoConsentimiento] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedEC, setSelectedEC] = useState(null)
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });


    useEffect(() => {
        const fetchEstadoConsentimientos = async () => {
            try {
                setCargando(true)
                const response = await axios.get("http://localhost:5000/api/estado-consentimientos");
                setEstadoConsentimiento(response.data);
            } catch (error) {
                console.error("Error al cargar los estados de Consentimiento:", error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Hubo un error al cargar estados de Consentimiento',
                });
            }
            finally {
                setCargando(false)
            }
        };

        fetchEstadoConsentimientos();
    }, []);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedEC) {

                await axios.put(`http://localhost:5000/api/estado-consentimientos/${selectedEC.id_estado_consentimiento}`, formData);

                const updateEstadoC = estadoConsentimiento.map((estadoC) =>
                    estadoC.id_persona === selectedEC.id_estado_consentimiento ? { ...estadoConsentimiento, ...formData } : estadoConsentimiento
                );
                setEstadoConsentimiento(updateEstadoC);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Canal actualizado correctamente',
                });
            } else {
                console.log(formData)
                const response = await axios.post('http://localhost:5000/api/estado-consentimientos', formData);


                setEstadoConsentimiento([...estadoConsentimiento, { ...formData, id_estado_consentimiento: response.data.id_estado_consentimiento }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Estado Consentimiento creado correctamente',
                });
            }


            setSelectedEC(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar el Estado Consentimiento:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar el Estado Consentimiento',
            });

        }
        finally {
            setCargando(false)
        }
    };

    const handleEditar = (usuario) => {
        setSelectedEC(usuario);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`http://localhost:5000/api/estado-consentimientos/${selectedEC.id_estado_consentimiento}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Filtrar los usuarios eliminados de la lista
                const updateEstadoC = estadoConsentimiento.filter(estadoC => estadoC.id_estado_consentimiento !== selectedEC.id_estado_consentimiento);
                setEstadoConsentimiento(updateEstadoC);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Estado Consentimiento eliminado con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar el Estado Consentimiento',
                });
            }
            setSelectedEC(null);
        } catch (error) {
            console.error("Error al eliminar Estado Consentimiento:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar Estado Consentimiento',
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
                    fields={estadoConsentimientoFormConfig}
                    selectedItem={selectedEC}
                    initialValues={selectedEC || {}}
                    onSubmit={handleCreate}
                    title={"Estado Consentimiento"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedEC(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Estado Consentimiento"
                    columns={estadoConsentimientoTableConfig}
                    data={estadoConsentimiento}
                    onNew={() => {
                        setSelectedEC(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default EstadoConsentimiento;
