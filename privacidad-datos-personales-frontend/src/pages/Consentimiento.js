import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import consentimientoTableConfig from "../tableConfig/consentimientoTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import consentimientoFormConfig from "../formConfig/consentimientoFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const Consentimiento = () => {
    const [consentimientos, setConsentimientos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedConsentimiento, setSelectedConsentimiento] = useState(null);
    const [estadoConsentimiento, setEstadoConsentimiento] = useState([])
    const [configuraciones, setConfiguraciones] = useState([])
    const [personas, setPersonas] = useState([])
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const fetchEstadoConsentimientos = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/estado-consentimientos");
            setEstadoConsentimiento(response.data);
        } catch (error) {
            console.error("Error al cargar los estados consentimientos:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al estados consentimientos',
            });
        }
    };
    const fetchConfiguraciones = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/configuraciones");
            setConfiguraciones(response.data);
        } catch (error) {
            console.error("Error al cargar las configuraciones:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar las configuraciones',
            });
        }
    };
    const fetchPersonas = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/personas");
            console.log(response.data)
            setPersonas(response.data);
        } catch (error) {
            console.error("Error al cargar las personas:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar las personas',
            });
        }
    };
    useEffect(() => {
        fetchEstadoConsentimientos();
        fetchConfiguraciones();
        fetchPersonas();
    }, []);


    useEffect(() => {
        const fetchConsentimientos = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/consentimientos");
                console.log(response.data)
                setConsentimientos(response.data);
            } catch (error) {
                console.error("Error al cargar los consentimientos:", error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Hubo un error al cargar los consentimientos',
                });
            }
        };

        fetchConsentimientos();
    }, []);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedConsentimiento) {
                await axios.put(`http://localhost:5000/api/consentimientos/${selectedConsentimiento.id_consentimiento}`, formData);
                const updateConsentimiento = consentimientos.map((consen) =>
                    consen.id_consentimiento === selectedConsentimiento.id_consentimiento ? { ...consen, ...formData } : consen
                );
                setConsentimientos(updateConsentimiento);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Consentimiento actualizado correctamente',
                });
            } else {

                const response = await axios.post('http://localhost:5000/api/consentimientos', formData);


                setConsentimientos([...consentimientos, { ...formData, id_consentimiento: response.data.id_consentimiento }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Consentimiento creado correctamente',
                });
            }


            setSelectedConsentimiento(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar el consentimiento:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar el consentimiento',
            });

        }
        finally {
            setCargando(false)
        }
    };

    const handleEditar = (consen) => {
        setSelectedConsentimiento(consen);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/consentimientos/${selectedConsentimiento.id_consentimiento}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updateConsentimiento = consentimientos.filter(consen => consen.id_consentimiento !== selectedConsentimiento.id_consentimiento);
                setConsentimientos(updateConsentimiento);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Consentimiento eliminado con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar el consentimiento',
                });
            }
            setSelectedConsentimiento(null);
        } catch (error) {
            console.error("Error al eliminar el consentimiento:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar el consentimiento',
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
                    fields={consentimientoFormConfig(estadoConsentimiento, configuraciones, personas)}
                    selectedItem={selectedConsentimiento}
                    initialValues={selectedConsentimiento || {}}
                    onSubmit={handleCreate}
                    title={"Consentimiento"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedConsentimiento(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Consentimientos"
                    columns={consentimientoTableConfig}
                    data={consentimientos}
                    onNew={() => {
                        setSelectedConsentimiento(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Consentimiento;
