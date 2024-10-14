import React, { useState, useEffect } from 'react';// Importa React y los hooks 'useState' y 'useEffect' desde React
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider, MenuItem, Select, InputLabel } from '@mui/material';// Importa varios componentes de Material UI para la interfaz de usuario
import ApiRequest from '../../../helpers/axiosInstances';// Importa una instancia personalizada de Axios para hacer solicitudes HTTP a la API
import { AddOutlined, EditOutlined, DeleteOutline, PictureAsPdfOutlined } from '@mui/icons-material'; // Importa algunos íconos de Material UI para usar en los botones o acciones
import Page from '../../common/Page';// Importa el componente 'Page', que probablemente envuelve la estructura general de una página en la aplicación
import ToastAutoHide from '../../common/ToastAutoHide';// Importa un componente llamado 'ToastAutoHide', probablemente un componente de notificación que desaparece automáticamente
import CommonTable from '../../common/CommonTable';// Importa 'CommonTable', probablemente un componente reutilizable que muestra tablas en la aplicación
import jsPDF from 'jspdf'; // Importa la biblioteca 'jsPDF', que se usa para generar archivos PDF en el navegador
import 'jspdf-autotable'; // Importa el plugin 'autotable' para jsPDF, que facilita la creación de tablas en los archivos PDF generados



const Servicios = () => { // Define el componente funcional 'Proimpo' usando una función de flecha
    const initialState = { // Define un estado inicial (initialState) que contiene las propiedades básicas para un objeto de información
        id: "", // Propiedad 'id', inicialmente vacía
        nombre: "", // Propiedad 'nombre', inicialmente vacía
        descripcion: "", // Propiedad 'correo', inicialmente vacía
        precio: "", // Propiedad 'telefono', inicialmente vacía
        tiempo: "", // Propiedad 'direccion', inicialmente vacía
    };



    const [roles, setRoles] = useState([]);// Hook de estado para almacenar los roles, inicialmente es un array vacío
    const [usuariosList, setUsuariosList] = useState([]);// Hook de estado para almacenar la lista de usuarios, inicialmente es un array vacío
    const [body, setBody] = useState(initialState);// Hook de estado para manejar los datos del cuerpo (formulario) del componente, utilizando el estado inicial definido anteriormente
    const [openDialog, setOpenDialog] = useState(false);// Hook de estado para controlar la visibilidad de un cuadro de diálogo modal, inicialmente está cerrado (false)
    const [isEdit, setIsEdit] = useState(false);// Hook de estado para saber si se está editando un registro o creando uno nuevo, inicialmente no está en modo edición (false)
    const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null });// Hook de estado para manejar los mensajes de notificación o errores, contiene un objeto con campos como 'ident', 'message' y 'type'
    const [idDelete, setIdDelete] = useState(null);// Hook de estado para almacenar el ID del registro que se desea eliminar, inicialmente es null (ningún registro seleccionado)
    const [openDialogDelete, setOpenDialogDelete] = useState(false);// Hook de estado para controlar la visibilidad del cuadro de diálogo de eliminación, inicialmente está cerrado (false)


    
    const init = async () => {// Función asíncrona llamada 'init' para inicializar el componente
        const { data } = await ApiRequest().get('/proveedoresvvv');// Espera (await) el resultado de una solicitud HTTP GET a la API usando Axios.La solicitud se hace a la ruta '/proveedoresvvv' (probablemente para obtener una lista de proveedores)
        setUsuariosList(data);// Actualiza el estado 'usuariosList' con los datos obtenidos de la respuesta de la API
    };



    const columns = [// Define un array 'columns' que contiene la configuración de las columnas para una tabla
        { field: 'id', headerName: 'ID', width: 120 }, // Primera columna que muestra el ID (Código)
        { field: 'nombre', headerName: 'Nombre', width: 220 },// Segunda columna que muestra el nombre
        { field: 'descripcion', headerName: 'Descripcion', width: 220 },// Tercera columna que muestra el correo electrónico
        { field: 'precio', headerName: 'Precio', width: 220 },// Cuarta columna que muestra el número de teléfono
        { field: 'tiempo', headerName: 'Tiempo', width: 220 },// Quinta columna que muestra la dirección
        // Columna para acciones (como editar y eliminar)
        {
            field: '',// Este campo está vacío porque no se corresponde a una propiedad en los datos
            headerName: 'Acciones',// Título de la columna
            width: 200,// Ancho de la columna
            renderCell: (params) => (// Función que define cómo se renderiza cada celda en esta columna
                <Stack direction='row' divider={<Divider orientation="vertical" flexItem />} justifyContent="center" alignItems="center" spacing={2}>
                   {/* Botón de edición */}
                    <IconButton size='small' onClick={() => {
                        setIsEdit(true);// Cambia el estado a modo edición
                        setBody(params.row);// Establece el cuerpo del formulario con los datos de la fila seleccionada
                        handleDialog();// Abre el cuadro de diálogo
                    }}>
                        <EditOutlined />
                    </IconButton>
                     {/* Botón de eliminación */}
                    <IconButton size='small' onClick={() => {
                        handleDialogDelete(); // Abre el cuadro de diálogo de eliminación
                        setIdDelete(params.id);// Establece el ID del registro a eliminar
                    }}>
                        <DeleteOutline />
                    </IconButton>
                </Stack>
            )
        }
    ];



    const onDelete = async () => {// Función asíncrona llamada 'onDelete' que maneja la eliminación de un proveedor
        try {
            const { data } = await ApiRequest().post('/eliminar_proveedorimpo', { id: idDelete });// Envía una solicitud POST a la API para eliminar un proveedor usando su ID
            setMensaje({ // Actualiza el estado 'mensaje' con la respuesta exitosa de la API
                ident: new Date().getTime(),// Genera un identificador único basado en la hora actual
                message: data.message,// Mensaje de éxito devuelto por la API
                type: 'success'// Tipo de mensaje (éxito)
            });
            handleDialogDelete();// Cierra el cuadro de diálogo de confirmación de eliminación
            init();// Llama a la función 'init' para refrescar la lista de proveedores
        } catch ({ response }) {
            setMensaje({// Manejo de errores: si ocurre un error al hacer la solicitud
                ident: new Date().getTime(),// Genera un identificador único basado en la hora actual
                message: response.data.sqlMessage,// Mensaje de error devuelto por la API
                type: 'error'// Tipo de mensaje (error)
            });
        }
    };



    const handleDialog = () => {// Función para alternar el estado del cuadro de diálogo de edición
        setOpenDialog(prev => !prev);// Cambia el estado 'openDialog' al valor contrario del estado anterior
    };



    const handleDialogDelete = () => {// Función para alternar el estado del cuadro de diálogo de eliminación
        setOpenDialogDelete(prev => !prev);// Cambia el estado 'openDialogDelete' al valor contrario del estado anterior
    };



    const onChange = ({ target }) => {// Función que maneja el cambio de valores en un formulario
        const { name, value } = target;// Desestructura 'name' y 'value' del objeto 'target'
        setBody({// Actualiza el estado 'body' con el nuevo valor basado en el campo del formulario
            ...body,// Mantiene los valores anteriores en 'body'
            [name]: value// Actualiza el valor del campo correspondiente al 'name' con el nuevo 'value'
        });
    };



    const onSubmit = async () => {// Función asíncrona llamada 'onSubmit' que maneja el envío del formulario
        try {
            const { data } = await ApiRequest().post('/guardar_proveedorimpo', body); // Envía una solicitud POST a la API para guardar un nuevo proveedor con los datos del cuerpo del formulario
            handleDialog();// Cierra el cuadro de diálogo de edición
            setBody(initialState);// Restablece el cuerpo del formulario a su estado inicial
            setMensaje({// Actualiza el estado 'mensaje' con la respuesta exitosa de la API
                ident: new Date().getTime(),// Genera un identificador único basado en la hora actual
                message: data.message,// Mensaje de éxito devuelto por la API
                type: 'success'// Tipo de mensaje (éxito)
            });
            init();// Llama a la función 'init' para refrescar la lista de proveedores
            setIsEdit(false); // Cambia el estado 'isEdit' a falso para indicar que no se está editand
        } catch ({ response }) {
            setMensaje({// Manejo de errores: si ocurre un error al hacer la solicitud
                ident: new Date().getTime(),// Genera un identificador único basado en la hora actual
                message: response.data.sqlMessage,// Mensaje de error devuelto por la API
                type: 'error'// Tipo de mensaje (error)
            });
        }
    };



    const onEdit = async () => {// Función asíncrona llamada 'onEdit' que maneja la edición de un proveedor
        try {
            const { data } = await ApiRequest().post('/editar_proveedorimpo', body);// Envía una solicitud POST a la API para editar un proveedor con los datos del cuerpo del formulario
            handleDialog();// Cierra el cuadro de diálogo de edición
            setBody(initialState);// Restablece el cuerpo del formulario a su estado inicial
            setMensaje({// Actualiza el estado 'mensaje' con la respuesta exitosa de la API
                ident: new Date().getTime(),// Genera un identificador único basado en la hora actual
                message: data.message,// Mensaje de éxito devuelto por la API
                type: 'success'// Tipo de mensaje (éxito)
            });
            init();// Llama a la función 'init' para refrescar la lista de proveedores
        } catch ({ response }) {
            setMensaje({// Manejo de errores: si ocurre un error al hacer la solicitud
                ident: new Date().getTime(),// Genera un identificador único basado en la hora actual
                message: response.data.sqlMessage,// Mensaje de error devuelto por la API
                type: 'error'// Tipo de mensaje (error)
            });
        }
    };



    //REPORTES EXTRAS QUE NO SE UTILIZARAN

    // Función para generar el reporte PDF con todos los usuarios
    const generatePDF = (usuarios, title) => {
        const doc = new jsPDF();
        doc.text(title, 20, 10);
        doc.autoTable({
            head: [['ID', 'Correo', 'Nombre', 'Usuario', 'Rol', 'Estado']],
            body: usuarios.map(user => [user.id, user.correo, user.nombre, user.usuario, user.rol, user.estado])
        });
        doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    };



    // Generar reporte de todos los usuarios
    const handleGenerateAllUsersReport = () => {
        generatePDF(usuariosList, 'Reporte de Todos los Usuarios');
    };



    // Generar reporte de usuarios activos
    const handleGenerateActiveUsersReport = () => {
        const activeUsers = usuariosList.filter(user => user.estado === 'Activo');
        generatePDF(activeUsers, 'Reporte de Usuarios Activos');
    };



    // Generar reporte de usuarios inactivos
    const handleGenerateInactiveUsersReport = () => {
        const inactiveUsers = usuariosList.filter(user => user.estado === 'Inactivo');
        generatePDF(inactiveUsers, 'Reporte de Usuarios Inactivos');
    };



    // Generar reporte de usuarios con rol ADMIN
    const handleGenerateAdminUsersReport = () => {
        const adminUsers = usuariosList.filter(user => user.rol === '1');
        generatePDF(adminUsers, 'Reporte de Usuarios ADMIN');
    };



    // Generar reporte de usuarios con rol User
    const handleGenerateUserUsersReport = () => {
        const userUsers = usuariosList.filter(user => user.rol === '2');
        generatePDF(userUsers, 'Reporte de Usuarios User');
    };



    const fetchRoles = async () => {// Función asíncrona llamada 'fetchRoles' que obtiene los roles desde la API
        try {
        const response = await ApiRequest().get('/roles'); // Realiza una solicitud GET a la API en la ruta '/roles'
        setRoles(response.data);// Establece el estado 'roles' con los datos obtenidos de la respuesta de la API
        } catch (error) {// Manejo de errores: si ocurre un error al hacer la solicitud
        console.error('Error fetching roles data:', error);// Imprime un mensaje de error en la consola
        }
    };


   
    useEffect(() => {// Utiliza el hook useEffect para ejecutar efectos secundarios en el componente
        // Llama a la función fetchRoles para obtener los roles desde la API
        fetchRoles(); // Fetch marca options when the component mounts.
        init();// Llama a la función init para inicializar otros datos necesarios
    }, []);// El segundo argumento vacío significa que este efecto se ejecutará solo una vez al montar el componente



    return (
        <>
        {/* Diálogo de confirmación para la eliminación de un proveedor */}
            <Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
                <DialogTitle>
                ¿Está seguro de que desea eliminar el servicio de Car Wash?
                </DialogTitle>
                <DialogContent>
                    <Typography variant='h5'>Esta acción no se puede deshacer</Typography>
                </DialogContent>
                <DialogActions>
                    {/* Botón para cancelar la acción de eliminación */}
                    <Button variant='text' color='primary' onClick={handleDialogDelete}>Anular Eliminacion</Button>
                    {/* Botón para confirmar la eliminación del proveedor */}
                    <Button variant='contained' color='primary' onClick={onDelete}>Confirmar Eliminacion</Button>
                </DialogActions>
            </Dialog>


            {/* Diálogo para editar o crear un proveedor */}
            <Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
                <DialogTitle>
                     {/* Título dinámico basado en el estado de edición */}
                    {isEdit ? 'Formulario de Edicion de Servicios de Car Wash' : 'Formulario de Registro de Servicios de Car Wash'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {/* Campo de texto para el nombre del proveedor */}
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='nombre'
                                value={body.nombre}// Vinculado al estado 'body'
                                onChange={onChange}// Maneja el cambio en el campo
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Nombre'
                            />
                        </Grid>
                        {/* Campo de texto para el correo del proveedor */}
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='descripcion'
                                value={body.descripcion}// Vinculado al estado 'body'
                                onChange={onChange}// Maneja el cambio en el campo
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Descripcion'
                            />
                        </Grid>
                        {/* Campo de texto para el teléfono del proveedor */}
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='precio'
                                value={body.precio}// Vinculado al estado 'body'
                                onChange={onChange}// Maneja el cambio en el campo
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Precio'
                            />
                        </Grid>
                        {/* Campo de texto para la dirección del proveedor */}
                        <Grid item xs={12} sm={12}>
                            <TextField
                                margin='normal'
                                name='tiempo'
                                value={body.tiempo}// Vinculado al estado 'body'
                                onChange={onChange}// Maneja el cambio en el campo
                                variant='outlined'
                                size='small'
                                color='primary'
                                fullWidth
                                label='Tiempo'
                            />
                        </Grid>  
                    </Grid>
                </DialogContent>
                <DialogActions>
                     {/* Botón para cancelar la acción de edición o creación */}
                    <Button variant='text' color='primary' onClick={handleDialog}>Anular Registro</Button>
                    {/* Botón para guardar el proveedor, que llama a onEdit o onSubmit dependiendo del estado */}
                    <Button variant='contained' color='primary' onClick={isEdit ? () => onEdit() : () => onSubmit()}>Registrar Proveedor de Vehiculos</Button>
                </DialogActions>
            </Dialog>


            {/* Componente de la página principal con un título */}
            <Page title="FF| Proveedor de Vehiculos">
                <ToastAutoHide message={mensaje} />{/* Componente para mostrar mensajes temporales */}
                <Container maxWidth='lg'>
                    <Box sx={{ pb: 5 }}>
                        <Typography variant="h5">Panel de Control de Proveedores de Vehiculos</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={3}>
                             {/* Botón para agregar un nuevo proveedor */}
                            <Button onClick={() => {setIsEdit(false); handleDialog(); setBody(initialState);}} startIcon={<AddOutlined />} variant='contained' color='primary'> Registrar Proveedor de Vehiculo</Button>
                        </Grid>



                        {/* Botones de reporte de PDF con color azul más oscuro */}
                        {/*
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateAllUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (Todos)</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateActiveUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (Activos)</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateInactiveUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (Inactivos)</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateAdminUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (ADMIN)</Button>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button onClick={handleGenerateUserUsersReport} startIcon={<PictureAsPdfOutlined />} variant='contained' style={{ backgroundColor: '#002244', color: 'white' }}> Reporte Usuarios (User)</Button>
                        </Grid>
                        */}



                        <Grid item xs={12} sm={12}>
                            <CommonTable data={usuariosList} columns={columns} /> {/* Componente de tabla que muestra la lista de usuarios */}
                        </Grid>
                    </Grid>
                </Container>
            </Page>
        </>
    );
}

export default Servicios;// Exporta el componente Proimpo como la exportación por defecto
