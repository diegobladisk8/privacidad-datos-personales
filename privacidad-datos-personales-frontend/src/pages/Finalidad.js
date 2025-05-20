import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import finalidadTableConfig from "../tableConfig/finalidadTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import finalidadFormConfig from "../formConfig/finalidadFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const apiUrl = process.env.REACT_APP_API_URL;

const Finalidad = () => {
    const [finalidades, setFinalidades] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedFinalidad, setSelectedFinalidad] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });


    useEffect(() => {
        const fetchFinalidad = async () => {
            try {
                setCargando(true)
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
            finally {
                setCargando(false)
            }
        };

        fetchFinalidad();
    }, [showForm]);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedFinalidad) {

                await axios.put(`${apiUrl}/api/personas/${selectedFinalidad.id_finalidad}`, formData);

                const updateFinalidad = finalidades.map((finalidad) =>
                    finalidad.id_finalidad === selectedFinalidad.id_finalidad ? { ...finalidad, ...formData } : finalidad
                );
                setFinalidades(updateFinalidad);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Usuario actualizado correctamente',
                });
            } else {

                const response = await axios.post(`${apiUrl}/api/finalidades`, formData);


                setFinalidades([...finalidades, { ...formData, id_finalidad: response.data.id_finalidad }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Finalidad creada correctamente',
                });
            }


            setSelectedFinalidad(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar la finalidad:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar la finalidad',
            });

        } finally {
            setCargando(false)
        }
    };

    const handleEditar = (finalidad) => {
        setSelectedFinalidad(finalidad);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`${apiUrl}/api/finalidades/${selectedFinalidad.id_finalidad}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updateFinalidad = finalidades.filter(finalidad => finalidad.id_finalidad !== selectedFinalidad.id_finalidad);
                setFinalidades(updateFinalidad);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Finalidad eliminada con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar la finalidad',
                });
            }
            setSelectedFinalidad(null);
        } catch (error) {
            console.error("Error al eliminar finalidad:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar la finalidad',
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
                    fields={finalidadFormConfig}
                    selectedItem={selectedFinalidad}
                    initialValues={selectedFinalidad || {}}
                    onSubmit={handleCreate}
                    title={"Finalidad"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedFinalidad(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Finalidades"
                    columns={finalidadTableConfig}
                    data={finalidades}
                    onNew={() => {
                        setSelectedFinalidad(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Finalidad;
