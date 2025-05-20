import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import flujoTableConfig from "../tableConfig/flujoTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import flujoFormConfig from "../formConfig/flujoFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const apiUrl = process.env.REACT_APP_API_URL;

const Flujo = () => {
    const [flujos, setFlujos] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedFlujo, setSelectedFlujo] = useState(null);
    const [canales, setCanales] = useState([])
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const fetchCanales = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/canales`);
            setCanales(response.data);
        } catch (error) {
            console.error("Error al cargar los canales:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al cargar los canales',
            });
        }
    };
    useEffect(() => {
        fetchCanales();
    }, []);


    useEffect(() => {
        const fetchFlujos = async () => {
            try {
                setCargando(true)
                const response = await axios.get(`${apiUrl}/api/flujos`);
                setFlujos(response.data);
            } catch (error) {
                console.error("Error al cargar los flujos:", error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Hubo un error al cargar los flujos',
                });
            }
            finally {
                setCargando(false)
            }
        };

        fetchFlujos();
    }, [showForm]);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedFlujo) {
                await axios.put(`${apiUrl}/api/flujos/${selectedFlujo.id_flujo}`, formData);
                const updateFlujos = flujos.map((flujo) =>
                    flujo.id_flujo === selectedFlujo.id_flujo ? { ...flujo, ...formData } : flujo
                );
                setFlujos(updateFlujos);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Flujo actualizado correctamente',
                });
            } else {

                const response = await axios.post(`${apiUrl}/api/flujos`, formData);


                setFlujos([...flujos, { ...formData, id_flujo: response.data.id_flujo }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Flujo creado correctamente',
                });
            }


            setSelectedFlujo(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar el flujo:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar el flujo',
            });

        } finally {
            setCargando(false)
        }
    };

    const handleEditar = (flujo) => {
        setSelectedFlujo(flujo);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`${apiUrl}/api/flujos/${selectedFlujo.id_flujo}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updateFlujos = flujos.filter(flujo => flujo.id_flujo !== selectedFlujo.id_flujo);
                setFlujos(updateFlujos);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Flujo eliminado con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar el flujo',
                });
            }
            setSelectedFlujo(null);
        } catch (error) {
            console.error("Error al eliminar flujo:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar el flujo',
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
                    fields={flujoFormConfig(canales)}
                    selectedItem={selectedFlujo}
                    initialValues={selectedFlujo || {}}
                    onSubmit={handleCreate}
                    title={"Flujo"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedFlujo(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Flujos"
                    columns={flujoTableConfig}
                    data={flujos}
                    onNew={() => {
                        setSelectedFlujo(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Flujo;
