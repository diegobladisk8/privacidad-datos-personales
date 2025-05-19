import { useState, useEffect } from "react";
import DynamicTable from "../components/DynamicTable";
import personaTableConfig from "../tableConfig/personaTableConfig";
import axios from "axios";
import DynamicForm from "../components/DynamicForm";
import personaFormConfig from "../formConfig/personaFormConfig";
import AlertMessage from '../components/AlertMessage';
import Loader from "../components/Loader";

const Persona = () => {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [alert, setAlert] = useState({
        open: false,
        severity: 'success',
        message: '',
    });


    useEffect(() => {
        const fetchPersona = async () => {
            try {
                setCargando(true)
                const response = await axios.get("http://localhost:5000/api/personas");
                console.log(response.data)
                setUsers(response.data);
            } catch (error) {
                console.error("Error al cargar las perosnas:", error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Hubo un error al cargar las personas',
                });
            } finally {
                setCargando(false)
            }
        };

        fetchPersona();
    }, []);

    const handleCreate = async (formData) => {
        try {
            setCargando(true)
            if (selectedUsuario) {

                await axios.put(`http://localhost:5000/api/personas/${selectedUsuario.id_persona}`, formData);

                const updatedUsers = users.map((user) =>
                    user.id_persona === selectedUsuario.id_persona ? { ...user, ...formData } : user
                );
                setUsers(updatedUsers);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Usuario actualizado correctamente',
                });
            } else {

                const response = await axios.post('http://localhost:5000/api/personas', formData);


                setUsers([...users, { ...formData, id_persona: response.data.id_persona }]);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Usuario creado correctamente',
                });
            }


            setSelectedUsuario(null);
            setShowForm(false);
        } catch (error) {
            console.error("Error al guardar la persona:", error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Hubo un error al guardar la persona',
            });

        } finally {
            setCargando(false)
        }
    };

    const handleEditar = (usuario) => {
        setSelectedUsuario(usuario);
        setShowForm(true);
    };

    const handleDelete = async () => {
        try {
            setCargando(true)
            const response = await fetch(`http://localhost:5000/api/personas/${selectedUsuario.id_persona}`, {
                method: "DELETE",
            });

            if (response.ok) {

                const updatedUsers = users.filter(user => user.id_persona !== selectedUsuario.id_persona);
                setUsers(updatedUsers);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Persona eliminada con éxito',
                });
                setShowForm(false);
            } else {
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Error al eliminar la persona',
                });
            }
            setSelectedUsuario(null);
        } catch (error) {
            console.error("Error al eliminar persona:", error);

            setAlert({
                open: true,
                severity: 'error',
                message: 'Error al eliminar la persona',
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
                    fields={personaFormConfig}
                    selectedItem={selectedUsuario}
                    initialValues={selectedUsuario || {}}
                    onSubmit={handleCreate}
                    title={"Persona"}
                    onCancel={() => {
                        setShowForm(false);
                        setSelectedUsuario(null);
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <DynamicTable
                    title="Personas"
                    columns={personaTableConfig}
                    data={users}
                    onNew={() => {
                        setSelectedUsuario(null);
                        setShowForm(true);
                    }}
                    onEdit={handleEditar}
                />
            )}
        </div>
    );
};

export default Persona;
