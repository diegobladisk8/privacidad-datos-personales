import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import revocacionTableConfig from "../tableConfig/revocacionTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import revocacionFormConfig from "../formConfig/revocacionFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const Revocacion = () => {
    const [revocaciones, setRevocaciones] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedRevocacion, setSelectedRevocacion] = useState(null);
    const [consentimientos, setConsentimientos] = useState([])
    const [flujos, setFlujos] = useState([])
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const fetchConsentimientos = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/consentimientos");
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

    const fetchFlujos = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/flujos");
            setFlujos(response.data);
        } catch (error) {
            console.error("Error al cargar los flujos:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar los flujos',
            });
        }
    };
    useEffect(() => {
        fetchConsentimientos();
        fetchFlujos();
    }, []);


    useEffect(() => {
        const fetchRevocaciones = async () => {
            setCargando(true)
            try {
                const response = await axios.get("http://localhost:5000/api/revocaciones");
                setRevocaciones(response.data);
            } catch (error) {
                console.error("Error al cargar las revocaciones:", error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Hubo un error al cargar las revocaciones',
                });
            }
            finally {
                setCargando(false)
            }
        };

        fetchRevocaciones();
    }, []);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedRevocacion) {
                await axios.put(`http://localhost:5000/api/revocaciones/${selectedRevocacion.id_revocacion}`, formData);
                const updateRevocacion = revocaciones.map((revocacion) =>
                    revocacion.id_revocacion === selectedRevocacion.id_revocacion ? { ...revocacion, ...formData } : revocacion
                );
                setRevocaciones(updateRevocacion);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Revocación actualizada correctamente',
                });
            } else {

                const response = await axios.post('http://localhost:5000/api/revocaciones', formData);


                setRevocaciones([...revocaciones, { ...formData, id_revocacion: response.data.id_revocacion }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Revocación creada correctamente',
                });
            }


            setSelectedRevocacion(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar la revocación:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar la revocación',
            });

        }
        finally {
            setCargando(false)
        }
    };

    const handleEditar = (revocacion) => {
        setSelectedRevocacion(revocacion);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`http://localhost:5000/api/revocaciones/${selectedRevocacion.id_revocacion}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updateRevocacion = revocaciones.filter(revocacion => revocacion.id_revocacion !== selectedRevocacion.id_revocacion);
                setRevocaciones(updateRevocacion);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Revocación eliminada con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar la revocación',
                });
            }
            setSelectedRevocacion(null);
        } catch (error) {
            console.error("Error al eliminar la revocacion:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar la revocación',
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
                    fields={revocacionFormConfig(consentimientos, flujos)}
                    selectedItem={selectedRevocacion}
                    initialValues={selectedRevocacion || {}}
                    onSubmit={handleCreate}
                    title={"Flujo"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedRevocacion(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Flujos"
                    columns={revocacionTableConfig}
                    data={revocaciones}
                    onNew={() => {
                        setSelectedRevocacion(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Revocacion;
