import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import AlertMessage from '../components/AlertMessage';
import canalTableConfig from '../tableConfig/canalTableConfig'
import canalFormConfig from "../formConfig/canalFormConfig";
import Loader from "../components/Loader";

const Canal = () => {
    const [canales, setCanales] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedCanal, setSelectedCanal] = useState(null)
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setCargando(true)
                const response = await axios.get("http://localhost:5000/api/canales");
                setCanales(response.data);
            } catch (error) {
                console.error("Error al cargar los canales:", error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Hubo un error al cargar los canales',
                });
            }
            finally {
                setCargando(false)
            }
        };

        fetchUsers();
    }, []);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedCanal) {

                await axios.put(`http://localhost:5000/api/canales/${selectedCanal.id_canal}`, formData);

                const updateCanales = canales.map((canal) =>
                    canal.id_persona === selectedCanal.id_canal ? { ...canal, ...formData } : canal
                );
                setCanales(updateCanales);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Canal actualizado correctamente',
                });
            } else {
                console.log(formData)
                const response = await axios.post('http://localhost:5000/api/canales', formData);


                setCanales([...canales, { ...formData, id_canal: response.data.id_canal }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Canal creado correctamente',
                });
            }


            setSelectedCanal(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar el canal:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar el canal',
            });

        }
        finally {
            setCargando(false)
        }
    };

    const handleEditar = (usuario) => {
        setSelectedCanal(usuario);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`http://localhost:5000/api/canales/${selectedCanal.id_canal}`, {
                method: "DELETE",
            });

            if (response.ok) {
                // Filtrar los usuarios eliminados de la lista
                const updateCanales = canales.filter(canal => canal.id_canal !== selectedCanal.id_canal);
                setCanales(updateCanales); // Actualizar el estado de users
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Canal eliminado con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar el canal',
                });
            }
            setSelectedCanal(null);
        } catch (error) {
            console.error("Error al eliminar persona:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar el canal',
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
                    fields={canalFormConfig}
                    initialValues={selectedCanal || {}}
                    selectedItem={selectedCanal}
                    onSubmit={handleCreate}
                    title={"Canal"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedCanal(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Canales"
                    columns={canalTableConfig}
                    data={canales}
                    onNew={() => {
                        setSelectedCanal(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Canal;
